import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import ScrollToTop from '@/components/ScrollToTop'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jake-chen.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Jake Chen',
    template: '%s | Jake Chen',
  },
  description:
    'Strategy lead at Waymo. Writing about how AI reshapes decisions, organizations, and the systems that run them.',
  keywords: ['Jake Chen', 'AI strategy', 'autonomous systems', 'Waymo', 'AI impact', 'autonomy', 'second-order effects', 'AI infrastructure', 'AI coordination', 'agent protocols'],
  authors: [{ name: 'Jake Chen', url: siteUrl }],
  creator: 'Jake Chen',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Jake Chen',
    description:
      'Strategy lead at Waymo. Writing about how AI reshapes decisions, organizations, and the systems that run them.',
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
    creator: '@mitjake',
    site: '@mitjake',
    title: 'Jake Chen',
    description: 'Strategy lead at Waymo. Writing about how AI reshapes decisions, organizations, and the systems that run them.',
    images: ['/api/og'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
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
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          as="style"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
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
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
