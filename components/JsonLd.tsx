const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jake-chen.com'

export default function JsonLd() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jake Chen',
    url: siteUrl,
    description: 'Exploring how autonomous systems move from code into the physical world — and the trust infrastructure required to make them scale.',
    jobTitle: 'Strategy Lead',
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
      'Essays on autonomy, trust, and the systems beneath AI.',
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
