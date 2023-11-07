//pages/faq.tsx

import { InferGetStaticPropsType } from 'next'
import { allPages } from 'contentlayer/generated'
import faqData from '../data/pages/faq.json'
import { FAQSection } from '@/components/FAQSection'
import { PageSEO } from '@/components/SEO'

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
    <div className="">
      <PageSEO title={`Lite.Space | FAQ`} description={`${page.summary}`} />
      <h1 className="pl-4 pt-20 text-5xl font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:leading-10 md:text-7xl md:leading-14 xl:col-span-2">
        FAQ
      </h1>
      <div className="mt-0 rounded-xl bg-gradient-to-r from-gray-100 to-gray-300 p-4 dark:bg-gradient-to-r dark:from-gray-700 dark:to-gray-800 dark:text-gray-300 md:px-4 lg:px-8">
        <FAQSection faqCategories={faqDataModule.questionsAndAnswers} />
      </div>
    </div>
  )
}
