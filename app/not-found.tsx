import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8">
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        {/* JC badge — same style as the game character */}
        <div
          className="mb-8 flex h-20 w-16 items-center justify-center rounded-lg border-2"
          style={{ borderColor: 'var(--accent)', background: 'var(--bg-warm)' }}
        >
          <span
            className="font-mono text-2xl font-bold"
            style={{ color: 'var(--fg)' }}
          >
            JC
          </span>
        </div>

        <h1
          className="mb-3 font-display text-4xl font-normal tracking-tight sm:text-5xl"
          style={{ color: 'var(--fg)' }}
        >
          Wrong turn
        </h1>
        <p
          className="mb-8 max-w-md text-base leading-relaxed"
          style={{ color: 'var(--fg-muted)' }}
        >
          This page doesn&apos;t exist — or it did, and it&apos;s been moved. Either way,
          you ended up somewhere unexpected. Like an AI agent hitting a dead end.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Back to home
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="2" y1="7" x2="12" y2="7" />
              <polyline points="8 3 12 7 8 11" />
            </svg>
          </Link>
          <Link href="/writing" className="btn-ghost">Read essays</Link>
          <Link href="/play" className="btn-ghost">Play AI Runner</Link>
        </div>
      </div>
    </div>
  )
}
