import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="mt-24 border-t"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="space-y-1">
          <p className="font-display text-base" style={{ color: 'var(--fg)' }}>
            Jake Chen
          </p>
          <p className="text-xs" style={{ color: 'var(--fg-subtle)' }}>
            Autonomy · Trust · Systems
          </p>
          <p className="text-xs" style={{ color: 'var(--fg-subtle)' }}>
            &copy; {year}
          </p>
        </div>

        <nav className="flex flex-wrap gap-5">
          {[
            { href: '/writing', label: 'Writing' },
            { href: '/about', label: 'About' },
            { href: '/contact', label: 'Contact' },
            { href: 'https://linkedin.com/in/jiakechen', label: 'LinkedIn', external: true },
            { href: '/feed.xml', label: 'RSS', external: true },
          ].map(({ href, label, external }) => (
            <Link
              key={href}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="text-xs font-medium transition-colors hover:text-[color:var(--accent)]"
              style={{ color: 'var(--fg-muted)' }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
