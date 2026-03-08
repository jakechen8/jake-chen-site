'use client'

import { useState, useEffect } from 'react'

interface TOCItem {
  id: string
  text: string
  level: number
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const article = document.querySelector('article.prose')
    if (!article) return

    const els = article.querySelectorAll('h2, h3')
    const items: TOCItem[] = []

    els.forEach((el) => {
      // Generate id if missing
      if (!el.id) {
        el.id = el.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || ''
      }
      items.push({
        id: el.id,
        text: el.textContent || '',
        level: el.tagName === 'H2' ? 2 : 3,
      })
    })

    setHeadings(items)
  }, [])

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible heading
        const visible = entries.find((e) => e.isIntersecting)
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 3) return null

  return (
    <nav className="hidden xl:block">
      <div className="sticky top-24">
        <p
          className="mb-3 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--fg-subtle)' }}
        >
          On this page
        </p>
        <ul className="space-y-1.5 border-l" style={{ borderColor: 'var(--border)' }}>
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="block border-l-2 py-0.5 text-[13px] leading-snug transition-all duration-200"
                style={{
                  paddingLeft: h.level === 3 ? '1.5rem' : '0.75rem',
                  borderColor: activeId === h.id ? 'var(--accent)' : 'transparent',
                  color: activeId === h.id ? 'var(--accent)' : 'var(--fg-subtle)',
                  fontWeight: activeId === h.id ? 500 : 400,
                }}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
