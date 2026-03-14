'use client'

import { useState, useMemo } from 'react'
import PostCard from './PostCard'

interface Post {
  slug: string
  title: string
  date: string
  excerpt?: string
  tags?: string[]
  readingTime?: string
  published?: boolean
}

interface TagFilterProps {
  posts: Post[]
}

export default function TagFilter({ posts }: TagFilterProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach((p) => p.tags?.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [posts])

  const filtered = activeTag
    ? posts.filter((p) => p.tags?.includes(activeTag))
    : posts

  return (
    <div>
      {/* Tag pills */}
      <div className="mb-6 flex flex-wrap gap-1.5" role="group" aria-label="Filter by tag">
        <button
          onClick={() => setActiveTag(null)}
          aria-pressed={activeTag === null}
          className="rounded-full border px-3 py-1 text-xs font-medium transition-all"
          style={{
            borderColor: activeTag === null ? 'var(--accent)' : 'var(--border-strong)',
            background: activeTag === null ? 'var(--accent-light)' : 'transparent',
            color: activeTag === null ? 'var(--accent)' : 'var(--fg-subtle)',
          }}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            aria-pressed={activeTag === tag}
            className="rounded-full border px-3 py-1 text-xs font-medium transition-all"
            style={{
              borderColor: activeTag === tag ? 'var(--accent)' : 'var(--border-strong)',
              background: activeTag === tag ? 'var(--accent-light)' : 'transparent',
              color: activeTag === tag ? 'var(--accent)' : 'var(--fg-subtle)',
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Filtered posts */}
      <div className="grid gap-4" aria-live="polite">
        {filtered.map((post, i) => (
          <PostCard key={post.slug} post={post} featured={i === 0 && !activeTag} />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm" style={{ color: 'var(--fg-subtle)' }}>
            No posts with that tag yet.
          </p>
        )}
      </div>
    </div>
  )
}
