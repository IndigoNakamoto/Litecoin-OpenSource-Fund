//pages/faq.tsx

import { InferGetStaticPropsType } from 'next'
import { allPages } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { MDXComponents } from '@/components/MDXComponents'
import { CollapsibleQuestion } from '../layouts/FaqLayout' // Import the component

const DEFAULT_LAYOUT = 'FaqLayout' // Changed to FaqLayout

export const getStaticProps = async () => {
  const page = allPages.find((p) => p.slug === 'faq')
  return { props: { page: page } }
}

export default function FAQ({
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!page) {
    return <div>Error: FAQ page content not found.</div>
  }

  // Extract QAs based on the marker
  const splitContent = page.body.raw.split('{/*QA*/}')
  const qaPairs = splitContent.slice(1).map((section) => {
    const lines = section.split('\n').filter(Boolean)

    // Remove '### ' from the beginning of the question
    const question = lines[0].replace(/^###\s*/, '')
    const answerArr = lines.slice(1)

    const answer = answerArr.join('\n')
    return { question, answer }
  })

  return (
    <MDXLayoutRenderer
      layout={page.layout || DEFAULT_LAYOUT}
      content={page}
      MDXComponents={MDXComponents}
    >
      {qaPairs.map((qa, index) => (
        <CollapsibleQuestion
          key={index}
          question={qa.question}
          answer={qa.answer}
        />
      ))}
    </MDXLayoutRenderer>
  )
}
