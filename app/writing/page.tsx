import type { Metadata } from 'next'
import { getAllPosts, getPost } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import EmailCapture from '@/components/EmailCapture'

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Essays on AI strategy, autonomous systems, trust infrastructure, and the coordination challenges of the AI era. By Jake Chen.',
}

export default async function WritingPage() {
  const posts = await Promise.resolve(getAllPosts())

  // Group series posts
  const seriesMap = new Map<string, typeof posts>()
  const standalonePosts: typeof posts = []

  posts.forEach((p) => {
    const full = getPost(p.slug)
    if (full?.series) {
      if (!seriesMap.has(full.series)) {
        seriesMap.set(full.series, [])
      }
      seriesMap.get(full.series)!.push(p)
    } else {
      standalonePosts.push(p)
    }
  })

  seriesMap.forEach((seriesPosts) => {
    seriesPosts.sort((a, b) => {
      const aFull = getPost(a.slug)
      const bFull = getPost(b.slug)
      return (aFull?.seriesOrder || 0) - (bFull?.seriesOrder || 0)
    })
  })

  const seriesEntries = Array.from(seriesMap.entries())

  return (
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
            Long-form thinking on AI strategy, governance, and what actually changes when
            intelligent systems hit the real world. Published when ready.
          </p>
        </div>

        {/* Series */}
        {seriesEntries.map(([seriesName, seriesPosts]) => (
          <div key={seriesName} className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <rect x="1" y="1" width="4" height="4" rx="0.5" opacity="0.5" />
                  <rect x="7" y="1" width="4" height="4" rx="0.5" opacity="0.7" />
                  <rect x="1" y="7" width="4" height="4" rx="0.5" opacity="0.7" />
                  <rect x="7" y="7" width="4" height="4" rx="0.5" />
                </svg>
                {seriesName} — {seriesPosts.length} parts
              </div>
            </div>
            <div className="grid gap-4">
              {seriesPosts.map((post) => (
                <PostCard key={post.slug} post={post} featured={false} />
              ))}
            </div>
          </div>
        ))}

        {/* Standalone posts */}
        {standalonePosts.length > 0 && (
          <div className="mb-10">
            {seriesEntries.length > 0 && (
              <h2
                className="mb-4 font-display text-xl font-normal tracking-tight"
                style={{ color: 'var(--fg)' }}
              >
                Standalone Essays
              </h2>
            )}
            <div className="grid gap-4">
              {standalonePosts.map((post, i) => (
                <PostCard key={post.slug} post={post} featured={i === 0 && seriesEntries.length === 0} />
              ))}
            </div>
          </div>
        )}

        {posts.length === 0 && (
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
  )
}
