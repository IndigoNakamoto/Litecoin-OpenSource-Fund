/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// components/ProjectUpdate.tsx
import React, { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import Link from '@/components/Link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronUp } from '@fortawesome/free-solid-svg-icons'

interface ProjectUpdateProps {
  title: string
  date: string
  content?: string
  tags: string[]
  summary: string
  authorTwitterHandle: string
  id: number
  highlight?: boolean
}

const ProjectUpdate: React.FC<ProjectUpdateProps> = ({
  title,
  date,
  content,
  summary,
  id,
  tags = [],
  authorTwitterHandle,
  highlight = false,
}) => {
  const [showContent, setShowContent] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  // Use useRef to reference the component's DOM node
  const projectUpdateRef = useRef<HTMLDivElement>(null)

  const handleCopyLink = () => {
    const updateUrl = `${window.location.origin}${window.location.pathname}?updateId=${id}`
    navigator.clipboard
      .writeText(updateUrl)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      })
      .catch((err) => console.error('Failed to copy the link: ', err))
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleCopyLink()
    }
  }

  // Function to detect clicks outside the component
  const handleClickOutside = (event) => {
    if (
      projectUpdateRef.current &&
      !projectUpdateRef.current.contains(event.target)
    ) {
      // If the click is outside the component, set highlight to false
      // You might need to lift state up or use a context if highlight is a prop
      console.log('Click outside')
    }
  }

  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Remove event listener when the component unmounts
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const thickerBorderClass =
    showContent || highlight ? 'border-2 border-blue-200' : ''

  return (
    // Add ref to the div to reference it in handleClickOutside
    <div
      ref={projectUpdateRef}
      className={`my-8 rounded-lg border bg-white p-4 dark:border-gray-600 dark:bg-gray-900 ${thickerBorderClass}`}
    >
      <h6
        className="cursor-pointer text-sm text-gray-500"
        onClick={handleCopyLink}
        tabIndex="0"
        onKeyDown={handleKeyPress}
      >
        {isCopied ? 'Copied!' : `UPDATE #${id}`}{' '}
        {/* Conditionally render text based on isCopied */}
      </h6>
      <h2 className="text-xl font-semibold">{title}</h2>
      <Link
        className="mt-0"
        href={`https://www.twitter.com/${authorTwitterHandle}`}
      >
        <h6 className="mt-0">{`@${authorTwitterHandle}`}</h6>
      </Link>
      <h6 className="mb-4 text-gray-600 dark:text-gray-500">{date}</h6>
      <hr className="my-4 border-t border-gray-300 dark:border-gray-700" />
      <div className="content">
        {summary && <ReactMarkdown>{summary}</ReactMarkdown>}
        {showContent && content && (
          <>
            <hr className="my-4 border-t border-gray-300 dark:border-gray-700" />
            <ReactMarkdown>{content}</ReactMarkdown>
          </>
        )}
      </div>
      <div className="flex flex-wrap">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="mb-2 mr-2 rounded-full bg-blue-200 px-2 py-1 text-sm text-blue-800"
          >
            {tag}
          </span>
        ))}
      </div>
      {/* Implement: Move button to the right. Add boarder style to button rounded-xl with a chevron pointed to the right with read more and a chevron pointed up with Read less. */}
      <div className="mt-4 flex justify-end">
        {content && (
          <button
            className="flex items-center text-blue-500 hover:underline dark:text-white dark:hover:text-blue-300"
            onClick={() => setShowContent(!showContent)}
          >
            {showContent ? (
              <>
                Read Less{' '}
                <FontAwesomeIcon icon={faChevronUp} className="ml-2" />
              </>
            ) : (
              <>
                Read More{' '}
                <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default ProjectUpdate
