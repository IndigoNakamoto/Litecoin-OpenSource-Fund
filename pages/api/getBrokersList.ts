// pages/api/getStockBrokers.ts

// Mock storage for brokers
const mockBrokers = [
  { name: 'ameriprise', label: 'Ameriprise' },
  { name: 'schwab', label: 'Charles Schwab' },
  { name: 'etrade', label: 'E-Trade' },
  { name: 'fidelity', label: 'Fidelity Investments' },
  { name: 'jpmorgan', label: 'J.P. Morgan' },
  { name: 'lpl', label: 'LPL Financial' },
  { name: 'merrill', label: 'Merrill Lynch' },
  { name: 'morganstanley', label: 'Morgan Stanley' },
  { name: 'ameritrade', label: 'TD Ameritrade' },
  { name: 'tiaa', label: 'TIAA Brokerage' },
  { name: 'trowe', label: 'T. Rowe Price' },
  { name: 'wellsfargo', label: 'Wells Fargo' },
  { name: 'other', label: 'Other' },
]

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Mock response similar to the expected API response
    const mockApiResponse = {
      data: {
        brokers: mockBrokers,
      },
      requestId: '821ec76e-ae39-4206-b5db-48322b07729d', // Mocked request ID
    }

    // Respond with the mocked API data
    res.status(200).json(mockApiResponse)
  } catch (error) {
    console.error('Error fetching brokers:', error.message)
    res
      .status(500)
      .json({ error: 'Internal Server Error: Brokers data unavailable' })
  }
}
