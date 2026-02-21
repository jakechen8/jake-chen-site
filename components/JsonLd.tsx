const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jake-chen.com'

export default function JsonLd() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jake Chen',
    url: siteUrl,
    description: 'Building autonomous systems at Waymo. Writing about trust, autonomy, and AI.',
    jobTitle: 'Autonomous Systems',
    worksFor: {
      '@type': 'Organization',
      name: 'Waymo',
    },
    sameAs: [
      'https://linkedin.com/in/jiakechen',
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Jake Chen',
    url: siteUrl,
    description:
      'Writing about trust, autonomy, and how intelligent systems interact with the real world.',
    author: {
      '@type': 'Person',
      name: 'Jake Chen',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  )
}
