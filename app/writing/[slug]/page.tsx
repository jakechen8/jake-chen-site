import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, getPost } from '@/lib/posts'
import { MDXRemote } from 'next-mdx-remote/rsc'
import ReadingProgress from '@/components/ReadingProgress'
import TableOfContents from '@/components/TableOfContents'
import CopyLinkButton from '@/components/CopyLinkButton'
import RepoDecoder from '@/components/RepoDecoder'
import ScenarioChoice from '@/components/ScenarioChoice'
import AnimatedStat from '@/components/AnimatedStat'
import TrustMatrix from '@/components/TrustMatrix'
import DemoToRetention from '@/components/DemoToRetention'
import StrategyVsOps from '@/components/StrategyVsOps'
import AutonomySpectrum from '@/components/AutonomySpectrum'
import VibeCodingScorecard from '@/components/VibeCodingScorecard'
import SecondOrderChain from '@/components/SecondOrderChain'
import BottleneckShift from '@/components/BottleneckShift'
import ValueMigration from '@/components/ValueMigration'
import StrategyBifurcation from '@/components/StrategyBifurcation'

interface Props {
  params: { slug: string }
}

const mdxComponents = {
  RepoDecoder,
  ScenarioChoice,
  AnimatedStat,
  TrustMatrix,
  DemoToRetention,
  StrategyVsOps,
  AutonomySpectrum,
  VibeCodingScorecard,
  SecondOrderChain,
  BottleneckShift,
  ValueMigration,
  StrategyBifurcation,
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost(params.slug)
  if (!post) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jake-chen.com'

  const tagsParam = post.tags?.length
    ? `&tags=${encodeURIComponent(post.tags.join(','))}`
    : ''
  const ogUrl = `/api/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.excerpt || '')}${tagsParam}`

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${siteUrl}/writing/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['Jake Chen'],
      tags: post.tags || [],
      url: `${siteUrl}/writing/${post.slug}`,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@mitjake',
      title: post.title,
      description: post.excerpt,
      images: [ogUrl],
    },
  }
}

export default function PostPage({ params }: Props) {
  const post = getPost(params.slug)
  if (!post) notFound()

  const publishDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jake-chen.com'

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: 'Jake Chen',
      url: siteUrl,
    },
    datePublished: post.date,
    dateModified: post.date,
    publisher: {
      '@type': 'Person',
      name: 'Jake Chen',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/writing/${post.slug}`,
    },
    image: `${siteUrl}/api/og?title=${encodeURIComponent(post.title)}`,
    keywords: post.tags?.join(', '),
  }

  // Extract FAQ-style Q&A from H2 headings that are phrased as questions or statements
  const faqItems: { question: string; answer: string }[] = []
  const sections = post.content.split(/^## /m).slice(1) // split on H2 headings
  for (const section of sections) {
    const lines = section.trim().split('\n')
    const heading = lines[0]?.trim()
    if (!heading) continue
    // Grab the first non-empty paragraph as the answer
    const paragraphs = lines
      .slice(1)
      .join('\n')
      .split('\n\n')
      .map((p) => p.replace(/[#*_`<>[\]()]/g, '').trim())
      .filter((p) => p.length > 30 && !p.startsWith('<'))
    if (paragraphs.length > 0) {
      faqItems.push({
        question: heading.replace(/[#*_`]/g, '').trim(),
        answer: paragraphs[0].slice(0, 300) + (paragraphs[0].length > 300 ? '...' : ''),
      })
    }
  }

  const faqSchema =
    faqItems.length >= 2
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.slice(0, 5).map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Writing',
        item: `${siteUrl}/writing`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${siteUrl}/writing/${post.slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <ReadingProgress />
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="py-12 sm:py-16">
          {/* Back */}
          <Link
            href="/writing"
            className="mb-10 inline-flex items-center gap-1.5 text-sm transition-colors hover:text-[color:var(--accent)]"
            style={{ color: 'var(--fg-muted)' }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="7" x2="2" y2="7" />
              <polyline points="6 3 2 7 6 11" />
            </svg>
            All writing
          </Link>

          {/* Article header */}
          <header className="mb-10 max-w-2xl">
            {post.tags && post.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1
              className="font-display text-4xl font-normal leading-tight tracking-tight sm:text-5xl"
              style={{ color: 'var(--fg)' }}
            >
              {post.title}
            </h1>

            {post.excerpt && (
              <p
                className="mt-4 text-lg leading-relaxed"
                style={{ color: 'var(--fg-muted)' }}
              >
                {post.excerpt}
              </p>
            )}

            <div
              className="mt-6 border-b pb-6"
              style={{ borderColor: 'var(--border)' }}
            >
              <div
                className="flex flex-wrap items-center gap-3 text-sm"
                style={{ color: 'var(--fg-subtle)' }}
              >
                <span>Jake Chen</span>
                <span>&middot;</span>
                <time dateTime={post.date}>{publishDate}</time>
                {post.readingTime && (
                  <>
                    <span>&middot;</span>
                    <span>{post.readingTime}</span>
                  </>
                )}
              </div>
              <p className="mt-2 text-[11px] italic" style={{ color: 'var(--fg-subtle)', opacity: 0.7 }}>
                Personal perspectives only — does not represent the views of my employer.
              </p>
            </div>
          </header>

          {/* Content with sidebar TOC */}
          <div className="relative lg:flex lg:gap-12">
            <article className="prose prose-neutral min-w-0 max-w-2xl flex-1">
              <MDXRemote source={post.content} components={mdxComponents} />
            </article>
            <aside className="hidden w-48 shrink-0 lg:block">
              <TableOfContents />
            </aside>
          </div>

          {/* Related posts */}
          {(() => {
            const allPosts = getAllPosts()
            const related = allPosts
              .filter((p) => p.slug !== post.slug)
              .map((p) => ({
                ...p,
                overlap: (p.tags || []).filter((t) => (post.tags || []).includes(t)).length,
              }))
              .filter((p) => p.overlap > 0)
              .sort((a, b) => b.overlap - a.overlap)
              .slice(0, 2)

            if (related.length === 0) return null

            return (
              <div
                className="mt-16 border-t pt-10"
                style={{ borderColor: 'var(--border)' }}
              >
                <h3
                  className="mb-5 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: 'var(--fg-subtle)' }}
                >
                  You might also like
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/writing/${r.slug}`}
                      className="group rounded-lg border p-4 transition-all hover:border-[color:var(--accent)]"
                      style={{ borderColor: 'var(--border-strong)' }}
                    >
                      <p className="mb-1 text-sm font-semibold group-hover:text-[color:var(--accent)]" style={{ color: 'var(--fg)' }}>
                        {r.title}
                      </p>
                      {r.excerpt && (
                        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--fg-muted)' }}>
                          {r.excerpt}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Footer nav */}
          <div
            className="mt-16 flex items-center justify-between border-t pt-8"
            style={{ borderColor: 'var(--border)' }}
          >
            <Link
              href="/writing"
              className="flex items-center gap-1.5 text-sm transition-colors hover:text-[color:var(--accent)]"
              style={{ color: 'var(--fg-muted)' }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="7" x2="2" y2="7" />
                <polyline points="6 3 2 7 6 11" />
              </svg>
              All essays
            </Link>
            <div className="flex items-center gap-4">
              <CopyLinkButton />
              <a
                href="/feed.xml"
                className="flex items-center gap-1.5 text-sm transition-colors hover:text-[color:var(--accent)]"
                style={{ color: 'var(--fg-muted)' }}
              >
                RSS
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <rect x="1" y="9" width="3" height="3" rx="0.5" />
                  <path d="M1 5.5a7 7 0 0 1 7 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M1 1.5a10.5 10.5 0 0 1 10.5 10.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
