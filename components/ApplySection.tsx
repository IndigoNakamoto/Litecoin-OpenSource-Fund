import { ReactNode } from 'react'
import PageHeading from '@/components/PageHeading'
import React from 'react'

interface Props {
  children: ReactNode
  title: string
}

export default function ApplySection({ title, children }: Props) {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <PageHeading title={title}>
        <div className="markdown max-w-none pb-8 xl:col-span-2">{children}</div>
      </PageHeading>
    </div>
  )
}
