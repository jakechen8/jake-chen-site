import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

export interface PostMeta {
  slug: string
  title: string
  date: string
  excerpt?: string
  tags?: string[]
  readingTime?: string
  published?: boolean
}

export interface Post extends PostMeta {
  content: string
}

function getPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
}

export function getAllPosts(): PostMeta[] {
  return getPostFiles()
    .map((file): PostMeta | null => {
      const slug = file.replace(/\.(mdx|md)$/, '')
      const fullPath = path.join(POSTS_DIR, file)
      const source = fs.readFileSync(fullPath, 'utf-8')
      const { data, content } = matter(source)

      if (data.published === false) return null

      const rt = readingTime(content)

      return {
        slug,
        title: data.title || 'Untitled',
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        excerpt: data.excerpt || data.description || '',
        tags: data.tags || [],
        readingTime: rt.text,
        published: data.published !== false,
      }
    })
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPost(slug: string): Post | null {
  const extensions = ['mdx', 'md']
  let source: string | null = null

  for (const ext of extensions) {
    const fullPath = path.join(POSTS_DIR, `${slug}.${ext}`)
    if (fs.existsSync(fullPath)) {
      source = fs.readFileSync(fullPath, 'utf-8')
      break
    }
  }

  if (!source) return null

  const { data, content } = matter(source)
  const rt = readingTime(content)

  return {
    slug,
    title: data.title || 'Untitled',
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    excerpt: data.excerpt || data.description || '',
    tags: data.tags || [],
    readingTime: rt.text,
    content,
    published: data.published !== false,
  }
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tagSet = new Set<string>()
  posts.forEach((p) => p.tags?.forEach((t) => tagSet.add(t)))
  return Array.from(tagSet).sort()
}
