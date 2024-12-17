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
  { title: 'Litecoin Core', src: 'core.png', href: '/projects/core' },
  {
    title: 'Litecoin Space',
    src: 'litecoin-space.jpeg',
    href: '/projects/litecoin_space_mempool',
  },
  {
    title: 'Ordinals Lite',
    src: 'OrdinalsLite3.png',
    href: '/projects/ordinals_lite',
  },
  { title: 'MWEB', src: 'MWEB.webp', href: '/projects/mweb' },
  {
    title: 'Litecoin Dev Kit',
    src: 'ldk.png',
    href: '/projects/litecoin_dev_kit',
  },
  {
    title: 'Litescribe',
    src: 'litescribe3.png',
    href: '/projects/litescribe',
  },
  {
    title: 'Litewallet',
    src: 'litewallet.png',
    href: '/projects/litewallet',
  },
  {
    title: 'Electrum-LTC',
    src: 'electrum.png',
    href: '/projects/electrum',
  },
  {
    title: 'Stackwallet',
    src: 'stackwallet.png',
    href: '/projects/stackwallet',
  },
]

function CompletedProjects() {
  return (
    <section className="flex flex-col pb-10 pt-16 font-space-grotesk text-gray-800">
      <div className="flex flex-col items-center pb-8  pt-4 text-center">
        <h1 className="font-space-grotesk text-[39px] font-[600] text-[black]">
          The Litecoin Project Development Portal
        </h1>
        <h2 className="pt-2 font-space-grotesk text-[30px] font-[600] text-[black]">
          We help advance
        </h2>
        <h3 className="font-space-grotesk text-[20px] font-semibold text-[black]">
          <TypingScroll />
        </h3>
      </div>

      <SectionDonors />
    </section>
  )
}

export default CompletedProjects
