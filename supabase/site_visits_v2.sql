-- A exécuter une seule fois dans Supabase (SQL Editor), après supabase/site_visits.sql.
-- Ajoute le nom/modèle de l'appareil (ex: "iPhone", "SM-A536E") et autorise
-- l'admin connecté à réinitialiser (vider) le trafic depuis le tableau de bord.

alter table public.site_visits add column if not exists device_name text;

drop policy if exists "Authenticated can delete visits" on public.site_visits;
create policy "Authenticated can delete visits"
  on public.site_visits for delete
  to authenticated
  using (true);
