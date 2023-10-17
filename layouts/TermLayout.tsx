import { ReactNode } from 'react'
import type { Pages } from 'contentlayer/generated'
import { PageSEO } from '@/components/SEO'
import { CoreContent } from 'pliny/utils/contentlayer'

interface Props {
  children: ReactNode
  content: CoreContent<Pages>
}

export default function PageLayout({ children, content }: Props) {
  const { title = '', summary = '' } = content

  return (
    <>
      <PageSEO title={`Lite.Space | ${title}`} description={`${summary}`} />
      <div className="prose max-w-none pb-8 pt-8 dark:prose-dark xl:col-span-2">
        <h1 className="mt-[78vh]  font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 xs:text-6xl sm:leading-10 md:text-7xl md:leading-14">
          {title}
        </h1>
        {children}
      </div>
    </>
  )
}
