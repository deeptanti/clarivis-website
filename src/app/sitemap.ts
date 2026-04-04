import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://clarivis-website.vercel.app', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://clarivis-website.vercel.app/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://clarivis-website.vercel.app/services', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://clarivis-website.vercel.app/services/real-estate', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://clarivis-website.vercel.app/services/healthcare', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://clarivis-website.vercel.app/products', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://clarivis-website.vercel.app/assessment', lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: 'https://clarivis-website.vercel.app/book', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://clarivis-website.vercel.app/audit', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://clarivis-website.vercel.app/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://clarivis-website.vercel.app/privacy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://clarivis-website.vercel.app/terms', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
}
