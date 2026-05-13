import { getSupabase } from '@/lib/supabase';
import type { ContentRow, ContentSummary, ContentType, Vertical } from '@/types/content';

export async function getContentBySlug(slug: string): Promise<ContentRow | null> {
  const { data } = await getSupabase()
    .from('content')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  return data ?? null;
}

export async function listContent(
  contentType: ContentType,
  vertical?: Vertical,
  limit = 20
): Promise<ContentSummary[]> {
  let query = getSupabase()
    .from('content')
    .select('id, slug, content_type, vertical, title, description, published_at')
    .eq('content_type', contentType)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (vertical) query = query.eq('vertical', vertical);

  const { data } = await query;
  return data ?? [];
}

export async function listRecentContent(limit = 12): Promise<ContentSummary[]> {
  const { data } = await getSupabase()
    .from('content')
    .select('id, slug, content_type, vertical, title, description, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getAllPublishedSlugs(): Promise<
  Pick<ContentRow, 'slug' | 'content_type' | 'vertical'>[]
> {
  const { data } = await getSupabase()
    .from('content')
    .select('slug, content_type, vertical')
    .eq('published', true);
  return data ?? [];
}

export async function getRelatedGlossaryTerm(slug: string): Promise<ContentSummary | null> {
  const { data } = await getSupabase()
    .from('content')
    .select('id, slug, content_type, vertical, title, description, published_at')
    .eq('slug', slug)
    .eq('content_type', 'glossary')
    .eq('published', true)
    .single();
  return data ?? null;
}
