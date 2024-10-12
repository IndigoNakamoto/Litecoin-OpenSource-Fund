import type { NextApiRequest, NextApiResponse } from 'next'
import { getMatchingDonorsByProjectSlug } from '../../utils/webflow'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { slug } = req.query

    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ error: 'Project slug is required' })
    }

    // Fetch the matching donors for the project
    const donorsWithMatchedAmounts = await getMatchingDonorsByProjectSlug(slug)

    res.status(200).json(donorsWithMatchedAmounts)
  } catch (error) {
    console.error('Error fetching matching donors by project slug:', error)
    res.status(500).json({ error: 'Failed to fetch matching donors' })
  }
}
