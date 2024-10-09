import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'
import { getMatchingDonorsByProjectSlug } from '../../utils/webflow' // Adjust the path to your utility file

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { slug } = req.query

    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ error: 'Project slug is required' })
    }

    // Fetch the matching donors for the project and type as any[]
    const donors: any[] = await getMatchingDonorsByProjectSlug(slug)

    // For each donor, fetch the total matched amount for the project
    const donorsWithMatchedAmounts = await Promise.all(
      donors.map(async (donor: any) => {
        const donorId = donor.id

        // Fetch the total matched amount for this donor and project
        const totalMatched = await prisma.matchingDonationLog.aggregate({
          where: {
            donorId,
            projectSlug: slug,
          },
          _sum: {
            matchedAmount: true,
          },
        })

        const totalMatchedAmount = totalMatched._sum.matchedAmount || 0

        // Return the donor's field data along with the total matched amount
        return {
          donorId,
          donorFieldData: donor.fieldData,
          totalMatchedAmount,
        }
      })
    )

    res.status(200).json(donorsWithMatchedAmounts)
  } catch (error) {
    console.error('Error fetching matching donors by project slug:', error)
    res.status(500).json({ error: 'Failed to fetch matching donors' })
  }
}
