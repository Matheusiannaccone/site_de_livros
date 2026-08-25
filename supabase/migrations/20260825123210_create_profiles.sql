create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  username text not null unique
    check (
      username = lower(username)
      and username = btrim(username)
      and username <> ''
    ),

  display_name text not null
    check (
      display_name = btrim(display_name)
      and display_name <> ''
    ),

  bio text,

  avatar_path text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_username text;
  v_display_name text;
begin
  v_username := new.raw_user_meta_data ->> 'username';
  v_display_name := new.raw_user_meta_data ->> 'display_name';

  if v_username is null or btrim(v_username) = '' then
    raise exception 'username is required';
  end if;

  if v_username <> btrim(v_username) then
    raise exception 'username cannot contain leading or trailing spaces';
  end if;

  if v_username <> lower(v_username) then
    raise exception 'username must use lowercase characters';
  end if;

  if v_display_name is null or btrim(v_display_name) = '' then
    raise exception 'display_name is required';
  end if;

  if v_display_name <> btrim(v_display_name) then
    raise exception 'display_name cannot contain leading or trailing spaces';
  end if;

  insert into public.profiles (
    id,
    username,
    display_name
  )
  values (
    new.id,
    v_username,
    v_display_name
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function public.handle_updated_user_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger on_profiles_updated
before update on public.profiles
for each row
execute function public.handle_updated_user_at();