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
      <PageSEO title={`${title} - Lite.Space`} description={`${summary}`} />
      <div className="prose max-w-none pb-8 pt-8 dark:prose-dark xl:col-span-2">
        <h1 className="mt-[78vh] text-5xl">{title}</h1>
        {children}
      </div>
    </>
  )
}
