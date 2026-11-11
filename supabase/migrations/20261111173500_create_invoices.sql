-- Invoice records used by the public invoice-payment page.
-- IDs remain text so Base44 invoice IDs can be preserved during import.
create table if not exists public.invoices (
  id text primary key,
  invoice_number text not null,
  client_name text not null,
  client_email text,
  job_id text,
  items jsonb not null default '[]'::jsonb,
  total numeric(12, 2) not null check (total >= 0),
  issue_date date,
  due_date date,
  paid_date date,
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'paid', 'overdue')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.invoices enable row level security;
revoke all on table public.invoices from anon, authenticated;
grant all on table public.invoices to service_role;

create index if not exists invoices_status_idx on public.invoices(status);
