import axios from 'axios'

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
    // Mocking the API call, replace with actual API call in production
    const response = {
      data: {
        pledgeId: 'mock-pledge-id',
      },
    }

    res.status(200).json({ pledgeId: response.data.pledgeId })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
