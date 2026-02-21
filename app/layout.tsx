import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jake-chen.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Jake Chen',
    template: '%s | Jake Chen',
  },
  description:
    'Building autonomous systems at Waymo. Writing about how intelligent machines earn trust in the real world.',
  keywords: ['Jake Chen', 'Waymo', 'autonomous systems', 'AI', 'trust', 'autonomy', 'self-driving'],
  authors: [{ name: 'Jake Chen', url: siteUrl }],
  creator: 'Jake Chen',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Jake Chen',
    description:
      'Building autonomous systems at Waymo. Writing about trust, autonomy, and AI.',
    siteName: 'Jake Chen',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Jake Chen',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jake Chen',
    description: 'Building autonomous systems at Waymo. Writing about trust, autonomy, and AI.',
    images: ['/api/og'],
  },
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={``}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap"
          rel="stylesheet"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Jake Chen"
          href="/feed.xml"
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <JsonLd />
          <div className="flex min-h-screen flex-col">
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
