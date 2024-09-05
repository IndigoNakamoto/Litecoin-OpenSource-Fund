// Mock storage for donations
const mockDonations = []

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const {
    organizationId,
    isAnonymous,
    pledgeCurrency,
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
    // Mock response from The Giving Block API
    const mockApiResponse = {
      data: {
        depositAddress: 'mockDepositAddress12345',
        pledgeId: 'mockPledgeId67890',
        qrCode: 'mockQrCodeLink',
      },
    }

    // Extracting mocked data
    const { depositAddress, pledgeId, qrCode } = mockApiResponse.data
    // Define the type for the donation object
    type Donation = {
      pledgeId: string
      depositAddress: string
      pledgeCurrency: any
      pledgeAmount: any
      isAnonymous: any
      firstName: any
      lastName: any
      receiptEmail: any
      addressLine1: any
      addressLine2: any
      country: any
      state: any
      city: any
      zipcode: any
    }

    // Mock saving the donation data
    const donation: Donation = {
      pledgeId,
      depositAddress,
      pledgeCurrency,
      pledgeAmount,
      isAnonymous,
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

    // Ensure mockDonations is an array
    const mockDonations: Donation[] = []

    mockDonations.push(donation)

    // Respond with the mocked API data
    res.status(200).json({ depositAddress, pledgeId, qrCode })
  } catch (error) {
    console.error('Error saving donation:', error.message)
    res.status(500).json({ error: error.message })
  }
}
