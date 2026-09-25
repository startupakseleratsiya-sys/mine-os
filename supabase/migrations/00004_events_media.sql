-- 00004: analitika hodisalari (KPI uchun) va dars pleyerining o'rni (boshqa qurilmada «shu joydan davom»).
-- Ikkalasini ham faqat server (service role) yozadi. Idempotent — qayta ishga tushirsa bo'ladi.

-- 1) Hodisalar: lesson_opened, test_started, test_finished, media_played ...
create table if not exists public.events (
  id bigserial primary key,
  user_id uuid references auth.users (id) on delete cascade,
  name text not null check (char_length(name) <= 40),
  props jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists events_name_created_idx on public.events (name, created_at desc);
create index if not exists events_user_created_idx on public.events (user_id, created_at desc);

alter table public.events enable row level security;
-- Siyosat yo'q = anon/authenticated hech narsa ko'rmaydi va yozmaydi; service role RLS'ni chetlab o'tadi.
revoke all on public.events from anon, authenticated;

-- 2) Pleyer o'rni: har dars va har tab (video/audio) uchun bitta qator.
create table if not exists public.media_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null check (char_length(lesson_id) <= 80),
  kind text not null check (kind in ('video', 'audio')),
  part integer not null check (part >= 0 and part < 100),
  offset_sec real not null check (offset_sec >= 0 and offset_sec < 3600),
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id, kind)
);

alter table public.media_progress enable row level security;
drop policy if exists "media_progress_select_own" on public.media_progress;
create policy "media_progress_select_own" on public.media_progress
  for select to authenticated
  using ((select auth.uid()) = user_id);
revoke insert, update, delete on public.media_progress from anon, authenticated;

notify pgrst, 'reload schema';
