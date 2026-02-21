'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import clsx from 'clsx'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/writing', label: 'Writing' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <header
      className="sticky top-0 z-50 w-full border-b"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--bg)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-5 sm:px-8">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-display text-lg tracking-tight transition-opacity hover:opacity-70"
          style={{ color: 'var(--fg)' }}
        >
          JC
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 sm:flex">
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'nav-link text-sm font-medium transition-colors',
                  isActive ? 'active text-accent' : 'text-muted hover:text-[color:var(--fg)]'
                )}
                style={isActive ? { color: 'var(--accent)' } : {}}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right: theme toggle + mobile menu */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <MobileMenu pathname={pathname} />
        </div>
      </div>
    </header>
  )
}

function MobileMenu({ pathname }: { pathname: string }) {
  return (
    <div className="relative sm:hidden">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center rounded-md p-1.5 transition-colors hover:bg-[color:var(--border)]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="2" y1="5" x2="16" y2="5" />
            <line x1="2" y1="9" x2="16" y2="9" />
            <line x1="2" y1="13" x2="16" y2="13" />
          </svg>
        </summary>
        <div
          className="absolute right-0 top-full mt-2 w-44 rounded-lg border py-1 shadow-lg"
          style={{
            backgroundColor: 'var(--bg)',
            borderColor: 'var(--border)',
          }}
        >
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'block px-4 py-2 text-sm transition-colors',
                  isActive
                    ? 'text-accent font-medium'
                    : 'text-muted hover:text-[color:var(--fg)]'
                )}
                style={isActive ? { color: 'var(--accent)' } : {}}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </details>
    </div>
  )
}
