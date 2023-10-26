// components/WebsiteBookmark.js

import { useEffect, useState } from 'react'
import { fetchMetadata } from '../utils/fetchMetadata'

export default function WebsiteBookmark({ website }) {
  const [metadata, setMetadata] = useState(null)

  useEffect(() => {
    fetchMetadata(website)
      .then((html) => {
        // Parse the HTML content to extract the metadata in the <head> section
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')

        const metadataTags = doc.head.querySelectorAll('meta')
        const metadataObject = {}

        metadataTags.forEach((tag) => {
          const name = tag.getAttribute('name')
          const property = tag.getAttribute('property')
          const content = tag.getAttribute('content')

          if (name) {
            metadataObject[name] = content
          } else if (property) {
            metadataObject[property] = content
          }
        })

        setMetadata(metadataObject)
      })
      .catch((error) => {
        console.error('Error fetching metadata:', error)
      })
  }, [website])

  return (
    <div>
      <h3>{metadata?.title}</h3>
      <p>{metadata?.description}</p>
      {/* Display other metadata properties as needed */}
    </div>
  )
}
