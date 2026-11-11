import Stripe from "npm:stripe@17.7.0";

const corsHeaders = (origin: string) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});

const json = (body: unknown, status: number, origin: string) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });

function allowedOrigin(request: Request): string | null {
  const origin = request.headers.get("origin");
  const allowed = (Deno.env.get("ALLOWED_PAYMENT_ORIGINS") ?? "")
    .split(",")
    .map((value) => value.trim().replace(/\/$/, ""))
    .filter(Boolean);
  if (!origin || !allowed.includes(origin.replace(/\/$/, ""))) return null;
  return origin;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    const origin = allowedOrigin(request);
    if (!origin) return new Response("Origin not allowed", { status: 403 });
    return new Response("ok", { headers: corsHeaders(origin) });
  }

  const origin = allowedOrigin(request);
  if (!origin) return new Response("Origin not allowed", { status: 403 });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);

  try {
    const { invoice_id, action } = await request.json();
    if (typeof invoice_id !== "string" || !invoice_id.trim() || invoice_id.length > 200) {
      return json({ error: "A valid invoice_id is required" }, 400, origin);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) {
      console.error("Missing Supabase server configuration");
      return json({ error: "Invoice service is not configured" }, 500, origin);
    }

    const query = new URLSearchParams({
      id: `eq.${invoice_id}`,
      select: "id,invoice_number,client_name,items,total,issue_date,due_date,status,notes",
      limit: "1",
    });
    const invoiceResponse = await fetch(`${supabaseUrl}/rest/v1/invoices?${query}`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Accept: "application/json",
      },
    });
    if (!invoiceResponse.ok) {
      console.error("Invoice lookup failed", invoiceResponse.status, await invoiceResponse.text());
      return json({ error: "Unable to retrieve this invoice" }, 502, origin);
    }

    const rows = await invoiceResponse.json();
    const invoice = rows?.[0];
    if (!invoice) return json({ error: "Invoice not found" }, 404, origin);

    const summary = {
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      client_name: invoice.client_name,
      items: invoice.items || [],
      total: Number(invoice.total),
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      status: invoice.status,
      notes: invoice.notes,
    };

    if (action !== "checkout") return json({ invoice: summary }, 200, origin);
    if (invoice.status === "paid") {
      return json({ error: "This invoice has already been paid" }, 400, origin);
    }

    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecret) {
      console.error("Missing STRIPE_SECRET_KEY");
      return json({ error: "Payment service is not configured" }, 500, origin);
    }

    const lineItems = Array.isArray(invoice.items) && invoice.items.length > 0
      ? invoice.items
      : [{ description: `Invoice ${invoice.invoice_number}`, quantity: 1, price: invoice.total }];

    const stripeLines = lineItems.map((item: { description?: string; quantity?: number; price?: number }) => {
      const quantity = Number(item.quantity ?? 1);
      const unitAmount = Math.round(Number(item.price ?? 0) * 100);
      if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isInteger(quantity) ||
          !Number.isFinite(unitAmount) || unitAmount <= 0) {
        throw new Error("Invoice contains an invalid line item");
      }
      return {
        price_data: {
          currency: "aud",
          product_data: { name: String(item.description || "Property service").slice(0, 500) },
          unit_amount: unitAmount,
        },
        quantity,
      };
    });

    const stripe = new Stripe(stripeSecret);
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: stripeLines,
      success_url: `${origin}/PayInvoice?invoice=${encodeURIComponent(invoice_id)}&paid=1`,
      cancel_url: `${origin}/PayInvoice?invoice=${encodeURIComponent(invoice_id)}`,
      metadata: { invoice_id },
    });

    return json({ url: checkout.url }, 200, origin);
  } catch (error) {
    console.error("invoicePayment error:", error instanceof Error ? error.message : error);
    return json({ error: error instanceof Error ? error.message : "Unexpected payment error" }, 500, origin);
  }
});
