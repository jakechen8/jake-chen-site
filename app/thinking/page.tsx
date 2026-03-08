import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, getPost } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Thinking',
  description:
    'A map of the ideas I keep returning to: AI strategy, trust at scale, coordination costs, protocol design, and the invisible infrastructure beneath autonomous systems.',
}

const themes = [
  {
    title: 'AI Strategy & Coordination',
    description:
      'What changes inside organizations when intelligence becomes cheap? How decision rights, escalation paths, and workflows need to be redesigned.',
    tags: ['AI Strategy', 'Leadership', 'Organizations'],
  },
  {
    title: 'Platforms & Protocols',
    description:
      'The next platform war won\'t be fought in models — it\'ll be fought in protocols. How interoperability becomes distribution in the agent era.',
    tags: ['Platforms', 'Infrastructure', 'AI Strategy'],
  },
  {
    title: 'Trust & Governance',
    description:
      'Trust is not the brake. It\'s the accelerator. How governance, verification, and safety cases become growth functions rather than compliance overhead.',
    tags: ['Trust', 'Governance', 'AI Systems'],
  },
  {
    title: 'Distribution & Discovery',
    description:
      'The most important reader of your website may soon be a machine. How discoverability is becoming evidence architecture.',
    tags: ['SEO', 'Distribution', 'AI Strategy'],
  },
  {
    title: 'Developer Experience & Vibe Coding',
    description:
      'Execution got cheaper faster than literacy. How to close the gap between shipping changes and understanding the codebase.',
    tags: ['Software', 'Vibe Coding', 'Developer Experience'],
  },
]

export default function ThinkingPage() {
  const allPosts = getAllPosts()

  // Get series
  const seriesMap = new Map<string, { posts: typeof allPosts; order: number }>()
  allPosts.forEach((p) => {
    const full = getPost(p.slug)
    if (full?.series) {
      if (!seriesMap.has(full.series)) {
        seriesMap.set(full.series, { posts: [], order: 0 })
      }
      seriesMap.get(full.series)!.posts.push(p)
    }
  })

  const series = Array.from(seriesMap.entries()).map(([name, data]) => ({
    name,
    posts: data.posts.sort((a, b) => {
      const aFull = getPost(a.slug)
      const bFull = getPost(b.slug)
      return (aFull?.seriesOrder || 0) - (bFull?.seriesOrder || 0)
    }),
  }))

  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8">
      <div className="py-16 sm:py-24">
        {/* Header */}
        <div className="mb-16 max-w-xl">
          <p
            className="mb-3 text-xs font-medium uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}
          >
            Thinking
          </p>
          <h1
            className="mb-4 font-display text-4xl font-normal tracking-tight sm:text-5xl"
            style={{ color: 'var(--fg)' }}
          >
            The Map
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            I keep returning to a small set of questions. This page is a map of the
            ideas and how they connect. Think of it as the table of contents for
            everything I write about.
          </p>
        </div>

        {/* Themes */}
        <section className="mb-16">
          <h2
            className="mb-8 font-display text-2xl font-normal tracking-tight"
            style={{ color: 'var(--fg)' }}
          >
            Themes
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {themes.map((theme) => {
              const relatedPosts = allPosts.filter(
                (p) => p.tags?.some((t) => theme.tags.includes(t))
              )
              return (
                <div
                  key={theme.title}
                  className="rounded-lg border p-6"
                  style={{ borderColor: 'var(--border-strong)' }}
                >
                  <h3
                    className="mb-2 font-display text-lg font-normal"
                    style={{ color: 'var(--fg)' }}
                  >
                    {theme.title}
                  </h3>
                  <p
                    className="mb-4 text-sm leading-relaxed"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    {theme.description}
                  </p>
                  {relatedPosts.length > 0 && (
                    <div className="space-y-1.5">
                      {relatedPosts.slice(0, 3).map((post) => (
                        <Link
                          key={post.slug}
                          href={`/writing/${post.slug}`}
                          className="block text-sm transition-colors hover:text-[color:var(--accent)]"
                          style={{ color: 'var(--fg-subtle)' }}
                        >
                          &rarr; {post.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Series */}
        {series.length > 0 && (
          <section className="mb-16">
            <h2
              className="mb-8 font-display text-2xl font-normal tracking-tight"
              style={{ color: 'var(--fg)' }}
            >
              Series
            </h2>
            {series.map((s) => (
              <div
                key={s.name}
                className="mb-8 rounded-lg border p-6"
                style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-warm)' }}
              >
                <p
                  className="mb-1 font-mono text-xs font-medium uppercase tracking-widest"
                  style={{ color: 'var(--accent)' }}
                >
                  {s.posts.length}-part series
                </p>
                <h3
                  className="mb-4 font-display text-xl font-normal"
                  style={{ color: 'var(--fg)' }}
                >
                  {s.name}
                </h3>
                <div className="space-y-2">
                  {s.posts.map((post, i) => (
                    <Link
                      key={post.slug}
                      href={`/writing/${post.slug}`}
                      className="flex items-start gap-3 text-sm transition-colors hover:text-[color:var(--accent)]"
                      style={{ color: 'var(--fg-muted)' }}
                    >
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
                        style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                      >
                        {i + 1}
                      </span>
                      {post.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* CTA */}
        <div className="text-center">
          <p className="mb-4 text-sm" style={{ color: 'var(--fg-subtle)' }}>
            Want to go deeper?
          </p>
          <Link href="/writing" className="btn-primary">
            All essays
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="2" y1="7" x2="12" y2="7" />
              <polyline points="8 3 12 7 8 11" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
