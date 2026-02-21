import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'

interface PostCardProps {
  post: PostMeta
  featured?: boolean
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <Link
      href={`/writing/${post.slug}`}
      className="post-card group block rounded-lg border p-5 sm:p-6"
      style={{ borderColor: 'var(--border)' }}
    >
      <article>
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2
          className={`font-display font-normal leading-snug tracking-tight transition-colors group-hover:text-accent ${
            featured ? 'text-2xl sm:text-3xl' : 'text-xl'
          }`}
          style={{ color: 'var(--fg)' }}
        >
          {post.title}
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p
            className="mt-2 text-sm leading-relaxed"
            style={{ color: 'var(--fg-muted)' }}
          >
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div
          className="mt-4 flex items-center gap-3 text-xs"
          style={{ color: 'var(--fg-subtle)' }}
        >
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {post.readingTime && (
            <>
              <span>&middot;</span>
              <span>{post.readingTime}</span>
            </>
          )}
          <span
            className="ml-auto flex items-center gap-1 font-medium transition-colors group-hover:text-accent"
            style={{ color: 'var(--fg-muted)' }}
          >
            Read
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <line x1="2" y1="6" x2="10" y2="6" />
              <polyline points="6.5 2.5 10 6 6.5 9.5" />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  )
}
