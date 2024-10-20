import React from 'react'
import Image from 'next/image'
import { customImageLoader } from '../utils/customImageLoader'
import TypingScroll from './TypingScroll'
import Link from './Link'
import SectionDonors from '@/components/SectionDonors'

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
    <section className="flex flex-col pb-10 pt-16 font-space-grotesk text-gray-800">
      <div className="mx-auto flex flex-col items-center text-center">
        <h2 className="text-5xl font-semibold tracking-tight text-gray-800 lg:text-7xl">
          We Help Advance
        </h2>
        <h3 className="text-3xl font-semibold text-gray-800 lg:text-4xl">
          <TypingScroll />
        </h3>
        <p className="pt-2 text-2xl text-gray-600 ">
          Unite. Fund. Innovate. - The Litecoin Community
        </p>
        {/* Removed the existing "View All Projects" button */}
      </div>

      <SectionDonors />
    </section>
  )
}

export default CompletedProjects
