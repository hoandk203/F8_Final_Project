import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/private/',
        '/_next/',
        '/dashboard/driver/*',
        '/dashboard/vendor/*',
        '/dashboard/admin/*'
      ],
    },
    sitemap: 'https://scraplan.com/sitemap.xml',
  }
} 