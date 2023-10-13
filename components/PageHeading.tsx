import { ReactNode } from 'react'
import Image from '@/components/Image'

interface Props {
  children: ReactNode
  title: string
}

export default function PageHeading({ title, children }: Props) {
  return (
    <div className="">
      <div className="items-start pb-8 pt-5 md:space-y-5 xl:grid xl:gap-x-8">
        <div></div>
        <h1 className="mt-10 font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 xs:text-6xl sm:leading-10 md:text-7xl md:leading-14">
          {title}
        </h1>
      </div>
      <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
        {children}
      </div>
    </div>
  )
}
