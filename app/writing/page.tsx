import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, getAllTags, getTotalWordCount } from '@/lib/posts'
import TagFilter from '@/components/TagFilter'
import WritingStats from '@/components/WritingStats'
import EmailCapture from '@/components/EmailCapture'

export const metadata: Metadata = {
  title: 'Writing — Essays on AI Strategy, Trust & Second-Order Effects',
  description: 'Long-form essays by Jake Chen on AI strategy, second-order effects, autonomous systems, trust at scale, and the gap between what gets announced and what actually ships.',
  alternates: { canonical: 'https://jake-chen.com/writing' },
}

export default async function WritingPage() {
  const posts = await Promise.resolve(getAllPosts())
  const totalWords = getTotalWordCount()
  const totalTags = getAllTags().length

  // Pick a "start here" post — the most recent long-form piece
  const startHere = posts.find((p) => p.slug === 'second-order-effects') || posts[0]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jake-chen.com' },
      { '@type': 'ListItem', position: 2, name: 'Writing', item: 'https://jake-chen.com/writing' },
    ],
  }

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
    <div className="mx-auto max-w-4xl px-5 sm:px-8">
      <div className="py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12 max-w-xl">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}
          >
            Writing
          </p>
          <h1
            className="mb-4 font-display text-4xl font-normal tracking-tight sm:text-5xl"
            style={{ color: 'var(--fg)' }}
          >
            Essays &amp; Ideas
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            How AI is reshaping decisions, organizations, and the systems we rely on &mdash;
            the second-order effects nobody talks about. Published when&nbsp;ready.
          </p>
          <p className="mt-3 text-xs italic" style={{ color: 'var(--fg-subtle)' }}>
            These essays reflect my personal perspectives only and do not represent the views of my employer.
          </p>
        </div>

        {/* Stats */}
        <WritingStats totalPosts={posts.length} totalWords={totalWords} totalTags={totalTags} />

        {/* Start Here callout */}
        {startHere && (
          <Link
            href={`/writing/${startHere.slug}`}
            className="group mb-10 flex items-center gap-4 rounded-lg border p-4 transition-all hover:border-[color:var(--accent)] sm:p-5"
            style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-warm)' }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{ background: 'var(--accent-light)' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 13 8 5 13" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                Start here
              </p>
              <p className="truncate text-sm font-medium group-hover:text-[color:var(--accent)]" style={{ color: 'var(--fg)' }}>
                {startHere.title}
              </p>
              {startHere.excerpt && (
                <p className="mt-0.5 truncate text-xs" style={{ color: 'var(--fg-subtle)' }}>
                  {startHere.excerpt}
                </p>
              )}
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" style={{ color: 'var(--fg-muted)' }}>
              <line x1="2" y1="7" x2="12" y2="7" />
              <polyline points="8 3 12 7 8 11" />
            </svg>
          </Link>
        )}

        {/* Posts with tag filtering */}
        {posts.length > 0 ? (
          <TagFilter posts={posts} />
        ) : (
          <div
            className="rounded-lg border py-16 text-center"
            style={{ borderColor: 'var(--border)' }}
          >
            <p
              className="font-display text-2xl font-normal italic"
              style={{ color: 'var(--fg-muted)' }}
            >
              Essays incoming.
            </p>
          </div>
        )}

        {/* Subscribe */}
        <div
          className="mt-12 rounded-lg border p-6 sm:p-8"
          style={{ borderColor: 'var(--border)' }}
        >
          <h2
            className="mb-2 font-display text-xl font-normal tracking-tight"
            style={{ color: 'var(--fg)' }}
          >
            Get the essays
          </h2>
          <p className="mb-5 text-sm" style={{ color: 'var(--fg-subtle)' }}>
            No noise. Published when ready. Or grab the{' '}
            <a
              href="/feed.xml"
              className="underline underline-offset-2 transition-colors hover:text-[color:var(--accent)]"
              style={{ color: 'var(--fg-subtle)', textDecorationColor: 'var(--border)' }}
            >
              RSS feed
            </a>.
          </p>
          <div className="max-w-md">
            <EmailCapture compact />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
