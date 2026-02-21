import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, getPost } from '@/lib/posts'
import { MDXRemote } from 'next-mdx-remote/rsc'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost(params.slug)
  if (!post) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jake-chen.com'

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
          url: `/api/og?title=${encodeURIComponent(post.title)}`,
          width: 1200,
          height: 630,
        },
      ],
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

  return (
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

        {/* MDX Content */}
        <article className="prose prose-neutral max-w-2xl">
          <MDXRemote source={post.content} />
        </article>

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
  )
}
