-- A exécuter une seule fois dans Supabase (Dashboard > SQL Editor > New query).
-- Crée la table qui enregistre chaque visite du site (page, appareil, navigateur, provenance),
-- utilisée par l'onglet "Trafic" du tableau de bord admin.

create table if not exists public.site_visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  visitor_id text not null,
  path text not null,
  referrer text,
  device_type text,
  browser text,
  os text,
  user_agent text,
  screen_w int,
  screen_h int,
  language text
);

create index if not exists site_visits_created_at_idx on public.site_visits (created_at desc);

alter table public.site_visits enable row level security;

-- N'importe quel visiteur du site public peut enregistrer sa propre visite.
create policy "Anyone can insert a visit"
  on public.site_visits for insert
  to anon, authenticated
  with check (true);

-- Seuls les comptes admin connectés (authenticated) peuvent lire les visites.
create policy "Authenticated can read visits"
  on public.site_visits for select
  to authenticated
  using (true);

-- Pour que les nouvelles visites apparaissent en direct dans le dashboard admin,
-- active aussi la réplication realtime : Database > Replication > coche "site_visits".
