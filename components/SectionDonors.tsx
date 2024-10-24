import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from './Link'
import Head from 'next/head'

type Donor = {
  isAnonymous: boolean
  firstName?: string
  lastName?: string
  socialX?: string
  socialFacebook?: string
  socialLinkedIn?: string
}

function extractTwitterUsername(url: string): string | null {
  if (!url) return null

  url = url.trim()

  if (url.startsWith('@')) {
    return url.substring(1)
  }

  if (
    url.startsWith('twitter.com') ||
    url.startsWith('www.twitter.com') ||
    url.startsWith('x.com') ||
    url.startsWith('www.x.com')
  ) {
    url = 'https://' + url
  }

  if (!url.includes('/') && !url.includes(' ')) {
    return url
  }

  try {
    const parsedUrl = new URL(url.startsWith('http') ? url : 'https://' + url)
    const hostname = parsedUrl.hostname.toLowerCase()
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      const pathname = parsedUrl.pathname
      const parts = pathname.split('/')
      for (const part of parts) {
        if (part) return part
      }
    }
  } catch (e) {
    return null
  }

  return null
}

const SectionDonors: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch('/api/getProcessedDonations')
        const data = await response.json()
        setDonors(data)
      } catch (error) {
        console.error('Error fetching donors:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDonors()
  }, [])

  if (loading) {
    return <div>Loading donors...</div>
  }

  // Use a Set to track unique images
  const uniqueUsernames = new Set<string>()

  return (
    <div className="m-auto flex h-full w-full max-w-[1300px] flex-col items-center justify-center p-10">
      {/* <h1 className="m-8 font-space-grotesk text-4xl font-semibold leading-[32px] tracking-wide">
        Donors
      </h1> */}
      <div className="contributors-list grid w-full grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {donors.map((donor, index) => {
          const username = extractTwitterUsername(donor.socialX || '')
          if (!username || uniqueUsernames.has(username)) {
            return null // Skip duplicates
          }

          uniqueUsernames.add(username)

          const imageUrl = username
            ? `https://unavatar.io/twitter/${username}`
            : '/images/design/chikun.jpeg'

          const profileLink = username ? `https://x.com/${username}` : '#'

          return (
            <div
              className="group relative flex aspect-square transform items-center justify-center overflow-hidden transition-transform duration-300 focus:outline-none group-hover:scale-105 "
              key={index}
            >
              {index < 3 && (
                <Head>
                  <link rel="preload" as="image" href={imageUrl} />
                </Head>
              )}
              <Link href={profileLink} className="">
                <Image
                  src={imageUrl}
                  alt={username || 'Default avatar'}
                  className="h-full w-full transform rounded-full object-cover p-1 transition-transform duration-300 group-hover:scale-105"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SectionDonors
