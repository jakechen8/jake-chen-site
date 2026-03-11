import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, getPost } from '@/lib/posts'
import { MDXRemote } from 'next-mdx-remote/rsc'
import ReadingProgress from '@/components/ReadingProgress'
import TableOfContents from '@/components/TableOfContents'
import RepoDecoder from '@/components/RepoDecoder'
import ScenarioChoice from '@/components/ScenarioChoice'
import MythReality from '@/components/MythReality'
import PulseCheck from '@/components/PulseCheck'
import AnimatedStat from '@/components/AnimatedStat'
import TrustMatrix from '@/components/TrustMatrix'
import IntegrationRace from '@/components/IntegrationRace'
import SeriesNav from '@/components/SeriesNav'

interface Props {
  params: { slug: string }
}

const mdxComponents = {
  RepoDecoder,
  ScenarioChoice,
  MythReality,
  PulseCheck,
  AnimatedStat,
  TrustMatrix,
  IntegrationRace,
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
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['Jake Chen'],
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
      title: post.title,
      description: post.excerpt,
      images: [ogUrl],
    },
  }
}

export default function PostPage({ params }: Props) {
  const post = getPost(params.slug)
  if (!post) notFound()

  const allPosts = getAllPosts()

  // Find series posts if this post has a series
  const seriesPosts = post.series
    ? allPosts
        .filter((p) => {
          const full = getPost(p.slug)
          return full?.series === post.series
        })
        .sort((a, b) => {
          const aPost = getPost(a.slug)
          const bPost = getPost(b.slug)
          return (aPost?.seriesOrder || 0) - (bPost?.seriesOrder || 0)
        })
    : []

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
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

          {/* Series badge */}
          {post.series && (
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <rect x="1" y="1" width="4" height="4" rx="0.5" opacity="0.5" />
                <rect x="7" y="1" width="4" height="4" rx="0.5" opacity="0.7" />
                <rect x="1" y="7" width="4" height="4" rx="0.5" opacity="0.7" />
                <rect x="7" y="7" width="4" height="4" rx="0.5" />
              </svg>
              {post.series} — Part {post.seriesOrder} of {seriesPosts.length}
            </div>
          )}

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
              className="mt-6 flex flex-wrap items-center gap-3 border-b pb-6 text-sm"
              style={{ borderColor: 'var(--border)', color: 'var(--fg-subtle)' }}
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
          </header>

          {/* Content with sidebar TOC */}
          <div className="relative flex gap-12">
            <article className="prose prose-neutral max-w-2xl flex-1">
              <MDXRemote source={post.content} components={mdxComponents} />
            </article>
            <aside className="w-48 shrink-0">
              <TableOfContents />
            </aside>
          </div>

          {/* Series navigation */}
          {seriesPosts.length > 1 && (
            <SeriesNav
              series={post.series!}
              currentSlug={post.slug}
              posts={seriesPosts}
            />
          )}

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
    </>
  )
}
