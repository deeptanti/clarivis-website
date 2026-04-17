export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/portal', '/api/', '/api/test-pdf-email'],
      },
    ],
    sitemap: 'https://clarivisintelligence.com/sitemap.xml',
  }
}
