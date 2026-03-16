import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Uses — Tools, Hardware & Software for Strategy and Code',
  description: 'The tools, hardware, and software Jake Chen uses daily — from Cursor and Claude to MacBook Pro and Figma. A working setup for AI strategy and side projects.',
  alternates: { canonical: 'https://jake-chen.com/uses' },
}

const sections = [
  {
    title: 'Hardware',
    items: [
      { name: 'MacBook Pro 16" M3 Max', note: 'The daily driver. Handles everything from Figma to local model inference.' },
      { name: 'Apple Studio Display', note: 'Clean, bright, no fuss. One cable.' },
      { name: 'iPhone 15 Pro', note: 'Mostly for testing mobile layouts and pretending I\'ll respond to Slack faster.' },
      { name: 'AirPods Pro', note: 'Focus mode essential. Noise cancellation is the real productivity tool.' },
    ],
  },
  {
    title: 'Development',
    items: [
      { name: 'Cursor', note: 'Primary editor. The AI integration changed how I build side projects — for better and worse.' },
      { name: 'VS Code', note: 'Still use it for heavier projects where I want full control over extensions and config.' },
      { name: 'iTerm2 + zsh', note: 'Nothing fancy. Starship prompt, a few aliases, that\'s it.' },
      { name: 'GitHub', note: 'All my side projects live here. Copilot for the boring parts.' },
      { name: 'Vercel', note: 'Deploy on push. This site runs on it.' },
    ],
  },
  {
    title: 'AI Tools',
    items: [
      { name: 'Claude', note: 'My go-to for thinking through strategy problems and writing. Feels like talking to a sharp colleague.' },
      { name: 'ChatGPT', note: 'Good for quick lookups and brainstorming. The plugins are still finding their footing.' },
      { name: 'Cursor + Claude/GPT', note: 'The vibe coding stack. Fast for prototyping, dangerous for architecture decisions.' },
      { name: 'Perplexity', note: 'Replaced most of my Google searches for research-heavy questions.' },
    ],
  },
  {
    title: 'Design',
    items: [
      { name: 'Figma', note: 'For mockups when I need to think visually before coding.' },
      { name: 'Tailwind CSS', note: 'The only CSS framework I\'ll use. Ship fast, stay consistent.' },
      { name: 'Excalidraw', note: 'For quick diagrams and system sketches. The hand-drawn look keeps things informal.' },
    ],
  },
  {
    title: 'Productivity',
    items: [
      { name: 'Arc Browser', note: 'Spaces for work vs. personal. The best browser nobody\'s heard of.' },
      { name: 'Notion', note: 'Knowledge base, project tracker, essay drafts. Everything lands here first.' },
      { name: 'Apple Calendar', note: 'Calendar blocking is the only productivity system that\'s ever stuck for me.' },
      { name: 'Apple Notes', note: 'For quick captures. Anything that survives 24 hours gets moved to Notion.' },
      { name: 'Spotify', note: 'Instrumental focus playlists when writing. Lo-fi hip hop is a cliche because it works.' },
    ],
  },
]

export default function UsesPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8">
      <div className="py-16 sm:py-24">
        {/* Header */}
        <div className="mb-16 max-w-xl">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}
          >
            Uses
          </p>
          <h1
            className="mb-4 font-display text-4xl font-normal tracking-tight sm:text-5xl"
            style={{ color: 'var(--fg)' }}
          >
            What I use
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            The tools and software I reach for daily. Updated occasionally.
            Not an affiliate link farm &mdash; just what actually works for&nbsp;me.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section) => (
            <div key={section.title}>
              <h2
                className="mb-5 font-display text-xl font-normal tracking-tight"
                style={{ color: 'var(--fg)' }}
              >
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div
                    key={item.name}
                    className="border-l-2 pl-4"
                    style={{ borderColor: 'var(--border-strong)' }}
                  >
                    <p className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
                      {item.name}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
