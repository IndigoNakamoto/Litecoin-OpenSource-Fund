// pages/api/createFiatDonationPledge.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import prisma from '../../lib/prisma'
import { getAccessToken } from '../../utils/authTGB'
import Decimal from 'decimal.js'

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

  // Validate required fields
  const missingFields: string[] = []
  if (!organizationId) missingFields.push('organizationId')
  if (!pledgeCurrency) missingFields.push('pledgeCurrency')
  if (!pledgeAmount) missingFields.push('pledgeAmount')
  if (!projectSlug) missingFields.push('projectSlug')

  // If donation is not anonymous, validate additional fields
  if (isAnonymous === false) {
    if (!firstName) missingFields.push('firstName')
    if (!lastName) missingFields.push('lastName')
    if (!addressLine1) missingFields.push('addressLine1')
    if (!country) missingFields.push('country')
    if (!state) missingFields.push('state')
    if (!city) missingFields.push('city')
    if (!zipcode) missingFields.push('zipcode')
  }

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ error: `Missing required fields: ${missingFields.join(', ')}` })
  }

  try {
    const accessToken = await getAccessToken()

    // Validate pledgeAmount
    const parsedPledgeAmount = new Decimal(pledgeAmount)
    if (parsedPledgeAmount.lte(0)) {
      throw new Error('Pledge amount must be greater than zero.')
    }

    // Create a new Donation record without pledgeId initially
    const donation = await prisma.donation.create({
      data: {
        // Project
        projectSlug: projectSlug,
        organizationId: organizationId,
        // Donation
        donationType: 'fiat',
        assetSymbol: pledgeCurrency,
        pledgeAmount: parsedPledgeAmount,
        // Donor Info
        firstName: firstName || null,
        lastName: lastName || null,
        donorEmail: receiptEmail || null,
        // Donor Settings
        isAnonymous: isAnonymous || false,
        taxReceipt: taxReceipt || false,
        joinMailingList: joinMailingList || false,
        // Donor Social Profiles
        socialX: socialX || null,
        socialFacebook: socialFacebook || null,
        socialLinkedIn: socialLinkedIn || null,
      },
    })

    // Prepare the payload for The Giving Block's CreateFiatDonationPledge API
    const apiPayload: any = {
      organizationId: organizationId.toString(),
      isAnonymous: isAnonymous,
      pledgeAmount: parsedPledgeAmount.toString(),
      firstName: firstName || '',
      lastName: lastName || '',
      receiptEmail: receiptEmail || '',
      addressLine1: addressLine1 || '',
      addressLine2: addressLine2 || '',
      country: country || '',
      state: state || '',
      city: city || '',
      zipcode: zipcode || '',
    }

    // Log the payload being sent
    console.log('Payload being sent to The Giving Block API:', apiPayload)

    // Call The Giving Block's CreateFiatDonationPledge API
    const tgbResponse = await axios.post(
      'https://public-api.tgbwidget.com/v1/donation/fiat',
      apiPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    // Check if the response has the expected data
    if (
      !tgbResponse.data ||
      !tgbResponse.data.data ||
      !tgbResponse.data.data.pledgeId
    ) {
      throw new Error('Invalid response from external API.')
    }

    const { pledgeId } = tgbResponse.data.data

    // Update the Donation record with the returned pledgeId
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        pledgeId: pledgeId,
      },
    })

    return res.status(200).json({ pledgeId })
  } catch (error: any) {
    // Enhanced error logging
    if (axios.isAxiosError(error)) {
      console.error(
        'Axios error creating fiat donation pledge:',
        error.response?.data || error.message
      )
      return res.status(400).json({
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          `Bad Request: ${error.message}`,
      })
    } else {
      console.error('Error creating fiat donation pledge:', error.message)
      return res
        .status(500)
        .json({ error: `Internal Server Error: ${error.message}` })
    }
  }
}
