import Stripe from "npm:stripe@17.7.0";

Deno.serve(async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const signature = request.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!signature || !webhookSecret || !supabaseUrl || !serviceKey || !Deno.env.get("STRIPE_SECRET_KEY")) {
    console.error("Stripe webhook is missing required server configuration");
    return new Response("Webhook is not configured", { status: 500 });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);
  const cryptoProvider = Stripe.createSubtleCryptoProvider();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      await request.text(),
      signature,
      webhookSecret,
      undefined,
      cryptoProvider,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    const invoiceId = session.metadata?.invoice_id;

    if (session.payment_status === "paid" && invoiceId) {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/invoices?id=eq.${encodeURIComponent(invoiceId)}`,
        {
          method: "PATCH",
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            status: "paid",
            paid_date: new Date().toISOString().slice(0, 10),
            updated_at: new Date().toISOString(),
          }),
        },
      );

      if (!response.ok) {
        console.error("Could not mark invoice paid:", response.status, await response.text());
        return new Response("Could not update invoice", { status: 500 });
      }
    }
  }

  return Response.json({ received: true });
});
