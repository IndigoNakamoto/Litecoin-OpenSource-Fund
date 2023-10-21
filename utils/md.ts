import fs, { existsSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { ProjectItem, ProjectUpdate } from './types'
const postsDirectory = join(process.cwd(), 'data/projects')

const FIELDS = [
  'title',
  'summary',
  'slug',
  'git',
  'content',
  'coverImage',
  'nym',
  'website',
  'twitter',
  'hidden',
  'type',
  'contributor',
  'owner',
  'hashtag',
  'socialSummary',
]

const UPDATE_FIELDS = [
  'title',
  'date',
  'summary',
  'tags',
  'id',
  'authorTwitterHandle',
]

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
}

export function getSingleFile(path: string) {
  const fullPath = join(process.cwd(), path)
  return fs.readFileSync(fullPath, 'utf8')
}

export function getPostBySlug(
  slug: string,
  includeHidden = false
): ProjectItem {
  const fields = FIELDS
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}/${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const items: any = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }
    if (field === 'contributor') {
      items[field] = content
    }
    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
  })
  if (items.hidden && !includeHidden) {
    throw new Error('Hidden project')
  }
  return items
}

/*
CRITICAL BUG. WON'T DEPLY ON VERCEL 
Error occurred prerendering page "/missions/general_fund". Read more: https://nextjs.org/docs/messages/prerender-error
Error: ENOENT: no such file or directory, scandir '/vercel/path0/data/projects/general_fund/updates/'
    at Object.readdirSync (node:fs:1527:3)
    at getAllPostUpdates (/vercel/path0/.next/server/chunks/8914.js:1:8504)
    at getStaticProps (/vercel/path0/.next/server/pages/missions/[slug].js:1:14054)
    at /vercel/path0/node_modules/next/dist/compiled/next-server/pages.runtime.prod.js:47:4095
    at /vercel/path0/node_modules/next/dist/server/lib/trace/tracer.js:117:36
    at NoopContextManager.with (/vercel/path0/node_modules/@opentelemetry/api/build/src/context/NoopContextManager.js:36:24)
    at ContextAPI.with (/vercel/path0/node_modules/@opentelemetry/api/build/src/api/context.js:71:54)
    at NoopTracer.startActiveSpan (/vercel/path0/node_modules/@opentelemetry/api/build/src/trace/NoopTracer.js:67:28)
    at ProxyTracer.startActiveSpan (/vercel/path0/node_modules/@opentelemetry/api/build/src/trace/ProxyTracer.js:36:24)
    at /vercel/path0/node_modules/next/dist/server/lib/trace/tracer.js:106:107
*/
export function getAllPostUpdates(slug: string): ProjectUpdate[] {
  const realSlug = slug.replace(/\.md$/, '')
  const postUpdatesDirectory = join(
    process.cwd(),
    `data/projects/${realSlug}/updates/`
  )

  const updates = fs.readdirSync(postUpdatesDirectory)

  const updatesModified = updates.map((update) => {
    try {
      const fields = UPDATE_FIELDS
      const realSlug = update.replace(/\.md$/, '')
      const fullPath = join(postUpdatesDirectory, `/${realSlug}.md`)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      const items: ProjectUpdate = {
        content: '',
        title: '',
        summary: '',
        date: '',
        authorTwitterHandle: '',
        id: 0,
      }

      fields.forEach((field) => {
        if (field === 'title') {
          items[field] = realSlug
        }
        if (field === 'summary') {
          items[field] = content
        }
        if (field === 'date') {
          items[field] = content
        }
        if (field === 'content') {
          items[field] = content
        }
        if (field === 'authorTwitterHandle') {
          items['authorTwitterHandle'] = data['authorTwitterHandle']
        }
        if (typeof data[field] !== 'undefined') {
          items[field] = data[field]
        }
        items['content'] = content
        items['id'] = data['id']
      })
      return items
    } catch {
      return {
        content: '',
        title: '',
        summary: '',
        date: '',
        authorTwitterHandle: '',
        id: 0,
      }
    }
  })

  

  return updatesModified.sort((a, b) => b.id - a.id)
}

export function getAllPosts(): ProjectItem[] {
  const slugs = getPostSlugs()
  //get all posts & return them but make sure to catch errors from getPostBySlug and filter them out
  return slugs
    .map((slug) => {
      try {
        return getPostBySlug(slug)
      } catch {
        return null
      }
    })
    .filter((a) => a != null) as ProjectItem[]
}
