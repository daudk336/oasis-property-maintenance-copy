import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import Stripe from 'npm:stripe@17';

// Public endpoint: clients open a payment link without logging in.
// action omitted -> returns safe invoice summary. action='checkout' -> creates Stripe checkout session.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { invoice_id, action, origin } = await req.json();
    if (!invoice_id) {
      return Response.json({ error: 'invoice_id is required' }, { status: 400 });
    }

    const invoice = await base44.asServiceRole.entities.Invoice.get(invoice_id);
    if (!invoice) {
      return Response.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const summary = {
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      client_name: invoice.client_name,
      items: invoice.items || [],
      total: invoice.total,
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      status: invoice.status,
      notes: invoice.notes,
    };

    if (action !== 'checkout') {
      return Response.json({ invoice: summary });
    }

    if (invoice.status === 'paid') {
      return Response.json({ error: 'This invoice has already been paid' }, { status: 400 });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const items = (invoice.items && invoice.items.length > 0)
      ? invoice.items
      : [{ description: `Invoice ${invoice.invoice_number}`, quantity: 1, price: invoice.total }];

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items.map((i) => ({
        price_data: {
          currency: 'aud',
          product_data: { name: i.description || 'Property service' },
          unit_amount: Math.round((Number(i.price) || 0) * 100),
        },
        quantity: Number(i.quantity) || 1,
      })),
      success_url: `${origin}/PayInvoice?invoice=${invoice_id}&paid=1`,
      cancel_url: `${origin}/PayInvoice?invoice=${invoice_id}`,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        invoice_id: invoice_id,
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('invoicePayment error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});