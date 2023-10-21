// components/ProjectUpdate.tsx
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import Link from '@/components/Link'

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
  const thickerBorderClass = showContent ? 'border-gray-200 border-2 ' : ''

  return (
    <div
      className={`my-4 rounded-md border border-gray-300 bg-gray-100 p-4 dark:bg-gray-800 ${thickerBorderClass}`}
    >
      <h6 className="text-sm text-gray-500">{`UPDATE #${id}`}</h6>
      <h2 className="mb-2 text-xl font-semibold">{title}</h2>
      {/* Turn into link that directs to twitter.com/AuthorTwitterHandle */}
      <Link href={`https://www.twitter.com/${authorTwitterHandle}`}>
        <h6 className="">{`@${authorTwitterHandle}`}</h6>
      </Link>
      <h6 className="mb-2 text-gray-600">{date}</h6>
      <div className="content">
        {summary && <ReactMarkdown>{summary}</ReactMarkdown>}
        {showContent && content && (
          <>
            <hr className="my-8 border-t border-gray-300" />
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
      <div className="flex justify-between">
        {content && (
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setShowContent(!showContent)}
          >
            {showContent ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>
    </div>
  )
}

export default ProjectUpdate
