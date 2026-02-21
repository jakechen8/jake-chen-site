import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import EmailCapture from '@/components/EmailCapture'

export const metadata: Metadata = {
  title: 'Jake Chen',
  description:
    'Building autonomous systems at Waymo. Writing about how intelligent machines earn trust in the real world.',
}

export default async function HomePage() {
  const posts = await Promise.resolve(getAllPosts())
  const recentPosts = posts.slice(0, 3)

  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8">
      {/* Hero */}
      <section className="py-24 sm:py-32">
        <div className="max-w-2xl">
          <h1
            className="animate-fade-up font-display text-4xl font-normal leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            style={{ color: 'var(--fg)' }}
          >
            Jake Chen
          </h1>

          <p
            className="animate-fade-up-delay mt-6 text-lg leading-relaxed"
            style={{ color: 'var(--fg-muted)' }}
          >
            I build autonomous systems at{' '}
            <span style={{ color: 'var(--fg)' }}>Waymo</span> and write about
            how intelligent machines earn trust in the real world.
          </p>

          <p
            className="animate-fade-up-delay mt-3 text-sm"
            style={{ color: 'var(--fg-subtle)' }}
          >
            Currently focused on world simulation.
          </p>

          <div className="animate-fade-up-delay-2 mt-8 flex flex-wrap gap-3">
            <Link href="/writing" className="btn-primary">
              Read my writing
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
                <line x1="2" y1="7" x2="12" y2="7" />
                <polyline points="8 3 12 7 8 11" />
              </svg>
            </Link>
            <Link href="/about" className="btn-ghost">
              About me
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="rule" />

      {/* Recent Writing */}
      {recentPosts.length > 0 && (
        <section className="py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2
              className="font-display text-2xl font-normal tracking-tight"
              style={{ color: 'var(--fg)' }}
            >
              Recent Writing
            </h2>
            <Link
              href="/writing"
              className="flex items-center gap-1 text-sm transition-colors hover:text-[color:var(--accent)]"
              style={{ color: 'var(--fg-muted)' }}
            >
              All posts
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="2" y1="6" x2="10" y2="6" />
                <polyline points="6.5 2.5 10 6 6.5 9.5" />
              </svg>
            </Link>
          </div>

          <div className="grid gap-4">
            {recentPosts.map((post, i) => (
              <div
                key={post.slug}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
              >
                <PostCard post={post} featured={i === 0} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Divider */}
      <hr className="rule" />

      {/* Email capture — single instance */}
      <section className="py-16">
        <div className="mx-auto max-w-lg text-center">
          <h2
            className="mb-2 font-display text-2xl font-normal tracking-tight"
            style={{ color: 'var(--fg)' }}
          >
            Stay in the loop
          </h2>
          <p className="mb-6 text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            New essays when they&apos;re ready. No noise.
          </p>
          <EmailCapture compact />
        </div>
      </section>
    </div>
  )
}
