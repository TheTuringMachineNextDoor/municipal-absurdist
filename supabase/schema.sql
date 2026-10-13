-- The Municipal Absurdist: database for reader accounts.
--
-- HOW TO USE THIS FILE
--   1. Create a project at https://supabase.com (the free plan is enough).
--   2. In the project, open "SQL Editor", paste this whole file, and run it.
--      It is safe to run again later: nothing is created twice.
--   3. In "Authentication" > "URL Configuration", set "Site URL" to the
--      paper's address, and add that address followed by /account to
--      "Redirect URLs". (Add http://localhost:4321/account as well, to
--      sign in while developing.)
--   4. In "Project Settings" > "API", copy the Project URL and the
--      "anon public" key into `supabase` in src/data/site.ts.
--   5. Sign in once on the site with your own email address, then make
--      yourself the administrator by running, in the SQL Editor:
--        update profiles set is_admin = true
--        where id = (select id from auth.users where email = 'YOU@EXAMPLE.COM');
--
-- WHAT KEEPS IT SAFE
-- The site talks to this database straight from the reader's browser,
-- using the "anon" key, which is public. That is safe only because of
-- the "row level security" policies below: rules the database itself
-- enforces on every request, saying who may read or change each row.
-- A reader can only ever touch their own rows; only an administrator
-- can hide or remove other people's letters.

-- ---------- Profiles: one row per reader ----------
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  -- The name printed beside their letters. Never their email address.
  display_name text not null default 'A Reader' check (char_length(display_name) between 1 and 40),
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Make a profile automatically whenever someone signs up.
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Is the person making this request an administrator?
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$;

alter table profiles enable row level security;

drop policy if exists "Names are public" on profiles;
create policy "Names are public" on profiles for select using (true);

drop policy if exists "Readers rename themselves" on profiles;
create policy "Readers rename themselves" on profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

-- A reader may change their display name and nothing else. In
-- particular, nobody can make themselves an administrator from the
-- browser: that column can only be changed here in the SQL Editor.
revoke update on profiles from anon, authenticated;
grant update (display_name) on profiles to authenticated;

-- ---------- Likes and saved articles ----------
-- article_id is the article's file name (its slug), e.g.
-- "trump-says-god-has-spoken-to-him".
create table if not exists likes (
  user_id uuid not null references profiles (id) on delete cascade,
  article_id text not null check (char_length(article_id) between 1 and 200),
  created_at timestamptz not null default now(),
  primary key (user_id, article_id)
);

create table if not exists saves (
  user_id uuid not null references profiles (id) on delete cascade,
  article_id text not null check (char_length(article_id) between 1 and 200),
  created_at timestamptz not null default now(),
  primary key (user_id, article_id)
);

alter table likes enable row level security;
alter table saves enable row level security;

drop policy if exists "Readers see their own likes" on likes;
create policy "Readers see their own likes" on likes for select using (auth.uid() = user_id);
drop policy if exists "Readers add their own likes" on likes;
create policy "Readers add their own likes" on likes for insert with check (auth.uid() = user_id);
drop policy if exists "Readers remove their own likes" on likes;
create policy "Readers remove their own likes" on likes for delete using (auth.uid() = user_id);

drop policy if exists "Readers see their own saves" on saves;
create policy "Readers see their own saves" on saves for select using (auth.uid() = user_id);
drop policy if exists "Readers add their own saves" on saves;
create policy "Readers add their own saves" on saves for insert with check (auth.uid() = user_id);
drop policy if exists "Readers remove their own saves" on saves;
create policy "Readers remove their own saves" on saves for delete using (auth.uid() = user_id);

-- ---------- Letters to the Editor (comments) ----------
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  article_id text not null check (char_length(article_id) between 1 and 200),
  user_id uuid not null references profiles (id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  -- An administrator can hide a letter without deleting it.
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists comments_by_article on comments (article_id, created_at);

alter table comments enable row level security;

-- Anyone may read letters that are not hidden. The writer still sees
-- their own hidden letter; an administrator sees everything.
drop policy if exists "Letters are public unless hidden" on comments;
create policy "Letters are public unless hidden" on comments for select
  using (not hidden or auth.uid() = user_id or is_admin());

drop policy if exists "Signed-in readers post letters" on comments;
create policy "Signed-in readers post letters" on comments for insert
  with check (auth.uid() = user_id and not hidden);

drop policy if exists "Writers and administrators remove letters" on comments;
create policy "Writers and administrators remove letters" on comments for delete
  using (auth.uid() = user_id or is_admin());

drop policy if exists "Administrators hide letters" on comments;
create policy "Administrators hide letters" on comments for update
  using (is_admin()) with check (is_admin());

-- Only the `hidden` column may be changed after posting: a letter
-- cannot be edited, by its writer or by anyone else.
revoke update on comments from anon, authenticated;
grant update (hidden) on comments to authenticated;

-- A brake on floods: no more than three letters a minute from one reader.
create or replace function limit_comment_rate() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from comments
      where user_id = new.user_id and created_at > now() - interval '1 minute') >= 3 then
    raise exception 'Too many letters at once. The desk asks for a minute.';
  end if;
  return new;
end;
$$;

drop trigger if exists comments_rate_limit on comments;
create trigger comments_rate_limit
  before insert on comments
  for each row execute function limit_comment_rate();
