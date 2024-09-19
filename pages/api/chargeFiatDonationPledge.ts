// pages/api/chargeFiatDonationPledge.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import prisma from '../../lib/prisma' // Import your Prisma client
import { getAccessToken } from '../../utils/authTGB'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { pledgeId, cardToken, amount } = req.body

  // Basic validation
  if (!pledgeId || !cardToken) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const accessToken = await getAccessToken()

    // Charge the pledge via The Giving Block's API
    const chargeResponse = await axios.post(
      'https://public-api.tgbwidget.com/v1/donation/fiat/charge',
      {
        pledgeId,
        cardToken,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const { success } = chargeResponse.data.data

    // Update the donation record in Prisma with success status
    await prisma.donation.update({
      where: { pledgeId },
      data: {
        success: success || false,
      },
    })

    // Return success response to the frontend
    return res.status(200).json({ success })
  } catch (error: any) {
    console.error(
      'Error charging fiat donation pledge:',
      error.message || error.response?.data
    )

    // Update the donation record to reflect failure if necessary
    await prisma.donation.update({
      where: { pledgeId },
      data: {
        success: false,
      },
    })

    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
