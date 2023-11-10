import { ReactNode } from 'react'
// import type { Pages } from 'contentlayer/generated'
import { PageSEO } from '@/components/SEO'
import { CoreContent } from 'pliny/utils/contentlayer'

interface Props {
  children: ReactNode
  content: CoreContent<any>
}

export default function PageLayout({ children, content }: Props) {
  const { title = '', summary = '' } = content

  return (
    <>
      <PageSEO title={`Lite.Space | ${title}`} description={`${summary}`} />
      <div className="max-w-full">
        <h1 className="pl-4 pt-20 text-5xl font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:leading-10 md:text-7xl md:leading-14 xl:col-span-2">
          {title}
        </h1>
        <div className="prose mt-0 max-w-none rounded-xl bg-gradient-to-b from-gray-200 to-gray-100 p-4 dark:prose-dark  dark:from-gray-700 dark:to-gray-800">
          {children}
        </div>
      </div>
    </>
  )
}
