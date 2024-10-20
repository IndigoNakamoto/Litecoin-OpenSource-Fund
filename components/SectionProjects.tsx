import { ReactNode } from 'react'
import React from 'react'

interface Props {
  children: ReactNode
  bgColor?: string
  style?: string
}

export default function SectionProjects({ children, bgColor }: Props) {
  return (
    <div className={`bg-[${bgColor}]`}>
      <div className="mx-auto w-[1300px] max-w-full p-4 md:p-14 ">
        {children}
      </div>
    </div>
  )
}
