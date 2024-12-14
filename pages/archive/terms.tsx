import { InferGetStaticPropsType } from 'next'
import { allPages } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { MDXComponents } from '@/components/MDXComponents'

const DEFAULT_LAYOUT = 'PageLayout'

export const getStaticProps = async () => {
  const page = allPages.find((p) => p.slug === 'terms')
  return { props: { page: page } }
}

export default function Terms({
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // Check if page is defined before rendering
  if (!page) {
    return <p>Page not found.</p>
  }

  return (
    <MDXLayoutRenderer
      layout={page.layout || DEFAULT_LAYOUT}
      content={page as any} // Cast to any type to bypass the TypeScript error. (Ideally, proper typing should be used)
      MDXComponents={MDXComponents}
    />
  )
}
