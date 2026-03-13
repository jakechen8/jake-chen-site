'use client'

interface ReadingItem {
  title: string
  author: string
  url: string
  note: string
}

export default function ReadingCard({ item }: { item: ReadingItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="reading-card group block rounded-lg border p-5 transition-all duration-200 hover:-translate-y-0.5"
      style={{ borderColor: 'var(--border)', background: 'transparent' }}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-base font-normal" style={{ color: 'var(--fg)' }}>
            {item.title}
          </p>
          <p className="text-xs" style={{ color: 'var(--fg-subtle)' }}>
            {item.author}
          </p>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-1 shrink-0 opacity-40 transition-opacity group-hover:opacity-100"
          style={{ color: 'var(--fg-subtle)' }}
        >
          <path d="M5 3H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V9" />
          <polyline points="9 1 13 1 13 5" />
          <line x1="6" y1="8" x2="13" y2="1" />
        </svg>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
        {item.note}
      </p>
    </a>
  )
}
