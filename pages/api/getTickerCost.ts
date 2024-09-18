// pages/api/getTickerCost

// Mocked ticker prices
const mockTickerPrices = {
  A: 150.25,
  AA: 40.1,
  AAA: 55.45,
  AAAU: 18.3,
  AAC: 10.6,
  AAPL: 175.6,
  AMZN: 135.5,
  GOOGL: 2800.75,
  MSFT: 299.25,
  META: 320.45,
  TSLA: 650.1,
  NVDA: 200.3,
  AMD: 110.6,
  NFLX: 225.55,
  INTC: 55.3,
  KO: 60.25,
  PEP: 155.35,
  PG: 145.0,
  JNJ: 170.45,
  PFE: 43.2,
  'BRK.A': 438000.0,
  V: 220.25,
  MA: 355.45,
  JPM: 160.3,
  BAC: 40.1,
  WFC: 46.8,
  C: 65.9,
  GS: 350.7,
  MS: 89.2,
  CVX: 150.3,
  XOM: 60.4,
  'RDS.A': 44.1,
  BP: 29.0,
  COP: 59.2,
  GE: 98.1,
  F: 15.45,
  BA: 210.3,
  LMT: 380.5,
  RTX: 90.4,
  UPS: 190.5,
  FDX: 240.65,
  WMT: 145.1,
  HD: 325.7,
  COST: 510.2,
  TGT: 175.8,
  MCD: 255.65,
  SBUX: 105.45,
  DIS: 180.25,
  NKE: 135.0,
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { ticker } = req.query

  // Validate ticker parameter
  if (!ticker || typeof ticker !== 'string') {
    return res
      .status(400)
      .json({ message: 'Ticker parameter is required and must be a string.' })
  }

  // Find the mock price for the provided ticker
  const rate = mockTickerPrices[ticker.toUpperCase()]

  // If the ticker is not found in the mock data
  if (!rate) {
    return res.status(404).json({ message: `Ticker ${ticker} not found.` })
  }

  // Mock response
  const mockApiResponse = {
    data: {
      rate,
    },
    requestId: 'mock-request-id', // Mock request ID
  }

  // Respond with the mocked API data
  res.status(200).json(mockApiResponse)
}
