import type {Metadata} from "next";
import '@/assets/css/style.css'

import Providers from "@/redux/Providers";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: {
    default: "Scraplan - Smart Waste Management & Scrap Collection Platform",
    template: "%s | Scraplan"
  },
  description: "Maximize your scrap profits with Scraplan - the leading waste management platform. Get the best market rates, connect with reliable drivers, and streamline your scrap collection business with our smart technology.",
  keywords: [
    "scrap collection",
    "waste management", 
    "recycling platform",
    "scrap rates",
    "waste disposal",
    "environmental sustainability",
    "scrap business",
    "waste collection drivers",
    "recycling rates",
    "eco-friendly waste management"
  ],
  authors: [{ name: "Scraplan Team" }],
  creator: "Scraplan",
  publisher: "Scraplan",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/logo.png',
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://scraplan.com',
    siteName: 'Scraplan',
    title: "Scraplan - Smart Waste Management & Scrap Collection Platform",
    description: "Maximize your scrap profits with smart waste management. Get best rates, reliable drivers, and seamless scrap collection services.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Scraplan - Smart Waste Management Platform',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Scraplan - Smart Waste Management Platform",
    description: "Maximize your scrap profits with smart waste management technology",
    images: ['/twitter-image.png'],
    creator: '@scraplan',
  },
  alternates: {
    canonical: 'https://scraplan.com',
  },
  category: 'Business',
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#f9762a" />
                <link rel="canonical" href="https://scraplan.com" />
                <link rel="icon" href="/logo.png" type="image/png" />
                <link rel="apple-touch-icon" href="/logo.png" />
                
                {/* Structured Data */}
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "Organization",
                      "name": "Scraplan",
                      "description": "Smart waste management and scrap collection platform",
                      "url": "https://scraplan.com",
                      "logo": "https://scraplan.com/logo.png",
                      "contactPoint": {
                        "@type": "ContactPoint",
                        "contactType": "customer service",
                        "availableLanguage": ["English", "Vietnamese"]
                      },
                      "sameAs": [
                        "https://facebook.com/scraplan",
                        "https://linkedin.com/company/scraplan"
                      ],
                      "serviceArea": {
                        "@type": "Country",
                        "name": "India"
                      },
                      "services": [
                        {
                          "@type": "Service",
                          "name": "Scrap Collection",
                          "description": "Professional scrap collection services"
                        },
                        {
                          "@type": "Service", 
                          "name": "Waste Management",
                          "description": "Comprehensive waste management solutions"
                        }
                      ]
                    })
                  }}
                />
            </head>
            <body>
                <Providers>
                    <ToastContainer autoClose={3000}/>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
