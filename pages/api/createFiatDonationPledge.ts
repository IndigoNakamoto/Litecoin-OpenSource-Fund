// pages/api/createFiatDonationPledge.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import prisma from '../../lib/prisma' // Import your Prisma client
import { getAccessToken } from '../../utils/authTGB'

type Data =
  | {
      pledgeId: string
    }
  | {
      error: string
    }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const {
    // Project details
    organizationId,
    projectSlug,
    // Donation details
    pledgeCurrency,
    pledgeAmount,
    // Donor information
    receiptEmail,
    firstName,
    lastName,
    // Donor address details
    addressLine1,
    addressLine2,
    country,
    state,
    city,
    zipcode,
    // Donor settings
    taxReceipt,
    isAnonymous,
    joinMailingList,
    // Donor social profiles
    socialX,
    socialFacebook,
    socialLinkedIn,
  } = req.body

  // Basic validation
  if (!organizationId || !pledgeCurrency || !pledgeAmount) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const accessToken = await getAccessToken()

    // Start a transaction to ensure atomicity
    const result = await prisma.$transaction(async (prisma) => {
      // Step 1: Create a new Donation record in Prisma without pledgeId initially
      const donation = await prisma.donation.create({
        data: {
          // Project information
          projectSlug,
          organizationId: organizationId || null,
          // Donation details
          donationType: 'fiat',
          assetSymbol: pledgeCurrency,
          pledgeAmount: parseFloat(pledgeAmount),
          // Donor information
          firstName: firstName || null,
          lastName: lastName || null,
          donorEmail: receiptEmail || null,
          // Donor settings
          isAnonymous: isAnonymous || false,
          taxReceipt: taxReceipt || false,
          joinMailingList: joinMailingList || false,
          // Donor social profiles
          socialX: socialX || null,
          socialFacebook: socialFacebook || null,
          socialLinkedIn: socialLinkedIn || null,
        },
      })

      // Step 2: Call The Giving Block's CreateFiatDonationPledge API
      const tgbResponse = await axios.post(
        'https://public-api.tgbwidget.com/v1/donation/fiat',
        {
          organizationId: organizationId.toString(),
          isAnonymous: isAnonymous,
          pledgeAmount: pledgeAmount.toString(),
          firstName: firstName || '',
          lastName: lastName || '',
          receiptEmail: receiptEmail || '',
          addressLine1: addressLine1 || '',
          addressLine2: addressLine2 || '',
          country: country || '',
          state: state || '',
          city: city || '',
          zipcode: zipcode || '',
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const { pledgeId } = tgbResponse.data.data

      // Step 3: Update the Donation record with the returned pledgeId
      await prisma.donation.update({
        where: { id: donation.id },
        data: {
          pledgeId: pledgeId,
        },
      })

      // Return the pledgeId to the frontend
      return { pledgeId }
    })

    return res.status(200).json(result)
  } catch (error: any) {
    console.error(
      'Error creating fiat donation pledge:',
      error.message || error.response?.data
    )
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
