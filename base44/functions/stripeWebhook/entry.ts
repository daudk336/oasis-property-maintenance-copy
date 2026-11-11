import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import Stripe from 'npm:stripe@17';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const invoiceId = session.metadata?.invoice_id;

      if (invoiceId) {
        const invoice = await base44.asServiceRole.entities.Invoice.get(invoiceId);
        if (invoice && invoice.status !== 'paid') {
          const today = new Date().toISOString().split('T')[0];
          await base44.asServiceRole.entities.Invoice.update(invoiceId, {
            status: 'paid',
            paid_date: today,
          });
          await base44.asServiceRole.entities.Message.create({
            client_name: invoice.client_name,
            channel: 'email',
            recipient: invoice.client_email || '-',
            subject: `Payment received — ${invoice.invoice_number}`,
            body: `Stripe payment of $${(invoice.total || 0).toFixed(2)} received for invoice ${invoice.invoice_number} from ${invoice.client_name}.`,
            status: 'logged',
          });
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('stripeWebhook error:', error.message);
    return Response.json({ error: error.message }, { status: 400 });
  }
});