import { ReactNode } from 'react'
import Image from '@/components/Image'

interface Props {
  children: ReactNode
  title: string
}

export default function PageHeading({ title, children }: Props) {
  return (
    <div className="divide-gray-200 dark:divide-gray-700">
      <div className="">
        <h1 className="mt-10 font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 xs:text-6xl sm:leading-10 md:text-7xl md:leading-14">
          {title}
        </h1>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  )
}
