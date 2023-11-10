import { InferGetStaticPropsType } from 'next'
import { allPages } from 'contentlayer/generated'
import Image from 'next/image'
import { PageSEO } from '@/components/SEO'

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
        description="Litespace: Crowdfunding Litecoin Projects, One Bounty at a Time."
      />
      {/* background image*/}
      <div className="absolute inset-x-0 bottom-32 top-24 z-0 bg-black p-8 xs:p-4">
        <Image
          src={FULL_SCREEN_IMAGE}
          alt="Mission - Promote the adoption, education & development of Litecoin (LTC)"
          layout="fill"
          objectFit="cover"
        />
        <div className="z-1 relative inset-x-0 mt-24 flex flex-col items-center justify-center 2xl:mt-28 3xl:mt-28 short:mt-12">
          {/* Litecoin logo */}
          <Image
            src={COIN}
            alt=""
            width={300}
            height={300}
            objectFit="cover"
            className="w-32 md:w-60 xl:w-80 short:w-20 medium:w-36"
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
      {/* Content */}
    </>
  )
}
