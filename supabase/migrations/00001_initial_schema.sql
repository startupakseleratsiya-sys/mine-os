-- Enable pgcrypto for UUID generation
create extension if not exists "pgcrypto";

-- Enum for User Roles
create type user_role as enum ('user', 'admin');

-- Users Table (Extends Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  role user_role default 'user'::user_role not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Courses Table
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  level text default 'Boshlang''ich',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Progress Table
create table public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  course_id uuid references public.courses on delete cascade not null,
  completed_lessons integer default 0,
  last_accessed timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_id)
);

-- Chat Sessions
create table public.chat_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Chat Messages
create table public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.chat_sessions on delete cascade not null,
  role text check (role in ('user', 'assistant')) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.courses enable row level security;
alter table public.user_progress enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- RLS Policies

-- Users: Users can read their own data, Admins can read all.
create policy "Users can read own data" on public.users for select using (auth.uid() = id);
create policy "Admins can read all users" on public.users for select using ((select role from public.users where id = auth.uid()) = 'admin');
create policy "Users can update own data" on public.users for update using (auth.uid() = id);

-- Courses: Everyone can read courses. Admins can insert/update/delete.
create policy "Courses are viewable by everyone" on public.courses for select using (true);
create policy "Admins can manage courses" on public.courses for all using ((select role from public.users where id = auth.uid()) = 'admin');

-- User Progress: Users can read and update their own progress.
create policy "Users can manage own progress" on public.user_progress for all using (auth.uid() = user_id);

-- Chat Sessions & Messages: Users can only see and manage their own chats.
create policy "Users can manage own chat sessions" on public.chat_sessions for all using (auth.uid() = user_id);
create policy "Users can manage own chat messages" on public.chat_messages for all using (
  session_id in (select id from public.chat_sessions where user_id = auth.uid())
);

-- Create a trigger to automatically create a user profile when a user signs up
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
