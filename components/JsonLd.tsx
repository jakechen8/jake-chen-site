const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jake-chen.com'

export default function JsonLd() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jake Chen',
    url: siteUrl,
    description: 'Strategy leader exploring how AI reshapes coordination, trust, and the systems beneath autonomous systems. 15+ years across Waymo, McKinsey, HubSpot, and Microsoft.',
    jobTitle: 'Strategy Lead',
    worksFor: {
      '@type': 'Organization',
      name: 'Waymo',
      url: 'https://waymo.com',
    },
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'MIT Sloan School of Management',
      },
      {
        '@type': 'CollegeOrUniversity',
        name: 'University of Minnesota',
      },
    ],
    knowsAbout: [
      'Autonomous Systems',
      'AI Strategy',
      'Trust Infrastructure',
      'AI Impact',
      'Platform Strategy',
      'Organizational Design',
    ],
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
      'Essays and thinking on AI strategy, autonomous systems, trust infrastructure, and the coordination challenges of the AI era.',
    author: {
      '@type': 'Person',
      name: 'Jake Chen',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/writing?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Jake Chen — Writing',
    url: `${siteUrl}/writing`,
    description: 'Long-form essays on AI strategy, trust at scale, autonomous systems, and the invisible infrastructure that makes AI work in the real world.',
    author: {
      '@type': 'Person',
      name: 'Jake Chen',
    },
    inLanguage: 'en-US',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
    </>
  )
}
