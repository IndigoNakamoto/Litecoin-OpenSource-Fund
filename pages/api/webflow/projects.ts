// /pages/api/webflow/projects.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllProjects } from '../../../utils/webflow'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Fetch projects
    const projects = await getAllProjects()

    // Respond with the projects data
    res.status(200).json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
}
