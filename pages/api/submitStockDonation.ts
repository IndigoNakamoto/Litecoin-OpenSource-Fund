// pages/api/submitStockDonation.ts

import { NextApiRequest, NextApiResponse } from 'next'

// Define the type for the submitted stock donation object
type SubmittedStockDonation = {
  donationUuid: string
  brokerName: string
  brokerageAccountNumber: string
  brokerContactName?: string
  brokerEmail?: string
  brokerPhone?: string
}

// Mock storage for submitted stock donations
const mockSubmittedStockDonations: SubmittedStockDonation[] = []

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const {
    donationUuid,
    brokerName,
    brokerageAccountNumber,
    brokerContactName,
    brokerEmail,
    brokerPhone,
  } = req.body

  if (!donationUuid || !brokerName || !brokerageAccountNumber) {
    const missingFields: string[] = [] // Specify the type here
    if (!donationUuid) missingFields.push('donationUuid')
    if (!brokerName) missingFields.push('brokerName')
    if (!brokerageAccountNumber) missingFields.push('brokerageAccountNumber')
    return res
      .status(400)
      .json({ error: `Missing required fields: ${missingFields.join(', ')}` })
  }

  try {
    // Mock response based on the expected structure
    const mockApiResponse = {
      data: {
        isSuccess: true,
      },
      requestId: '3aa84ad9-5222-4e01-a5b0-d0c6c2849836', // Mocked request ID
    }

    // Mock saving the submitted stock donation data
    const submittedStockDonation: SubmittedStockDonation = {
      donationUuid,
      brokerName,
      brokerageAccountNumber,
      brokerContactName,
      brokerEmail,
      brokerPhone,
    }

    // Save the submitted stock donation to the mock storage
    mockSubmittedStockDonations.push(submittedStockDonation)

    // Respond with the mocked API data
    res.status(200).json(mockApiResponse)
  } catch (error) {
    console.error('Error submitting stock donation:', (error as Error).message)
    res.status(500).json({
      error: 'Internal Server Error: Unable to submit stock donation',
    })
  }
}
