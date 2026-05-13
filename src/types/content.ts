export type ContentType = 'guide' | 'article' | 'glossary' | 'faq';
export type Vertical = 'real-estate' | 'healthcare' | 'agribusiness';

export interface ContentRow {
  id: string;
  slug: string;
  content_type: ContentType;
  vertical: Vertical | null;
  title: string;
  description: string;
  body: string;
  seo_title: string | null;
  seo_description: string | null;
  published: boolean;
  published_at: string | null;
  related_glossary_slug: string | null;
  pillar_vertical: Vertical | null;
  created_at: string;
  updated_at: string;
}

export type ContentSummary = Pick<
  ContentRow,
  'id' | 'slug' | 'content_type' | 'vertical' | 'title' | 'description' | 'published_at'
>;
