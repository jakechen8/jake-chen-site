import type { Metadata } from 'next'
import { getAllPosts, getAllTags } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import EmailCapture from '@/components/EmailCapture'

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Essays on autonomy, trust, and the systems beneath AI.',
}

export default async function WritingPage() {
  const posts = await Promise.resolve(getAllPosts())
  const tags = await Promise.resolve(getAllTags())

  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8">
      <div className="py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12 max-w-xl">
          <p
            className="mb-3 text-xs font-medium uppercase tracking-widest"
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
            Long-form thinking on how intelligent systems scale in the real world —
            and what determines whether they succeed. Published when ready.
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Posts */}
        {posts.length === 0 ? (
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
            <p className="mt-2 text-sm" style={{ color: 'var(--fg-subtle)' }}>
              Subscribe below to be the first to read them.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post, i) => (
              <div
                key={post.slug}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'both' }}
              >
                <PostCard post={post} featured={i === 0} />
              </div>
            ))}
          </div>
        )}

        {/* Subscribe */}
        <div
          className="mt-16 rounded-lg border p-6 sm:p-8"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="section-tag mb-3">
            On Autonomy, Trust &amp; the Systems Beneath AI
          </p>
          <h2
            className="mb-2 font-display text-xl font-normal tracking-tight"
            style={{ color: 'var(--fg)' }}
          >
            Thoughtful essays on how intelligent systems scale
          </h2>
          <p className="mb-5 text-sm" style={{ color: 'var(--fg-subtle)' }}>
            No noise. No hype. Just signal. Or grab the{' '}
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
