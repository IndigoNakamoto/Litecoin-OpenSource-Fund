import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Typing from './Typing'
import TypingScroll from './TypingScroll'
import Link from './Link'

// Assuming you have images in the /public/static/images/projects/completed/ directory
const imageDirectory = '/static/images/projects/completed/'
const images = [
  // You should list your images here
  { title: 'Image 1', src: 'core.png' },
  { title: 'Image 2', src: 'litecoin-space.jpeg' },
  { title: 'Image 3', src: 'OrdinalsLite3.png' },

  // ...other images
]

function CompletedProjects() {
  return (
    <div className="flex flex-col p-6 text-gray-800">
      <div className="mx-auto flex flex-col items-center">
        <h1 className="mb-2 text-4xl font-semibold text-gray-800 dark:text-white">
          We help advance
        </h1>
        <h1 className="text-4xl font-semibold text-gray-800">
          <TypingScroll />
        </h1>
        <p className="text-xl text-gray-800 dark:text-white">
          Crowdfunding Litecoin Projects, One Bounty at a Time.
        </p>
        <button className="mb-10 mt-8 w-40 rounded-full bg-blue-500 px-4 py-2 font-semibold ">
          <Link href="/missions"> Explore More</Link>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {images.map((image) => (
          <div key={image.title} className="relative h-48">
            <h2 className="mb-4 text-2xl font-semibold">{image.title}</h2>
            <Image
              alt={image.title}
              src={`${imageDirectory}${image?.src}`}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              className="rounded-xl"
              priority
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompletedProjects
