// pages/api/chargeFiatDonationPledge.ts

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { pledgeId, cardToken } = req.body

  try {
    // Mock response from The Giving Block API
    const mockApiResponse = {
      data: {
        success: true, // Mocking a successful charge
      },
    }

    // Extracting mocked data
    const { success } = mockApiResponse.data

    // Check for a valid pledgeId and cardToken for the mock scenario
    if (pledgeId && cardToken) {
      // Mocking a successful charge operation
      res.status(200).json({ data: { success } })
    } else {
      // If there are missing details, simulate a failed charge response
      res.status(500).json({ error: 'Internal Server Error: Charge failed' })
    }
  } catch (error) {
    console.error('Error charging fiat donation pledge:', error)
    res.status(500).json({ error: error.message })
  }
}
