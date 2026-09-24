-- CP3P imtihon natijalari: mock va mashq urinishlari + har bir javob (statistika va tayyorlik uchun).
-- Idempotent: qayta ishga tushirsa xato bermaydi.

create table if not exists public.exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  exam text not null,                                   -- 'cp3p-foundation'
  mode text not null check (mode in ('mock', 'practice')),
  score integer not null check (score >= 0),
  total integer not null check (total > 0 and score <= total),
  passed boolean,
  duration_seconds integer check (duration_seconds >= 0),
  area_scores jsonb not null default '{}'::jsonb,       -- {"concept": {"correct": 5, "total": 7}, ...}
  started_at timestamptz,
  finished_at timestamptz not null default now()
);

create index if not exists exam_attempts_user_idx on public.exam_attempts (user_id, finished_at desc);

create table if not exists public.exam_answers (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  attempt_id uuid references public.exam_attempts (id) on delete cascade,
  exam text not null,
  question_id text not null,
  chosen smallint,                                      -- null = javobsiz qoldirilgan
  correct boolean not null,
  answered_at timestamptz not null default now()
);

create index if not exists exam_answers_user_idx on public.exam_answers (user_id, exam, answered_at desc);

alter table public.exam_attempts enable row level security;
alter table public.exam_answers enable row level security;

-- Foydalanuvchi faqat o'z natijalarini ko'radi va qo'shadi; o'zgartirish/o'chirish yo'q (natija soxtalashtirilmasin).
drop policy if exists "exam_attempts_select_own" on public.exam_attempts;
create policy "exam_attempts_select_own" on public.exam_attempts
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "exam_attempts_insert_own" on public.exam_attempts;
create policy "exam_attempts_insert_own" on public.exam_attempts
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "exam_answers_select_own" on public.exam_answers;
create policy "exam_answers_select_own" on public.exam_answers
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "exam_answers_insert_own" on public.exam_answers;
create policy "exam_answers_insert_own" on public.exam_answers
  for insert to authenticated with check ((select auth.uid()) = user_id);

-- Adminlar hamma natijani ko'radi (00001 dagi private.is_admin()).
drop policy if exists "exam_attempts_select_admin" on public.exam_attempts;
create policy "exam_attempts_select_admin" on public.exam_attempts
  for select to authenticated using (private.is_admin());

notify pgrst, 'reload schema';
