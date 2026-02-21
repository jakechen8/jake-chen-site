import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'
import RSS from 'rss'

export const dynamic = 'force-dynamic'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jake-chen.com'

export async function GET() {
  const posts = getAllPosts()

  const feed = new RSS({
    title: 'Jake Chen — Writing',
    description:
      'Essays on trust, autonomy, and how intelligent systems interact with the real world.',
    site_url: siteUrl,
    feed_url: `${siteUrl}/feed.xml`,
    language: 'en',
    ttl: 60,
    copyright: `© ${new Date().getFullYear()} Jake Chen`,
    managingEditor: 'hello@jakechenai.com (Jake Chen)',
    webMaster: 'hello@jakechenai.com (Jake Chen)',
  })

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.excerpt || '',
      url: `${siteUrl}/writing/${post.slug}`,
      guid: `${siteUrl}/writing/${post.slug}`,
      date: new Date(post.date),
      categories: post.tags || [],
      author: 'Jake Chen',
    })
  })

  const xml = feed.xml({ indent: true })

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=600',
    },
  })
}
