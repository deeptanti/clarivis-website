export default function sitemap() {
  return [
    { url: 'https://clarivisintelligence.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://clarivisintelligence.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://clarivisintelligence.com/services', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://clarivisintelligence.com/services/real-estate', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://clarivisintelligence.com/services/healthcare', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://clarivisintelligence.com/products', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://clarivisintelligence.com/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://clarivisintelligence.com/assessment', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 }
  ]
}
