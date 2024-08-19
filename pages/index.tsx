import { InferGetStaticPropsType } from 'next'
import Image from 'next/legacy/image'
import { PageSEO } from '@/components/SEO'
import CompletedProjects from '@/components/CompletedProjects'
import Link from 'next/link'

const FULL_SCREEN_IMAGE = '/static/images/lite-space-bg.jpg'
const COIN = '/litecoin-svg/L-white.png'

export const getStaticProps = async () => {
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
        description="Crowdfunding Litecoin Projects, One Open-Source Project at a Time."
      />
      {/* background image*/}
      <div className="absolute inset-x-0 top-[6rem] z-0 bg-black">
        <div style={{ position: 'relative', height: '89vh' }}>
          <Image
            src={FULL_SCREEN_IMAGE}
            alt="Mission - Promote the adoption, education & development of Litecoin (LTC)"
            layout="fill"
            objectFit="cover"
          />
          <div className="z-1 relative inset-x-0 flex flex-col items-center justify-center">
            {/* Litecoin logo */}
            <div className="mt-32 w-32 md:w-60 xl:w-80 short:w-20 medium:w-36">
              <Image
                src={COIN}
                alt="Litecoin Logo"
                width={300}
                height={300}
                objectFit="cover"
              />
            </div>
            {/* Litecoin mission statement */}
            <div className="container p-4 sm:mt-10 md:mt-24">
              <h1 className="text-center text-3xl font-semibold tracking-tight text-gray-100 md:text-4xl lg:text-5xl">
                Lite.Space
              </h1>
              <h2 className="mb-4 text-center text-xl leading-normal text-gray-100 md:text-2xl lg:text-3xl">
                Our portal to bring together developers and community members to
                accelerate ideas and development in the Litecoin ecosystem.
                Crowdfunding Litecoin Projects, One Open-Source Project at a
                Time.
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="z-1 mt-[calc(90vh)] pb-32">
        <CompletedProjects />
      </div>
      {/* Apply for Funding section */}
      <div className="mb-20 divide-y divide-gray-200 rounded-2xl bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-500 to-blue-300 p-4 pb-10 pt-10 dark:divide-gray-700">
        <div className="space-y-2 pb-8 md:space-y-5">
          <h1 className="text-5xl font-semibold tracking-tight text-white lg:text-7xl">
            Apply for Funding
          </h1>
          <p className="py-4 text-xl leading-7 text-[#222222] ">
            We are looking to support talented individuals and teams who share
            our commitment to decentralized open-source solutions and the future
            of Litecoin.
          </p>
          <Link href="/apply">
            <button className="w-48 rounded-full bg-white py-2 font-semibold text-blue-500 transition duration-300 hover:bg-gray-200">
              Apply for Funding
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}
