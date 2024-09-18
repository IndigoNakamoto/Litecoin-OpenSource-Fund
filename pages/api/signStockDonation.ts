// pages/api/signStockDonation.ts

// Mock storage for signed stock donations
const mockSignedDonations = []

export default async function handler(req, res) {
  // Check if the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { donationUuid, date, signature } = req.body

  // Validate the required fields
  if (!donationUuid || !date || !signature) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    // Mock response structure as expected from the actual API
    const mockApiResponse = {
      data: {
        isSuccess: true,
      },
      requestId: '93289774-9546-43e5-8258-3ed5a2eaa9a3', // Mocked request ID
    }

    // Define the type for the signed donation object
    type SignedDonation = {
      donationUuid: string
      date: string
      signature: string
      requestId: string
    }

    // Create the signed donation object
    const signedDonation: SignedDonation = {
      donationUuid,
      date,
      signature,
      requestId: mockApiResponse.requestId,
    }

    // Save the signed donation to the mock storage
    mockSignedDonations.push(signedDonation as never)

    // Respond with the mocked API data
    res.status(200).json(mockApiResponse)
  } catch (error) {
    console.error('Error processing signed donation:', error.message)
    res
      .status(500)
      .json({ error: 'Internal Server Error: Signing donations disabled' })
  }
}
