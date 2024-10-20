import React from 'react'
import Image from 'next/image'
import { customImageLoader } from '../utils/customImageLoader'
import TypingScroll from './TypingScroll'
import Link from './Link'

// Assuming you have images in the /public/static/images/projects/completed/ directory
const imageDirectory = '/static/images/projects/completed/'
const images = [
  // List your images with descriptive alt text for SEO
  { title: 'Litecoin Core', src: 'core.png', href: '/projects-new/core' },
  {
    title: 'Litecoin Space',
    src: 'litecoin-space.jpeg',
    href: '/projects-new/litecoin_space_mempool',
  },
  {
    title: 'Ordinals Lite',
    src: 'OrdinalsLite3.png',
    href: '/projects-new/ordinals_lite',
  },
  { title: 'MWEB', src: 'MWEB.webp', href: '/projects-new/mweb' },
  {
    title: 'Litecoin Dev Kit',
    src: 'ldk.png',
    href: '/projects-new/litecoin_dev_kit',
  },
  {
    title: 'Litescribe',
    src: 'litescribe3.png',
    href: '/projects-new/litescribe',
  },
  {
    title: 'Litewallet',
    src: 'litewallet.png',
    href: '/projects-new/litewallet',
  },
  {
    title: 'Electrum-LTC',
    src: 'electrum.png',
    href: '/projects-new/electrum',
  },
  {
    title: 'Stackwallet',
    src: 'stackwallet.png',
    href: '/projects-new/stackwallet',
  },
]

function CompletedProjects() {
  return (
    <section className="flex flex-col pt-16 font-space-grotesk text-gray-800">
      <div className="mx-auto flex flex-col items-center text-center">
        <h2 className="text-5xl font-semibold tracking-tight text-gray-800 lg:text-7xl">
          We Help Advance
        </h2>
        <h3 className="text-3xl font-semibold text-gray-800 lg:text-4xl">
          <TypingScroll />
        </h3>
        <p className="pt-2 text-2xl text-gray-600 ">
          Unite. Fund. Innovate. - The Litecoin Development Portal
        </p>
        {/* Removed the existing "View All Projects" button */}
      </div>

      <div className="grid grid-cols-2 gap-4 pb-32 pt-16 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {images.map((image) => (
          <div key={image.title} className="relative h-48">
            <Link
              href={image.href}
              aria-label={`Read more about ${image.title}`}
            >
              <div className="image-wrapper relative h-full w-full overflow-hidden">
                <Image
                  loader={customImageLoader}
                  alt={`Image of ${image.title}`}
                  src={`${imageDirectory}${image.src}`}
                  className="rounded-xl transition duration-300"
                  fill
                  sizes="100vw"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
                <h4 className="image-title absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-0 text-2xl font-semibold text-white opacity-0 transition-opacity duration-300 ease-in-out hover:bg-opacity-50 hover:opacity-100 hover:backdrop-blur-xl ">
                  {image.title}
                </h4>
              </div>
            </Link>
          </div>
        ))}

        {/* New grid item for "View All Projects" button */}
        <div className="relative flex h-48 items-center justify-center rounded-xl bg-[#222222] text-white transition duration-300 hover:bg-opacity-75">
          <Link href="/projects-new" aria-label="View All Projects">
            <span className="text-2xl font-semibold">View All Projects</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CompletedProjects
