// pages/api/chargeFiatDonationPledge.ts

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { pledgeId, cardToken, amount } = req.body

  console.log(
    `pages/api/chargeFiatDonationPledge ${pledgeId}, ${cardToken}, ${amount}`
  )

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
      // Simulate a scenario where the charge fails due to exceeded funds or credit limit
      if (amount > 1000) {
        // Example condition where the amount exceeds a limit
        throw new Error(
          JSON.stringify({
            errorMessage:
              "The charge amount exceeds the available funds or the card's credit limit.",
            errorType: 'err.generic',
            meta: {},
            requestId: '99f0ec91-0def-4aca-99a9-eba17c2af2a3',
          })
        )
      }
      // Mocking a successful charge operation
      res.status(200).json({ data: { success } })
    } else {
      // If there are missing details, simulate a failed charge response
      res.status(500).json({
        error: {
          errorMessage:
            "The charge amount exceeds the available funds or the card's credit limit.",
          errorType: 'err.generic',
          meta: {},
          requestId: '99f0ec91-0def-4aca-99a9-eba17c2af2a3',
        },
      })
    }
  } catch (error) {
    console.error('Error charging fiat donation pledge:', error)
    // Parsing the error message from the thrown error
    let errorResponse
    try {
      errorResponse = JSON.parse(error.message)
    } catch {
      errorResponse = {
        errorMessage: 'An unexpected error occurred.',
        errorType: 'err.unknown',
        meta: {},
        requestId: 'unknown',
      }
    }
    res.status(500).json(errorResponse)
  }
}
