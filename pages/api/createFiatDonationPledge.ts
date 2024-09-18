// // pages/api/createFiatDonationPledge.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import axios from 'axios'
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
    // project
    organizationId,
    projectSlug,
    // Donation
    pledgeCurrency,
    pledgeAmount,
    // Donor Info
    receiptEmail,
    firstName,
    lastName,
    /// Donor Personal Info
    addressLine1,
    addressLine2,
    country,
    state,
    city,
    zipcode,
    // Donor Settings
    taxReceipt,
    isAnonymous,
    joinMailingList,
    // Donor Social Profiles
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
      // Create a new Donation record without pledgeId initially
      const donation = await prisma.donation.create({
        data: {
          // Project
          projectSlug: projectSlug,
          organizationId: organizationId || null,
          // Donation
          donationType: 'fiat',
          assetSymbol: pledgeCurrency,
          pledgeAmount: parseFloat(pledgeAmount),
          // Donor Info
          firstName: firstName || null,
          lastName: lastName || null,
          donorEmail: receiptEmail || null,
          // Donor Settings
          isAnonymous: isAnonymous || false,
          taxReceipt: taxReceipt || true,
          joinMailingList: joinMailingList || false,
          // Donor Social Profiles
          socialX: socialX || null,
          socialFacebook: socialFacebook || null,
          socialLinkedIn: socialLinkedIn || null,
        },
      })

      // DONE Call The Giving Block's CreateDepositAddress API
      const tgbResponse = await axios.post(
        'https://public-api.tgbwidget.com/v1/deposit-address',
        {
          organizationId: organizationId,
          isAnonymous: isAnonymous,
          pledgeAmount: pledgeAmount,
          firstName: firstName,
          lastName: lastName,
          receiptEmail: receiptEmail,
          addressLine1: addressLine1,
          addressLine2: addressLine2,
          country: country,
          state: state,
          city: city,
          zipcode: zipcode,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const { pledgeId } = tgbResponse.data.data

      // Update the Donation record with pledgeId
      await prisma.donation.update({
        where: { id: donation.id },
        data: {
          pledgeId: pledgeId,
        },
      })

      return { pledgeId }
    })

    return res.status(200).json(result)
  } catch (error: any) {
    console.error('Error creating crypto donation pledge:', error.message)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

// // Mock storage for donations
// const mockDonations = []

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' })
//   }

//   const {
//     organizationId,
//     isAnonymous,
//     pledgeAmount,
//     firstName,
//     lastName,
//     receiptEmail,
//     addressLine1,
//     addressLine2,
//     country,
//     state,
//     city,
//     zipcode,
//   } = req.body

//   try {
//     // Mock response from The Giving Block API based on the expected response structure
//     const mockApiResponse = {
//       data: {
//         pledgeId: '434b9bfb-69f1-4f19-baf7-55f41e331faf', // Mocked pledge ID
//       },
//       requestId: '232b620c-464e-454f-b131-02128bce8419', // Mocked request ID
//     }

//     // Extracting mocked data
//     const { pledgeId } = mockApiResponse.data
//     const { requestId } = mockApiResponse

//     // Define the type for the donation object
//     type Donation = {
//       pledgeId: string
//       organizationId: string
//       isAnonymous: boolean
//       pledgeAmount: string
//       firstName?: string
//       lastName?: string
//       receiptEmail?: string
//       addressLine1?: string
//       addressLine2?: string
//       country?: string
//       state?: string
//       city?: string
//       zipcode?: string
//     }

//     // Mock saving the donation data
//     const donation: Donation = {
//       pledgeId,
//       organizationId,
//       isAnonymous,
//       pledgeAmount,
//       firstName,
//       lastName,
//       receiptEmail,
//       addressLine1,
//       addressLine2,
//       country,
//       state,
//       city,
//       zipcode,
//     }
//     // Save the donation to the mock storage
//     mockDonations.push(donation as never)

//     // Respond with the mocked API data
//     res.status(200).json({ data: { pledgeId }, requestId })
//   } catch (error) {
//     console.error('Error saving donation:', error.message)
//     res
//       .status(500)
//       .json({ error: 'Internal Server Error: Fiat donations disabled' })
//   }
// }
