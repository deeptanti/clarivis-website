import { getSupabase } from '@/lib/supabase'
import type { Vertical, AudiencePage, SolutionPage } from '@/types/vertical'

const VALID_VERTICALS = ['real-estate', 'healthcare', 'agribusiness'] as const
export type ValidVertical = typeof VALID_VERTICALS[number]

export function isValidVertical(slug: string): slug is ValidVertical {
  return VALID_VERTICALS.includes(slug as ValidVertical)
}

export async function getVertical(slug: string): Promise<Vertical | null> {
  const { data } = await getSupabase()
    .from('verticals')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

export async function getAllVerticals(): Promise<Vertical[]> {
  const { data } = await getSupabase()
    .from('verticals')
    .select('*')
    .order('name')
  return data ?? []
}

export async function getAudienceBySlug(
  vertical: string,
  slug: string
): Promise<AudiencePage | null> {
  const { data } = await getSupabase()
    .from('audiences')
    .select('*')
    .eq('vertical', vertical)
    .eq('slug', slug)
    .eq('published', true)
    .single()
  return data
}

export async function getAudiencesByVertical(
  vertical: string
): Promise<AudiencePage[]> {
  const { data } = await getSupabase()
    .from('audiences')
    .select('*')
    .eq('vertical', vertical)
    .eq('published', true)
    .order('name')
  return data ?? []
}

export async function getSolutionBySlug(
  vertical: string,
  slug: string
): Promise<SolutionPage | null> {
  const { data } = await getSupabase()
    .from('solutions')
    .select('*')
    .eq('vertical', vertical)
    .eq('slug', slug)
    .eq('published', true)
    .single()
  return data
}

export async function getSolutionsByVertical(
  vertical: string
): Promise<SolutionPage[]> {
  const { data } = await getSupabase()
    .from('solutions')
    .select('*')
    .eq('vertical', vertical)
    .eq('published', true)
    .order('name')
  return data ?? []
}

export async function getAllPublishedAudiences(): Promise<Pick<AudiencePage, 'slug' | 'vertical'>[]> {
  const { data } = await getSupabase()
    .from('audiences')
    .select('slug, vertical')
    .eq('published', true)
  return data ?? []
}

export async function getAllPublishedSolutions(): Promise<Pick<SolutionPage, 'slug' | 'vertical'>[]> {
  const { data } = await getSupabase()
    .from('solutions')
    .select('slug, vertical')
    .eq('published', true)
  return data ?? []
}
