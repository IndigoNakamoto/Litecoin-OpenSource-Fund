import React, { useState, useEffect } from 'react'
import DOMPurify from 'dompurify'

type ProjectProps = {
  slug: string
}

const ProjectRichTextRenderer: React.FC<ProjectProps> = ({ slug }) => {
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Fetch project data from the serverless API route
        const response = await fetch(`/api/webflow/project?slug=${slug}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log('data: ', data.project.fieldData)

        // Check if 'content-rich' exists
        if (data.project && data.project.fieldData['content-rich']) {
          // Assuming 'content-rich' is already in HTML format
          const richContent = data.project.fieldData['content-rich']

          // Optional: Replace escaped newlines (\\n) with actual newlines if necessary
          // This depends on how the rich text is stored. If it's already proper HTML, this step might not be needed.

          // Sanitize the HTML to prevent XSS attacks
          const sanitizedHtml = DOMPurify.sanitize(richContent)

          setContent(sanitizedHtml)
        } else {
          setContent('No content available')
        }
      } catch (error: any) {
        console.error('Error fetching project data:', error)
        setError('Failed to load content. Please try again later.')
      }
    }

    fetchProjectData()
  }, [slug])

  if (error) {
    return <p className="error">{error}</p>
  }

  if (!content) {
    return <p>Loading...</p>
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: content }} className="markdown" />
  )
}

export default ProjectRichTextRenderer
