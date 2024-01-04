import React from 'react'
import Image from 'next/legacy/image'
import TypingScroll from './TypingScroll'
import Link from './Link'

// Assuming you have images in the /public/static/images/projects/completed/ directory
const imageDirectory = '/static/images/projects/completed/'
const images = [
  // List your images with descriptive alt text for SEO
  { title: 'Litecoin Core', src: 'core.png', href: '/missions/core' },
  {
    title: 'Litecoin Space',
    src: 'litecoin-space.jpeg',
    href: '/missions/litecoin_space_mempool',
  },
  {
    title: 'Ordinals Lite',
    src: 'OrdinalsLite3.png',
    href: '/missions/ordinals_lite',
  },
  { title: 'MWEB', src: 'MWEB.webp', href: '/missions/mweb' },
  {
    title: 'Litecoin Dev Kit',
    src: 'ldk.png',
    href: '/missions/litecoin_dev_kit',
  },
  { title: 'Omni Lite', src: 'omnilite3.png', href: '/missions/omnilite' },
  { title: 'Litescribe', src: 'litescribe3.png', href: '/missions/litescribe' },
  {
    title: 'Litewallet',
    src: 'litewallet.png',
    href: '/missions/litewallet',
  },
  {
    title: 'Electrum-LTC',
    src: 'electrum.png',
    href: '/missions/electrum',
  },
  {
    title: 'Stackwallet',
    src: 'stackwallet.png',
    href: '/missions/stackwallet',
  },
]

function CompletedProjects() {
  return (
    <section className="flex flex-col pt-40 text-gray-800">
      <div className="mx-auto flex flex-col items-center text-center">
        <h2 className="text-5xl font-semibold tracking-tight text-gray-800 dark:text-white lg:text-7xl">
          We Help Advance
        </h2>
        <h3 className="text-3xl font-semibold text-gray-800 lg:text-4xl">
          <TypingScroll />
        </h3>
        <p className="pt-2 text-2xl text-gray-600 dark:text-gray-400">
          Unite. Fund. Innovate. - The Litecoin Development Portal
        </p>
        <Link
          href="/missions"
          className="mb-10 mt-8 w-40 rounded-full bg-blue-500 px-9 py-2 font-semibold text-white transition duration-300 hover:bg-blue-400"
        >
          Explore More
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {images.map((image) => (
          <div key={image.title} className="relative h-48">
            <Link
              href={image.href}
              aria-label={`Read more about ${image.title}`}
            >
              <div className="image-wrapper relative h-full w-full overflow-hidden">
                <Image
                  alt={`Image of ${image.title}`}
                  src={`${imageDirectory}${image.src}`}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  className="rounded-xl transition duration-300"
                />
                <h4 className="image-title absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-0 text-2xl font-semibold text-white opacity-0 transition-opacity duration-300 ease-in-out hover:bg-opacity-50 hover:opacity-100 hover:backdrop-blur-xl ">
                  {image.title}
                </h4>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CompletedProjects
