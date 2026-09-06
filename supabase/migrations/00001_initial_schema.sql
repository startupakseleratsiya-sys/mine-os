-- Finora — asosiy sxema.
-- Idempotent: SQL Editor'da bir necha marta ishga tushirsa ham xato bermaydi.
-- Jonli bazada (2026-09-07 holatiga) hech qanday jadval yo'q edi — bu fayl noldan yaratadi.

create extension if not exists "pgcrypto";

-- ───────────────────────────── Rollar ─────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('user', 'admin');
  end if;
end $$;

-- ───────────────────────────── users ─────────────────────────────
-- auth.users'ni kengaytiradi. Trigger orqali avtomatik yaratiladi.
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now()
);

-- Admin tekshiruvi. `security definer` — users jadvalidagi RLS'ni chetlab o'tadi,
-- aks holda "Admins can read all users" siyosati o'z-o'zini chaqirib
-- "infinite recursion detected in policy" xatosini beradi (eski sxemadagi bug).
create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select role = 'admin' from public.users where id = (select auth.uid())),
    false
  );
$$;

alter table public.users enable row level security;

drop policy if exists "Users can read own data" on public.users;
drop policy if exists "Admins can read all users" on public.users;
drop policy if exists "Users can update own data" on public.users;
drop policy if exists "users_select_own_or_admin" on public.users;
drop policy if exists "users_update_own" on public.users;

create policy "users_select_own_or_admin" on public.users
  for select to authenticated
  using ((select auth.uid()) = id or (select private.is_admin()));

-- Foydalanuvchi faqat o'z qatorini yangilaydi (rol ustuni trigger bilan himoyalangan, pastda).
create policy "users_update_own" on public.users
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Oddiy foydalanuvchi o'z rolini o'zgartira olmaydi.
create or replace function public.protect_user_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role and not (select private.is_admin()) then
    raise exception 'Rolni o''zgartirishga ruxsat yo''q';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_user_role on public.users;
create trigger protect_user_role
  before update on public.users
  for each row execute function public.protect_user_role();

-- Ro'yxatdan o'tganda profil yaratish.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, full_name, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1)),
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Mavjud auth foydalanuvchilar uchun profil (migratsiya kech qo'llanganda).
insert into public.users (id, full_name, role)
select
  u.id,
  coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), split_part(u.email, '@', 1)),
  'user'
from auth.users u
on conflict (id) do nothing;

-- ───────────────────────────── lesson_progress ─────────────────────────────
-- Kurslar va boblar kodda (src/content/courses.ts) saqlanadi, bazada faqat
-- "kim qaysi bobni qachon tugatdi" yoziladi.
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  course_slug text not null,
  chapter_id text not null,
  completed_at timestamptz not null default now(),
  unique (user_id, course_slug, chapter_id)
);

create index if not exists lesson_progress_user_id_idx on public.lesson_progress (user_id, completed_at desc);

alter table public.lesson_progress enable row level security;

drop policy if exists "lesson_progress_own" on public.lesson_progress;
drop policy if exists "lesson_progress_admin_read" on public.lesson_progress;

create policy "lesson_progress_own" on public.lesson_progress
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "lesson_progress_admin_read" on public.lesson_progress
  for select to authenticated
  using ((select private.is_admin()));

-- ───────────────────────────── chat ─────────────────────────────
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_sessions_user_id_idx on public.chat_sessions (user_id, created_at desc);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_session_id_idx on public.chat_messages (session_id, created_at);

alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "Users can manage own chat sessions" on public.chat_sessions;
drop policy if exists "Users can manage own chat messages" on public.chat_messages;
drop policy if exists "chat_sessions_own" on public.chat_sessions;
drop policy if exists "chat_sessions_admin_read" on public.chat_sessions;
drop policy if exists "chat_messages_own" on public.chat_messages;

create policy "chat_sessions_own" on public.chat_sessions
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "chat_sessions_admin_read" on public.chat_sessions
  for select to authenticated
  using ((select private.is_admin()));

create policy "chat_messages_own" on public.chat_messages
  for all to authenticated
  using (
    session_id in (select id from public.chat_sessions where user_id = (select auth.uid()))
  )
  with check (
    session_id in (select id from public.chat_sessions where user_id = (select auth.uid()))
  );

-- Eski, ishlatilmaydigan jadvallar (agar qachondir yaratilgan bo'lsa).
drop table if exists public.user_progress;
drop table if exists public.courses;
