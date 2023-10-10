import { InferGetStaticPropsType } from 'next'
import { allPages } from 'contentlayer/generated'
import Image from 'next/image'

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
      {/* background */}
      <div className="bottom-30 absolute inset-x-0 bottom-32 top-24 z-0">
        <Image
          src={FULL_SCREEN_IMAGE}
          alt="Mission - Promote the adoption, education & development of Litecoin (LTC)"
          layout="fill"
          objectFit="cover"
        />
      </div>
      {/* Content */}
      <div className="z-1 sm:1/4 relative inset-x-0 bottom-0 top-1/2 flex flex-col items-center justify-center">
        <Image
          src={COIN}
          alt=""
          width={300}
          height={300}
          objectFit="cover"
          className="mb-10 w-1/4"
        />
        <div className="container mt-10">
          <h1 className="text-center text-3xl font-semibold tracking-tight text-gray-100 md:text-4xl lg:text-5xl xl:col-span-2">
            Mission
          </h1>
          <h2 className="mb-4 text-center text-xl font-light leading-normal text-gray-100 md:text-2xl lg:text-3xl">
            Empowering individuals and communities globally by advocating for
            and advancing Litecoin (LTC) through fostering adoption, education,
            and development, all toward building a decentralized and inclusive
            financial future.
          </h2>
        </div>
      </div>
    </>
  )
}
