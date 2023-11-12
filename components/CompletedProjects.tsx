import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Typing from './Typing'
import TypingScroll from './TypingScroll'
import Link from './Link'

// Assuming you have images in the /public/static/images/projects/completed/ directory
const imageDirectory = '/static/images/projects/completed/'
const images = [
  // You should list your images here
  { title: 'Litecoin Core', src: 'core.png' },
  { title: 'Litecoin Space', src: 'litecoin-space.jpeg' },
  { title: 'Ordinals Lite', src: 'OrdinalsLite3.png' },

  // ...other images
]

function CompletedProjects() {
  return (
    <div className="flex flex-col p-6 text-gray-800">
      <div className="mx-auto flex flex-col items-center">
        <h1 className="mb-2 text-5xl font-semibold text-gray-800 dark:text-white">
          We Help Advance
        </h1>
        <h1 className="text-4xl font-semibold text-gray-800">
          <TypingScroll />
        </h1>
        <p className="pt-2 text-xl text-gray-800 dark:text-white">
          Unite. Fund. Innovate. - The Litecoin Development Portal
        </p>
        <button className="mb-10 mt-8 w-40 rounded-full bg-blue-500 px-4 py-2 font-semibold ">
          <Link href="/missions"> Explore More</Link>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {images.map((image) => (
          <div key={image.title} className="relative h-48">
            <div className="image-wrapper relative h-full w-full overflow-hidden">
              <Image
                alt={image.title}
                src={`${imageDirectory}${image.src}`}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                className="transform rounded-xl transition duration-500 ease-in-out hover:scale-105"
              />

              <h2 className="image-title absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-0 text-4xl font-semibold text-white opacity-0 transition-opacity duration-300 ease-in-out hover:bg-opacity-70 hover:opacity-100">
                {image.title}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompletedProjects
