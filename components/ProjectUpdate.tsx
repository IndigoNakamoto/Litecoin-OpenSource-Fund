// components/ProjectUpdate.tsx
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import Link from '@/components/Link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronUp } from '@fortawesome/free-solid-svg-icons'

interface ProjectUpdateProps {
  title: string
  date: string
  content?: string // Make content property optional
  tags: string[]
  summary: string
  authorTwitterHandle: string
  id: number
}

const ProjectUpdate: React.FC<ProjectUpdateProps> = ({
  title,
  date,
  content,
  summary,
  id,
  tags = [],
  authorTwitterHandle,
}) => {
  // State to track whether the content is shown or hidden
  const [showContent, setShowContent] = useState(false)

  // CSS class for the thicker border
  const thickerBorderClass = showContent ? 'border-blue-400 border-1 ' : ''

  return (
    <div
      className={`my-8 rounded-lg border border-gray-300 bg-gray-200 p-4 dark:border-gray-600 dark:bg-gray-900 ${thickerBorderClass}`}
    >
      <h6 className="text-sm text-gray-500">{`UPDATE #${id}`}</h6>
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
            className="flex items-center text-blue-500 hover:underline"
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
