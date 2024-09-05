// pages/api/createFiatDonationPledge.ts

// Mock storage for donations
const mockDonations = []

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const {
    organizationId,
    isAnonymous,
    pledgeAmount,
    firstName,
    lastName,
    receiptEmail,
    addressLine1,
    addressLine2,
    country,
    state,
    city,
    zipcode,
  } = req.body

  try {
    // Mock response from The Giving Block API based on the expected response structure
    const mockApiResponse = {
      data: {
        pledgeId: '434b9bfb-69f1-4f19-baf7-55f41e331faf', // Mocked pledge ID
      },
      requestId: '232b620c-464e-454f-b131-02128bce8419', // Mocked request ID
    }

    // Extracting mocked data
    const { pledgeId } = mockApiResponse.data
    const { requestId } = mockApiResponse

    // Define the type for the donation object
    type Donation = {
      pledgeId: string
      organizationId: string
      isAnonymous: boolean
      pledgeAmount: string
      firstName?: string
      lastName?: string
      receiptEmail?: string
      addressLine1?: string
      addressLine2?: string
      country?: string
      state?: string
      city?: string
      zipcode?: string
    }

    // Mock saving the donation data
    const donation: Donation = {
      pledgeId,
      organizationId,
      isAnonymous,
      pledgeAmount,
      firstName,
      lastName,
      receiptEmail,
      addressLine1,
      addressLine2,
      country,
      state,
      city,
      zipcode,
    }
    // Save the donation to the mock storage
    mockDonations.push(donation as never)

    // Respond with the mocked API data
    res.status(200).json({ data: { pledgeId }, requestId })
  } catch (error) {
    console.error('Error saving donation:', error.message)
    res
      .status(500)
      .json({ error: 'Internal Server Error: Fiat donations disabled' })
  }
}
