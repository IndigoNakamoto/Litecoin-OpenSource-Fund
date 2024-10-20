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
    <div className="m-auto flex h-full w-full max-w-[1300px] flex-col items-center justify-center p-8 ">
      {/* <h1 className="m-8 font-space-grotesk text-4xl font-semibold leading-[32px] tracking-wide">
        Donors
      </h1> */}
      <div className="col-span-2 col-start-2 grid grid-cols-5 gap-x-4 space-y-2 md:grid-cols-6 md:gap-x-6 lg:grid-cols-8 xl:grid-cols-10">
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
              className="items-left flex flex-col space-x-1 pt-2"
              key={index}
            >
              {index < 3 && (
                <Head>
                  <link rel="preload" as="image" href={imageUrl} />
                </Head>
              )}
              <Link
                href={profileLink}
                className="transition-transform duration-200 ease-in-out hover:scale-105"
              >
                <Image
                  src={imageUrl}
                  alt={username || 'Default avatar'}
                  width={100}
                  height={100}
                  className="rounded-full"
                  loading="lazy"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
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
