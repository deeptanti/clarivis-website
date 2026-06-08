export type Vertical = {
  id: string
  slug: string
  name: string
  tagline: string | null
  description: string | null
  body: string | null
  accent_color: string | null
  seo_title: string | null
  seo_description: string | null
  created_at: string
  updated_at: string
}

export type AudiencePage = {
  id: string
  slug: string
  vertical: string
  name: string
  description: string | null
  body: string | null
  pain_points: string[]
  seo_title: string | null
  seo_description: string | null
  published: boolean
  noindex: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export type SolutionPage = {
  id: string
  slug: string
  vertical: string
  name: string
  tagline: string | null
  description: string | null
  body: string | null
  problem: string | null
  how_it_works: { step: string; description: string }[]
  outcomes: { title: string; description: string }[]
  roi_claim: string | null
  build_price_min: number | null
  build_price_max: number | null
  retainer_min: number | null
  retainer_max: number | null
  seo_title: string | null
  seo_description: string | null
  published: boolean
  noindex: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}
