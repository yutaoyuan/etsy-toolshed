-- EtsyToolshed Supabase schema (P3)
-- 在 Supabase Dashboard → SQL Editor 中执行
-- 依赖：Supabase Auth（auth.users 表由 Supabase 自动创建）

-- ============================================================
-- 1. users：业务用户表，镜像 auth.users，存订阅 plan
-- ============================================================
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  plan text not null default 'free' check (plan in ('free', 'starter', 'pro')),
  created_at timestamptz not null default now()
);

-- 新用户注册时自动在 public.users 建一行（plan = free）
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, plan)
  values (new.id, new.email, 'free')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. usage_logs：API 调用日志，用于限次
-- ============================================================
create table if not exists public.usage_logs (
  id bigint generated always as identity primary key,
  user_id uuid references public.users(id) on delete set null,
  ip text not null,
  endpoint text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_usage_logs_user_day
  on public.usage_logs (user_id, endpoint, created_at desc);
create index if not exists idx_usage_logs_ip_day
  on public.usage_logs (ip, endpoint, created_at desc);

-- ============================================================
-- 3. subscriptions：Lemon Squeezy 订阅（P4 接入）
-- ============================================================
create table if not exists public.subscriptions (
  id text primary key, -- Lemon Squeezy subscription id
  user_id uuid not null references public.users(id) on delete cascade,
  status text not null, -- active / cancelled / expired / past_due
  plan text not null check (plan in ('starter', 'pro')),
  renews_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_subscriptions_user on public.subscriptions (user_id);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.users enable row level security;
alter table public.usage_logs enable row level security;
alter table public.subscriptions enable row level security;

-- users：用户只能读自己
drop policy if exists "users read own" on public.users;
create policy "users read own"
  on public.users for select
  using (auth.uid() = id);

-- usage_logs：用户只能读自己的调用记录
drop policy if exists "usage_logs read own" on public.usage_logs;
create policy "usage_logs read own"
  on public.usage_logs for select
  using (auth.uid() = user_id);

-- subscriptions：用户只能读自己的订阅
drop policy if exists "subscriptions read own" on public.subscriptions;
create policy "subscriptions read own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- 写入全部由 service role（后端）完成，RLS 默认拒绝非 service role 的写操作

-- ============================================================
-- 4. fee_rates：Etsy 费率（由 Vercel Cron 半自动同步，人工审核后生效）
-- ============================================================
create table if not exists public.fee_rates (
  id bigint generated always as identity primary key,
  country text not null, -- US / UK / CA / EU / AU
  transaction_rate numeric(6,4) not null,       -- 6.5% -> 0.065
  listing_fee numeric(8,4) not null,            -- 0.20
  payment_processing_rate numeric(6,4) not null,
  payment_processing_fixed numeric(8,4) not null,
  offsite_ads_low numeric(6,4) not null,        -- < $10k 年销售额
  offsite_ads_high numeric(6,4) not null,       -- >= $10k
  effective_date date,
  status text not null default 'draft' check (status in ('draft', 'active')),
  created_at timestamptz not null default now()
);

create index if not exists idx_fee_rates_country_status
  on public.fee_rates (country, status);

-- 每个国家同时只能有一条 active 记录
create unique index if not exists uniq_fee_rates_active_country
  on public.fee_rates (country)
  where status = 'active';

-- 5. fee_sync_log：费率同步日志（记录页面 hash 与解析结果）
create table if not exists public.fee_sync_log (
  id bigint generated always as identity primary key,
  page_hash text not null,
  status text not null check (status in ('unchanged', 'parsed', 'parse_failed', 'alerted')),
  message text,
  created_at timestamptz not null default now()
);

alter table public.fee_rates enable row level security;
alter table public.fee_sync_log enable row level security;
-- 费率与同步日志由 service role 读写；RLS 默认拒绝匿名/普通用户访问

-- ============================================================
-- 6. compliance_rules：合规检查器的可调规则（品牌词/关键词/阈值）
--    代码里的判定逻辑不变，数据从这里读，改规则不用重新部署
-- ============================================================
create table if not exists public.compliance_rules (
  id bigint generated always as identity primary key,
  category text not null check (category in ('brand_words', 'ai_disclosure_keywords', 'thresholds')),
  key text not null,           -- 品牌词 / 关键词 / 阈值名（如 title_max_chars）
  value text not null,         -- 阈值数值（字符串存，代码里 Number()）
  severity text check (severity in ('high', 'medium', 'low')),
  source_url text,             -- 规则来源（Etsy 官方页）
  last_verified_at date,       -- 最后一次人工核对日期
  status text not null default 'active' check (status in ('active', 'draft')),
  created_at timestamptz not null default now()
);

create index if not exists idx_compliance_rules_category_status
  on public.compliance_rules (category, status);

-- 初始数据：品牌词黑名单（来源：https://www.etsy.com/legal/prohibited/）
insert into public.compliance_rules (category, key, value, severity, source_url, last_verified_at) values
  ('brand_words', 'disney', 'trademark', 'high', 'https://www.etsy.com/legal/prohibited/', '2026-10-09'),
  ('brand_words', 'star wars', 'trademark', 'high', 'https://www.etsy.com/legal/prohibited/', '2026-10-09'),
  ('brand_words', 'mickey', 'trademark', 'high', 'https://www.etsy.com/legal/prohibited/', '2026-10-09'),
  ('brand_words', 'marvel', 'trademark', 'high', 'https://www.etsy.com/legal/prohibited/', '2026-10-09'),
  ('brand_words', 'nike', 'trademark', 'high', 'https://www.etsy.com/legal/prohibited/', '2026-10-09'),
  ('brand_words', 'adidas', 'trademark', 'high', 'https://www.etsy.com/legal/prohibited/', '2026-10-09'),
  ('brand_words', 'lego', 'trademark', 'high', 'https://www.etsy.com/legal/prohibited/', '2026-10-09'),
  ('brand_words', 'barbie', 'trademark', 'high', 'https://www.etsy.com/legal/prohibited/', '2026-10-09'),
  ('brand_words', 'harry potter', 'trademark', 'high', 'https://www.etsy.com/legal/prohibited/', '2026-10-09'),
  ('brand_words', 'pokemon', 'trademark', 'high', 'https://www.etsy.com/legal/prohibited/', '2026-10-09'),
  ('brand_words', 'nintendo', 'trademark', 'high', 'https://www.etsy.com/legal/prohibited/', '2026-10-09'),
  ('brand_words', 'mario', 'trademark', 'high', 'https://www.etsy.com/legal/prohibited/', '2026-10-09'),
  ('brand_words', 'coca cola', 'trademark', 'high', 'https://www.etsy.com/legal/prohibited/', '2026-10-09'),
  ('brand_words', 'coca-cola', 'trademark', 'high', 'https://www.etsy.com/legal/prohibited/', '2026-10-09'),
  ('brand_words', 'gucci', 'trademark', 'high', 'https://www.etsy.com/legal/prohibited/', '2026-10-09'),
  ('brand_words', 'louis vuitton', 'trademark', 'high', 'https://www.etsy.com/legal/prohibited/', '2026-10-09')
on conflict do nothing;

-- 初始数据：AI 披露关键词（来源：https://www.etsy.com/legal/creativity/）
insert into public.compliance_rules (category, key, value, source_url, last_verified_at) values
  ('ai_disclosure_keywords', 'ai-generated', 'keyword', 'https://www.etsy.com/legal/creativity/', '2026-10-09'),
  ('ai_disclosure_keywords', 'ai generated', 'keyword', 'https://www.etsy.com/legal/creativity/', '2026-10-09'),
  ('ai_disclosure_keywords', 'ai-assisted', 'keyword', 'https://www.etsy.com/legal/creativity/', '2026-10-09'),
  ('ai_disclosure_keywords', 'ai assisted', 'keyword', 'https://www.etsy.com/legal/creativity/', '2026-10-09'),
  ('ai_disclosure_keywords', 'artificial intelligence', 'keyword', 'https://www.etsy.com/legal/creativity/', '2026-10-09'),
  ('ai_disclosure_keywords', 'created with ai', 'keyword', 'https://www.etsy.com/legal/creativity/', '2026-10-09'),
  ('ai_disclosure_keywords', 'made with ai', 'keyword', 'https://www.etsy.com/legal/creativity/', '2026-10-09'),
  ('ai_disclosure_keywords', 'ai image', 'keyword', 'https://www.etsy.com/legal/creativity/', '2026-10-09'),
  ('ai_disclosure_keywords', 'ai art', 'keyword', 'https://www.etsy.com/legal/creativity/', '2026-10-09'),
  ('ai_disclosure_keywords', 'ai design', 'keyword', 'https://www.etsy.com/legal/creativity/', '2026-10-09')
on conflict do nothing;

-- 初始数据：阈值（来源：Etsy Seller Handbook 社区共识）
insert into public.compliance_rules (category, key, value, source_url, last_verified_at) values
  ('thresholds', 'title_max_chars', '140', 'https://help.etsy.com/hc/en-us/articles/360024112614', '2026-10-09'),
  ('thresholds', 'title_min_chars', '20', 'https://help.etsy.com/hc/en-us/articles/360024112614', '2026-10-09'),
  ('thresholds', 'description_min_chars', '50', 'https://help.etsy.com/hc/en-us/articles/360024112614', '2026-10-09')
on conflict do nothing;

-- 7. policy_sync_log：政策页变更检测日志
create table if not exists public.policy_sync_log (
  id bigint generated always as identity primary key,
  page_url text not null,
  page_hash text not null,
  status text not null check (status in ('unchanged', 'changed', 'fetch_failed')),
  message text,
  created_at timestamptz not null default now()
);

create index if not exists idx_policy_sync_log_page
  on public.policy_sync_log (page_url, created_at desc);

alter table public.compliance_rules enable row level security;
alter table public.policy_sync_log enable row level security;
-- 合规规则与同步日志由 service role 读写；RLS 默认拒绝匿名/普通用户访问
