import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Typing from './Typing'
import TypingScroll from './TypingScroll'
import Link from './Link'

// Assuming you have images in the /public/static/images/projects/completed/ directory
const imageDirectory = '/static/images/projects/completed/'
const images = [
  // You should list your images here
  { title: 'Litecoin Core', src: 'core.png', href: '/missions/core' },
  {
    title: 'Litecoin Space',
    src: 'litecoin-space.jpeg',
    href: '/missions/mempool',
  },
  {
    title: 'Ordinals Lite',
    src: 'OrdinalsLite3.png',
    href: '/missions/OrdinalsLite',
  },

  // ...other images
]

function CompletedProjects() {
  return (
    <div className="flex flex-col pb-20 pt-40  text-gray-800">
      <div className="mx-auto flex flex-col items-center">
        <h1 className="text-5xl font-semibold tracking-tight text-gray-800 dark:text-white md:text-4xl lg:text-7xl">
          We Help Advance
        </h1>
        <h1 className="text-4xl font-semibold text-gray-800">
          <TypingScroll />
        </h1>
        <p className="pt-2 text-2xl text-gray-600 dark:text-gray-400">
          Unite. Fund. Innovate. - The Litecoin Development Portal
        </p>
        <button className="mb-10 mt-8 w-40 rounded-full bg-blue-500 px-4 py-2 font-semibold hover:bg-blue-400 ">
          <Link href="/missions"> Explore More</Link>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {images.map((image) => (
          <div key={image.title} className="relative h-48">
            <Link href={image.href}>
              <div className="image-wrapper relative h-full w-full overflow-hidden">
                <Image
                  alt={image.title}
                  src={`${imageDirectory}${image.src}`}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  className="transform rounded-xl transition duration-500 ease-in-out hover:scale-105"
                />

                <h2 className="image-title absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-0 text-4xl font-semibold text-white opacity-0 transition-opacity duration-300 ease-in-out hover:bg-opacity-80 hover:opacity-100">
                  {image.title}
                </h2>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompletedProjects
