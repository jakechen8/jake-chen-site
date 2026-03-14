import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'

interface SeriesNavProps {
  series: string
  currentSlug: string
  posts: PostMeta[]
}

export default function SeriesNav({ series, currentSlug, posts }: SeriesNavProps) {
  return (
    <div
      className="mt-12 rounded-lg border p-6"
      style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-warm)' }}
    >
      <p
        className="mb-1 font-mono text-xs font-medium uppercase tracking-widest"
        style={{ color: 'var(--accent)' }}
      >
        Series
      </p>
      <p className="mb-4 font-display text-lg" style={{ color: 'var(--fg)' }}>
        {series}
      </p>
      <div className="space-y-2">
        {posts.map((post, i) => {
          const isCurrent = post.slug === currentSlug
          return (
            <div key={post.slug} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
                style={{
                  background: isCurrent ? 'var(--accent)' : 'var(--border)',
                  color: isCurrent ? 'var(--white)' : 'var(--fg-subtle)',
                }}
              >
                {i + 1}
              </span>
              {isCurrent ? (
                <span
                  className="text-sm font-medium"
                  style={{ color: 'var(--fg)' }}
                >
                  {post.title}
                </span>
              ) : (
                <Link
                  href={`/writing/${post.slug}`}
                  className="text-sm transition-colors hover:text-[color:var(--accent)]"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  {post.title}
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
