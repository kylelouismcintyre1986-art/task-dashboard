create extension if not exists "pgcrypto";

create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  process text not null check (process in ('Fermentation', 'Distillation', 'Aging')),
  status text not null default 'Draft',
  volume_litres numeric not null check (volume_litres > 0),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fermentation_readings (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.batches(id) on delete cascade,
  gravity numeric not null,
  ph numeric not null check (ph between 0 and 14),
  temperature_f numeric not null,
  notes text not null default '',
  recorded_at timestamptz not null default now()
);

create table if not exists public.batch_attachments (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.batches(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  created_at timestamptz not null default now()
);

alter table public.batches enable row level security;
alter table public.fermentation_readings enable row level security;
alter table public.batch_attachments enable row level security;

create policy "Users manage their batches" on public.batches for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage readings for their batches" on public.fermentation_readings for all using (exists (select 1 from public.batches where batches.id = batch_id and batches.user_id = auth.uid()));
create policy "Users manage their attachments" on public.batch_attachments for all using (exists (select 1 from public.batches where batches.id = batch_id and batches.user_id = auth.uid()));
