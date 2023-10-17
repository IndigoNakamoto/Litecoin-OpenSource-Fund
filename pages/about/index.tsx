import { InferGetStaticPropsType } from 'next'
import { allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { MDXComponents } from '@/components/MDXComponents'
import Image from '@/components/Image'
import Link from '@/components/Link'
// import Credits from '@/components/Supporters'
import Volunteers from '@/components/Volunteers'
import React from 'react'

const DEFAULT_LAYOUT = 'AuthorLayout'

export const getStaticProps = async () => {
  const openSats = allAuthors.find((p) => p.slug === 'default')
  if (!openSats) {
    // Handle the error, e.g., return a default value or throw an error.
    throw new Error('Default author not found') // Just an example, adjust as per your requirements.
  }

  const boardOrder = [
    'charlie_lee',
    'alan_austin',
    'jay_milla',
    'david_schwartz',
    'indigo_nakamoto',
  ] // Specify the desired order of board members
  const board = allAuthors
    .filter((p) => p.board === true)
    .sort((a, b) => boardOrder.indexOf(a.slug) - boardOrder.indexOf(b.slug)) // Sort based on the desired order

  const ops = allAuthors.filter((p) => p.ops === true)
  return { props: { openSats, board, ops } }
}

export default function About({
  openSats,
  board,
}: // ops,
InferGetStaticPropsType<typeof getStaticProps>) {
  if (!openSats) {
    return <div>Author not found</div> // Handle the undefined openSats value.
  }
  return (
    <>
      <MDXLayoutRenderer
        layout={openSats?.layout || DEFAULT_LAYOUT}
        content={openSats}
        MDXComponents={MDXComponents}
      />

      {/* List all members of the board */}
      <div className="">
        <hr className="border-t-2 border-primary-200 dark:border-primary-900" />
        <div className="items-start space-y-2 pb-8 pt-6 md:space-y-5 xl:grid xl:grid-cols-3 xl:gap-x-8">
          <h2 className="text-3xl font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl sm:leading-10 md:text-5xl md:leading-14">
            Council Members
          </h2>
          <div></div>
        </div>

        <div className="grid items-start space-y-2 xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="col-start-0 col-span-3 grid grid-cols-3 space-y-2 sm:gap-x-2 md:grid-cols-5 md:gap-x-8">
            {board.map((member, i) => (
              <div className="items-left flex flex-col space-x-2" key={i}>
                <Link href={`/about/${member.slug}`}>
                  <Image
                    src={member.avatar || ''}
                    alt={member.name || ''}
                    width={120}
                    height={120}
                    className="h-36 w-36 rounded-full"
                  />
                </Link>
              </div>
            ))}
          </div>
          <div></div>
        </div>
      </div>

      <div className="mt-6">
        <hr className="border-t-2 border-primary-200 dark:border-primary-900" />
        <div className="items-start space-y-2 pb-8 pt-6 md:space-y-5 xl:grid xl:grid-cols-3 xl:gap-x-8">
          {/* <h1 className="text-3xl font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 xl:col-span-2"> */}
          <h2 className="text-3xl font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl sm:leading-10 md:text-5xl md:leading-14">
            Advisors
          </h2>
          <div></div>
        </div>

        <Volunteers />
      </div>
    </>
  )
}
