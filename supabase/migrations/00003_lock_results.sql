-- Natijalarni soxtalashtirishni yopish: foydalanuvchi o'z JWT'si bilan to'g'ridan-to'g'ri REST orqali
-- lesson_progress / exam_attempts / exam_answers ga YOZA OLMAYDI (aks holda testsiz darsni «o'tgan»,
-- soxta imtihon natijasi bilan sertifikat olishi mumkin edi). Yozishni faqat server (service role) qiladi —
-- server action'lar javoblarni kalit bilan tekshirgandan keyin. O'qish (o'z natijalari) ochiq qoladi.
-- Idempotent.

-- lesson_progress: avval «for all» edi → faqat o'qish.
drop policy if exists "lesson_progress_own" on public.lesson_progress;
drop policy if exists "lesson_progress_select_own" on public.lesson_progress;
create policy "lesson_progress_select_own" on public.lesson_progress
  for select to authenticated
  using ((select auth.uid()) = user_id);

-- exam_attempts / exam_answers: insert siyosatlari olib tashlanadi.
drop policy if exists "exam_attempts_insert_own" on public.exam_attempts;
drop policy if exists "exam_answers_insert_own" on public.exam_answers;

-- Qo'shimcha himoya: authenticated/anon roli uchun yozish huquqlari umuman yo'q.
revoke insert, update, delete on public.lesson_progress from anon, authenticated;
revoke insert, update, delete on public.exam_attempts from anon, authenticated;
revoke insert, update, delete on public.exam_answers from anon, authenticated;

-- AI ustoz suhbatlari: foydalanuvchi faqat o'qiydi. Yozishni server qiladi (xabarlar soni — xarajat limiti;
-- o'chirib/o'zgartirib limitni «nolga tushirib» bo'lmasin).
drop policy if exists "chat_sessions_own" on public.chat_sessions;
drop policy if exists "chat_sessions_select_own" on public.chat_sessions;
create policy "chat_sessions_select_own" on public.chat_sessions
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "chat_messages_own" on public.chat_messages;
drop policy if exists "chat_messages_select_own" on public.chat_messages;
create policy "chat_messages_select_own" on public.chat_messages
  for select to authenticated
  using (session_id in (select id from public.chat_sessions where user_id = (select auth.uid())));

revoke insert, update, delete on public.chat_sessions from anon, authenticated;
revoke insert, update, delete on public.chat_messages from anon, authenticated;

-- Ism sertifikatda chiqadi: REST orqali ham 60 belgidan uzun qiymat yozib bo'lmasin (bo'sh ism bilan ro'yxatdan o'tish buzilmasin).
update public.users set full_name = left(full_name, 60) where full_name is not null and char_length(full_name) > 60;
alter table public.users drop constraint if exists users_full_name_length;
alter table public.users add constraint users_full_name_length
  check (full_name is null or char_length(full_name) <= 60) not valid;

notify pgrst, 'reload schema';
