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
    <div
      className="bg-[#f0f0f0] p-8"
      style={{
        backgroundImage: "url('/static/images/design/Mask-Group-20.webp')",
      }}
    >
      <div
        className="mx-auto mt-32 w-[1300px] max-w-[90%] pb-16"
        style={{ minHeight: 'calc(100vh - 30rem)', marginTop: '8rem' }}
      >
        <h1 className="markdown py-4 font-space-grotesk text-4xl font-semibold">
          {title}
        </h1>
        <div>{children}</div>
      </div>
    </div>
  )
}
