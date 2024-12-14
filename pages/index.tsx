import { InferGetStaticPropsType } from 'next'
import Image from 'next/legacy/image'
import { PageSEO } from '@/components/SEO'
import Link from 'next/link'

const FULL_SCREEN_IMAGE = '/static/images/lite-space-bg.jpg'
const COIN = '/litecoin-svg/L-white.png'

export const getStaticProps = async () => {
  const page = true
  return { props: { page } }
}

export default function RedirectPage({
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!page) {
    return <div>Error: Redirect page content not found.</div>
  }

  return (
    <>
      <PageSEO
        title="We've Moved to Litecoin.com/Projects"
        description="Lite.space has moved to litecoin.com/projects. Thank you to all our supporters, donors, and contributors."
      />
      <div
        className="relative flex min-h-screen flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${FULL_SCREEN_IMAGE})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center px-4 text-center">
          <Image src={COIN} alt="Litecoin Logo" width={100} height={100} />
          <h1 className="mt-4 text-5xl font-extrabold text-white md:text-7xl">
            We've Moved!
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-gray-200">
            Thank you to all our supporters, donors, and contributors!
          </p>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            Lite.space has officially transitioned to{' '}
            <Link
              href="https://litecoin.com/projects"
              className="text-blue-400 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              litecoin.com/projects
            </Link>
            .
          </p>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            Lite.space was a crowdfunding platform dedicated to funding
            open-source Litecoin development. Together, we've supported
            innovation, empowered developers, and helped grow the Litecoin
            ecosystem. Your contributions have made a lasting impact.
          </p>
          <Link
            href="https://litecoin.com/projects"
            className="mt-8 inline-block rounded bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Litecoin Projects
          </Link>
          <p className="mt-6 text-sm text-gray-400">
            If you have any questions, feel free to reach out to our support
            team.
          </p>
        </div>
      </div>
    </>
  )
}
