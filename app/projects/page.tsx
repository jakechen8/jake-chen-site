import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Things Jake Chen builds after hours — games, tools, and experiments at the intersection of strategy and code.',
}

const projects = [
  {
    title: 'AI Runner',
    status: 'Live',
    statusColor: 'var(--accent)',
    description:
      'An endless runner where you deploy an AI agent through bugs, firewalls, and hallucinations. Three difficulty modes. A boost button when things get desperate. Built with HTML5 Canvas and React.',
    tags: ['Canvas', 'React', 'Game Dev'],
    link: '/play',
    linkLabel: 'Play it',
    external: false,
  },
  {
    title: 'jake-chen.com',
    status: 'Live',
    statusColor: 'var(--accent)',
    description:
      'This site — built from scratch with Next.js 14, TypeScript, Tailwind, and MDX. Dark mode, RSS feed, dynamic OG images, reading progress, and a custom design system. No templates.',
    tags: ['Next.js', 'TypeScript', 'MDX'],
    link: 'https://github.com/jiakechen',
    linkLabel: 'Source',
    external: true,
  },
  {
    title: 'Repo Decoder',
    status: 'Live',
    statusColor: 'var(--accent)',
    description:
      'An interactive quiz embedded in my essay "You Don\'t Need a Glossary. You Need a Map." Tests whether you can navigate a modern codebase using a simple three-question framework.',
    tags: ['React', 'Interactive', 'Education'],
    link: '/writing/you-dont-need-a-glossary-you-need-a-map',
    linkLabel: 'Try it',
    external: false,
  },
]

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8">
      <div className="py-16 sm:py-24">
        {/* Header */}
        <div className="mb-16 max-w-xl">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}
          >
            Projects
          </p>
          <h1
            className="mb-4 font-display text-4xl font-normal tracking-tight sm:text-5xl"
            style={{ color: 'var(--fg)' }}
          >
            Things I build for fun
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            I love making things. These are side projects I&apos;ve built on nights
            and weekends — partly to learn, partly because it&apos;s fun, and partly
            because the best way to understand technology is to use it.
          </p>
        </div>

        {/* Project grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.title}
              className="project-card group flex flex-col rounded-lg border p-6"
              style={{ borderColor: 'var(--border-strong)' }}
            >
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <h2
                  className="font-display text-xl font-normal tracking-tight"
                  style={{ color: 'var(--fg)' }}
                >
                  {project.title}
                </h2>
                <span
                  className="flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: project.statusColor }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: project.statusColor }}
                  />
                  {project.status}
                </span>
              </div>

              {/* Description */}
              <p
                className="mb-4 flex-1 text-sm leading-relaxed"
                style={{ color: 'var(--fg-muted)' }}
              >
                {project.description}
              </p>

              {/* Tags */}
              <div className="mb-4 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                    style={{
                      color: 'var(--fg-subtle)',
                      background: 'var(--accent-light)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Link */}
              {project.link && (
                <div>
                  {project.external ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[color:var(--accent)]"
                      style={{ color: 'var(--fg-muted)' }}
                    >
                      {project.linkLabel}
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5" />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      href={project.link}
                      className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[color:var(--accent)]"
                      style={{ color: 'var(--fg-muted)' }}
                    >
                      {project.linkLabel}
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="2" y1="7" x2="12" y2="7" />
                        <polyline points="8 3 12 7 8 11" />
                      </svg>
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Friendly closing note */}
        <div className="mt-16 text-center">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-subtle)' }}>
            More things in the works. If you&apos;re building something cool,{' '}
            <Link
              href="/about#contact"
              className="underline underline-offset-2 transition-colors hover:text-[color:var(--accent)]"
            >
              I&apos;d love to hear about it
            </Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
