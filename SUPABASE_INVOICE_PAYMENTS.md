# Supabase invoice payments

The public `PayInvoice` page now calls the `invoicePayment` Supabase Edge Function. The function reads invoice records from `public.invoices` and creates Stripe Checkout sessions. It does not call the Base44 backend.

## Required setup

1. Link this repository to the **Supabase project created for this app**. Do not use the Super Vibe platform's own Supabase project.
2. Apply the SQL migration in `supabase/migrations` using the Supabase CLI or SQL editor.
3. Import the existing Base44 Invoice records into `public.invoices`. Preserve each Base44 record ID in the `id` column. Map the entity fields to the same-named columns. The migration creates the table but does not copy Base44 data.
4. Set Edge Function secrets:
   - `STRIPE_SECRET_KEY`: Stripe secret key for this app.
   - `ALLOWED_PAYMENT_ORIGINS`: comma-separated exact published app origins, for example `https://your-app.example.com`. Include a local development origin only while testing.
   Supabase supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the Edge Function runtime.
5. Set frontend build variables:
   - `VITE_SUPABASE_URL`: this app's Supabase project URL.
   - `VITE_SUPABASE_ANON_KEY`: this app's legacy anon key or publishable key.
6. Deploy the Edge Function:
   `supabase functions deploy invoicePayment --project-ref <project-ref>`
7. Build and publish the frontend, then test an unpaid invoice and a paid invoice. Use Stripe test mode before switching to the live key.

## Security notes

- The service-role key and Stripe secret are only read by the Edge Function. Never add them to Vite variables or commit them.
- The function has public invocation to support the existing unauthenticated invoice-payment page. It enforces an exact origin allowlist and returns only the fields needed by that page. Invoice IDs should remain unguessable.
- The function rejects checkout for invoices already marked paid.
- This function creates Checkout sessions. It does not mark invoices paid. A verified Stripe webhook that updates `public.invoices.status` and `paid_date` is required before payment status is authoritative. The current UI's `paid=1` query parameter is retained for compatibility and must not be treated as proof of payment.
