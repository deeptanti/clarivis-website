import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.clarivisintelligence.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://www.clarivisintelligence.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.clarivisintelligence.com/services', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://www.clarivisintelligence.com/services/real-estate', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.clarivisintelligence.com/services/healthcare', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.clarivisintelligence.com/products', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.clarivisintelligence.com/assessment', lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: 'https://www.clarivisintelligence.com/book', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://www.clarivisintelligence.com/audit', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://www.clarivisintelligence.com/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://www.clarivisintelligence.com/privacy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://www.clarivisintelligence.com/terms', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
}