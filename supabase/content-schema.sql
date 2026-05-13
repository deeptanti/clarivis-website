-- Clarivis Intelligence — content table for /insights pages
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

create table if not exists content (
  id               uuid        primary key default gen_random_uuid(),
  slug             text        not null,
  content_type     text        not null,
  vertical         text,
  title            text        not null,
  description      text        not null,
  body             text        not null,
  seo_title        text,
  seo_description  text,
  published        boolean     not null default false,
  published_at     timestamptz,
  related_glossary_slug text,
  pillar_vertical  text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint content_type_check
    check (content_type in ('guide', 'article', 'glossary', 'faq')),
  constraint vertical_check
    check (vertical in ('real-estate', 'healthcare', 'agribusiness') or vertical is null),
  constraint pillar_vertical_check
    check (pillar_vertical in ('real-estate', 'healthcare', 'agribusiness') or pillar_vertical is null),
  constraint content_slug_unique unique (slug)
);

-- Row Level Security
alter table content enable row level security;

-- Public can read published content (required for ISR with anon key)
create policy "public_read_published" on content
  for select using (published = true);

-- Indexes
create index if not exists content_slug_idx          on content (slug);
create index if not exists content_type_vertical_idx  on content (content_type, vertical);
create index if not exists content_published_idx      on content (published, published_at desc);
