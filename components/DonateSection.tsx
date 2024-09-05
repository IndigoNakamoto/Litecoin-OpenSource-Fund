import { ReactNode } from 'react'
import PageHeading from '@/components/PageHeading'
import React from 'react'

interface Props {
  children: ReactNode
  title: string
  style?: string
}

export default function DonateSection({
  title,
  children,
  style = 'markdown',
}: Props) {
  return (
    <div className="bg-white p-8">
      <div className="mx-auto mt-32 flex min-h-screen w-[1300px] max-w-[90%] pb-16">
        <h1 className="markdown py-4 font-space-grotesk text-4xl font-semibold">
          {title}
        </h1>
        <div>{children}</div>
      </div>
    </div>
  )
}
