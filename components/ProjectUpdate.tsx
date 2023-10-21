// components/ProjectUpdate.tsx
import React from 'react'
import ReactMarkdown from 'react-markdown'

interface ProjectUpdateProps {
  title: string
  date: string
  content?: string // Make content property optional
  tags: string[]
}

const ProjectUpdate: React.FC<ProjectUpdateProps> = ({
  title,
  date,
  content,
  tags = [],
}) => {
  return (
    <div className="mb-4 rounded-md bg-white p-4 shadow-md">
      <h2 className="mb-2 text-xl font-semibold">{title}</h2>
      <p className="mb-2 text-gray-600">{date}</p>
      {content && <ReactMarkdown>{content}</ReactMarkdown>}
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
    </div>
  )
}

export default ProjectUpdate
