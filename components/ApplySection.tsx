import { ReactNode } from 'react'
import PageHeading from '@/components/PageHeading'
import React from 'react'

interface Props {
  children: ReactNode
  title: string
  style?: string
}

export default function ApplySection({
  title,
  children,
  style = 'markdown',
}: Props) {
  return (
    <div className="divide-y divide-gray-200">
      <PageHeading title={title}>
        <div className={`${style} max-w-none p-4  xl:col-span-2`}>
          {children}
        </div>
      </PageHeading>
    </div>
  )
}
