-- 肘家班 · 访客统计 · Supabase 初始化脚本
-- 用法：Supabase 控制台 → SQL Editor → 新建查询 → 粘贴整段 → Run

create table if not exists public.visits (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  page        text,
  referrer    text,
  ua          text,
  lang        text,
  tz          text,
  screen      text,
  country     text,
  region      text,
  city        text,
  lat         double precision,
  lon         double precision,
  sid         text
);

create index if not exists visits_created_at_idx on public.visits (created_at desc);

-- 只有“写入”权限，任何拿到 anon key 的人都读不到明细
alter table public.visits enable row level security;

drop policy if exists visits_insert_anon on public.visits;
create policy visits_insert_anon on public.visits
  for insert to anon with check (true);

-- 站长口令（务必改成你自己的，不要用这个默认值）
create or replace function public.admin_visits(p_pass text)
returns setof public.visits
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_pass is null or p_pass <> '换成你自己的口令' then
    raise exception 'unauthorized' using errcode = '28000';
  end if;
  return query select * from public.visits order by created_at desc limit 5000;
end;
$$;

revoke all on function public.admin_visits(text) from public;
grant execute on function public.admin_visits(text) to anon;
