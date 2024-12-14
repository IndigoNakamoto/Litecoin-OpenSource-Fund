import { InferGetStaticPropsType } from 'next'
import { allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { MDXComponents } from '@/components/MDXComponents'

const DEFAULT_LAYOUT = 'AuthorLayout'

export async function getStaticPaths() {
  return {
    paths: allAuthors.map((p) => ({ params: { slug: p.slug.split('/') } })),
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const slug = (params.slug as string[]).join('/')
  const author = allAuthors.find((p) => p.slug === slug)

  // Check if the author is not found and handle the case
  if (!author) {
    return {
      notFound: true, // You can also return a custom 404 page here
    }
  }

  return { props: { author } }
}

export default function About({
  author,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!author) {
    // Handle the case where author is undefined (e.g., show a loading indicator or error message)
    return <div>Loading...</div>
  }

  return (
    <MDXLayoutRenderer
      layout={DEFAULT_LAYOUT}
      content={author}
      MDXComponents={MDXComponents}
    />
  )
}
