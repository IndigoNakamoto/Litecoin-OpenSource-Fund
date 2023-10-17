//pages/faq.tsx

import { InferGetStaticPropsType } from 'next'
import { allPages } from 'contentlayer/generated'
import faqData from '../data/pages/faq.json'
import { FAQSection } from '@/components/FAQSection'

export const getStaticProps = async () => {
  const page = allPages.find((p) => p.slug === 'faq')
  return { props: { page, faqDataModule: faqData } }
}

export default function FAQ({
  page,
  faqDataModule,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!page) {
    return <div>Error: FAQ page content not found.</div>
  }

  return (
    <div>
      <h1 className="my-10 font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 xs:text-6xl sm:leading-10 md:text-7xl md:leading-14">
        FAQ
      </h1>
      <div className="content px-4 leading-relaxed text-gray-800 dark:text-gray-300 lg:px-8">
        <FAQSection faqCategories={faqDataModule.questionsAndAnswers} />
      </div>
    </div>
  )
}
