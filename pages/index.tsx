import { InferGetStaticPropsType } from 'next'
import { allPages } from 'contentlayer/generated'
import Image from 'next/image'
import { PageSEO } from '@/components/SEO'
import CompletedProjects from '@/components/CompletedProjects'
import CustomLink from '@/components/Link'
import Link from 'next/link'

// const DEFAULT_LAYOUT = 'ListLayout'
const FULL_SCREEN_IMAGE = '/static/images/lite-space-bg.jpg'
const COIN = '/litecoin-svg/L-white.png'

export const getStaticProps = async () => {
  // const page = allPages.find((p) => p.slug === 'mission')
  const page = true
  return { props: { page: page } }
}

export default function Mission({
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!page) {
    return <div>Error: Mission page content not found.</div>
  }

  return (
    <>
      <PageSEO
        title={`Lite.Space`}
        description="Crowdfunding Litecoin Projects, One Bounty at a Time."
      />
      {/* background image*/}
      <div className="absolute inset-x-0 top-[6rem] z-0 bg-black ">
        {' '}
        {/* Adjusted top value here */}
        <div style={{ position: 'relative', height: '89vh' }}>
          <Image
            src={FULL_SCREEN_IMAGE}
            alt="Mission - Promote the adoption, education & development of Litecoin (LTC)"
            layout="fill"
            objectFit="cover"
          />
          <div className="z-1 relative inset-x-0 flex flex-col items-center justify-center ">
            {/* Litecoin logo */}
            <Image
              src={COIN}
              alt=""
              width={300}
              height={300}
              objectFit="cover"
              className="mt-32 w-32 md:w-60 xl:w-80 short:w-20 medium:w-36"
            />
            {/* Litecoin mission statement */}
            <div className="container sm:mt-10 md:mt-24">
              <h1 className="text-center text-3xl font-semibold tracking-tight text-gray-100 md:text-4xl lg:text-5xl xl:col-span-2">
                Lite.Space
              </h1>
              <h2 className="mb-4 text-center text-xl leading-normal text-gray-100 md:text-2xl lg:text-3xl">
                Our portal to bring together developers and community members to
                accelerate ideas and development in the Litecoin ecosystem.
                Crowdfunding Litecoin projects, one bounty at a time.
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="z-1 mt-[calc(90vh)] pb-32">
        <CompletedProjects />
      </div>
      {/* Apply for Funding section */}
      <div className="mb-20 divide-y divide-gray-200 rounded-2xl bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white to-gray-50 p-4 pb-10 pt-10 dark:divide-gray-700 dark:from-gray-900 dark:to-gray-800">
        <div className="space-y-2 pb-8 md:space-y-5 ">
          <h1 className="text-5xl font-semibold tracking-tight text-gray-800 dark:text-white md:text-4xl lg:text-7xl">
            Apply for Funding
          </h1>
          <p className="py-4 text-2xl leading-7 text-gray-600 dark:text-gray-400">
            We are looking to support talented individuals and teams who share
            our commitment to decentralized open-source solutions and the future
            of Litecoin.
          </p>
          <button className="w-48 rounded-full bg-blue-500 py-2 font-semibold hover:bg-blue-400 ">
            <Link href="/apply">Apply for Funding</Link>
          </button>
        </div>
      </div>
    </>
  )
}
