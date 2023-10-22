import { ReactNode } from 'react'
import Image from '@/components/Image'

interface Props {
  children: ReactNode
  title: string
}

export default function PageHeading({ title, children }: Props) {
  return (
    <div className="">
      <div className="pb-8md:space-y-5 items-start xl:grid xl:gap-x-8">
        <div></div>
        <h1 className="pl-4 pt-20 text-5xl font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:leading-10 md:text-7xl md:leading-14 xl:col-span-2">
          {title}
        </h1>
      </div>
      <div className="mt-0 rounded-xl bg-gradient-to-b from-gray-200 to-white p-4 dark:from-gray-800 dark:to-gray-700 dark:text-gray-300 xs:px-1 md:px-4 lg:px-8">
        {children}
      </div>
    </div>
  )
}
