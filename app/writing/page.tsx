import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import TagFilter from '@/components/TagFilter'
import EmailCapture from '@/components/EmailCapture'

export const metadata: Metadata = {
  title: 'Writing — Essays on AI Strategy, Trust & Second-Order Effects',
  description: 'Long-form essays by Jake Chen on AI strategy, second-order effects, autonomous systems, trust at scale, and the gap between what gets announced and what actually ships.',
  alternates: { canonical: 'https://jake-chen.com/writing' },
}

export default async function WritingPage() {
  const posts = await Promise.resolve(getAllPosts())

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
            How AI is reshaping decisions, organizations, and the systems we rely on &mdash;
            the second-order effects nobody talks about. Published when&nbsp;ready.
          </p>
        </div>

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
  )
}
