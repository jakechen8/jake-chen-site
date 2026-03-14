'use client'

const books = [
  {
    title: 'Thinking in Systems',
    author: 'Donella Meadows',
    take: 'The best book on understanding why complex organizations behave the way they do. I re-read it every year.',
  },
  {
    title: 'The Alignment Problem',
    author: 'Brian Christian',
    take: 'The most honest book about what goes wrong when AI systems meet the real world. Required reading for anyone deploying AI.',
  },
  {
    title: 'Competing in the Age of AI',
    author: 'Iansiti & Lakhani',
    take: 'Gets the operating model question right — AI changes how firms run, not just what they sell.',
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    take: 'Every decision framework I use has roots here. The gap between System 1 and System 2 is the gap between a demo and a product.',
  },
]

export default function Bookshelf() {
  return (
    <section aria-label="What Jake is reading">
      <div className="mb-8 flex items-end justify-between">
        <h2
          className="font-display text-2xl font-normal tracking-tight sm:text-3xl"
          style={{ color: 'var(--fg)' }}
        >
          On the shelf
        </h2>
        <p className="text-xs" style={{ color: 'var(--fg-subtle)' }}>
          Books that shaped how I think
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {books.map((book) => (
          <div
            key={book.title}
            className="group rounded-lg border p-5 transition-all"
            style={{ borderColor: 'var(--border-strong)' }}
          >
            <p className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>
              {book.title}
            </p>
            <p className="mb-2 text-xs" style={{ color: 'var(--fg-subtle)' }}>
              {book.author}
            </p>
            <p className="text-sm leading-relaxed italic" style={{ color: 'var(--fg-muted)' }}>
              &ldquo;{book.take}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
