// // pages/api/postCurrenciesList.ts

// import { NextApiRequest, NextApiResponse } from 'next'
// import axios from 'axios'
// import { getAccessToken } from '../../utils/authTGB' // Assumed utility for fetching the access token

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' })
//   }

//   try {
//     const { filters = {}, pagination = { page: 1, itemsPerPage: 10 } } =
//       req.body

//     // Get the access token
//     const accessToken = await getAccessToken()

//     // Prepare the API request options
//     const options = {
//       method: 'POST',
//       url: 'https://public-api.tgbwidget.com/v1/currencies/list',
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//       data: {
//         filters,
//         pagination,
//       },
//     }
//     // Make the API request
//     const response = await axios.request({
//       ...options,
//       method: 'post' as const, // Explicitly set the method to 'post'
//     })

//     // Return the data from the API response
//     res.status(200).json({
//       data: response.data.data,
//       requestId: response.data.requestId,
//     })
//   } catch (error) {
//     // Handle different error cases based on the API's documentation
//     if (error.response) {
//       // API returned a specific error
//       res.status(error.response.status).json({
//         message: error.response.data.message || 'Error from the API',
//         details: error.response.data,
//       })
//     } else {
//       // Network or other unknown error
//       res
//         .status(500)
//         .json({ error: 'Internal Server Error', details: error.message })
//     }
//   }
// }

// pages/api/getTickerList.js

// Mock response for the Giving Block API
const mockTickers = [
  { name: 'Agilent Technologies Inc.', ticker: 'A' },
  { name: 'Alcoa Corporation', ticker: 'AA' },
  { name: 'AXS First Priority CLO Bond ETF', ticker: 'AAA' },
  { name: 'Goldman Sachs Physical Gold ETF Shares', ticker: 'AAAU' },
  { name: 'Ares Acquisition Corporation', ticker: 'AAC' },
  { name: 'Apple Inc.', ticker: 'AAPL' },
  { name: 'Amazon.com, Inc.', ticker: 'AMZN' },
  { name: 'Alphabet Inc. Class A', ticker: 'GOOGL' },
  { name: 'Microsoft Corporation', ticker: 'MSFT' },
  { name: 'Meta Platforms Inc.', ticker: 'META' },
  { name: 'Tesla, Inc.', ticker: 'TSLA' },
  { name: 'NVIDIA Corporation', ticker: 'NVDA' },
  { name: 'Advanced Micro Devices, Inc.', ticker: 'AMD' },
  { name: 'Netflix, Inc.', ticker: 'NFLX' },
  { name: 'Intel Corporation', ticker: 'INTC' },
  { name: 'The Coca-Cola Company', ticker: 'KO' },
  { name: 'PepsiCo, Inc.', ticker: 'PEP' },
  { name: 'Procter & Gamble Company', ticker: 'PG' },
  { name: 'Johnson & Johnson', ticker: 'JNJ' },
  { name: 'Pfizer Inc.', ticker: 'PFE' },
  { name: 'Berkshire Hathaway Inc.', ticker: 'BRK.A' },
  { name: 'Visa Inc.', ticker: 'V' },
  { name: 'Mastercard Incorporated', ticker: 'MA' },
  { name: 'JPMorgan Chase & Co.', ticker: 'JPM' },
  { name: 'Bank of America Corporation', ticker: 'BAC' },
  { name: 'Wells Fargo & Company', ticker: 'WFC' },
  { name: 'Citigroup Inc.', ticker: 'C' },
  { name: 'Goldman Sachs Group, Inc.', ticker: 'GS' },
  { name: 'Morgan Stanley', ticker: 'MS' },
  { name: 'Chevron Corporation', ticker: 'CVX' },
  { name: 'Exxon Mobil Corporation', ticker: 'XOM' },
  { name: 'Royal Dutch Shell plc', ticker: 'RDS.A' },
  { name: 'BP p.l.c.', ticker: 'BP' },
  { name: 'ConocoPhillips', ticker: 'COP' },
  { name: 'General Electric Company', ticker: 'GE' },
  { name: 'Ford Motor Company', ticker: 'F' },
  { name: 'The Boeing Company', ticker: 'BA' },
  { name: 'Lockheed Martin Corporation', ticker: 'LMT' },
  { name: 'Raytheon Technologies Corporation', ticker: 'RTX' },
  { name: 'United Parcel Service, Inc.', ticker: 'UPS' },
  { name: 'FedEx Corporation', ticker: 'FDX' },
  { name: 'Walmart Inc.', ticker: 'WMT' },
  { name: 'The Home Depot, Inc.', ticker: 'HD' },
  { name: 'Costco Wholesale Corporation', ticker: 'COST' },
  { name: 'Target Corporation', ticker: 'TGT' },
  { name: 'McDonald’s Corporation', ticker: 'MCD' },
  { name: 'Starbucks Corporation', ticker: 'SBUX' },
  { name: 'Walt Disney Company', ticker: 'DIS' },
  { name: 'Nike, Inc.', ticker: 'NKE' },
]

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { pagination = {}, filters = {} } = req.body
  const { page = 1, itemsPerPage = 5 } = pagination

  try {
    // Apply filters with OR logic for name and ticker
    let filteredTickers = mockTickers
    if (filters.name || filters.ticker) {
      const query = (filters.name || filters.ticker).toLowerCase()
      filteredTickers = filteredTickers.filter(
        (ticker) =>
          ticker.name.toLowerCase().includes(query) ||
          ticker.ticker.toLowerCase().includes(query)
      )
    }

    // Calculate pagination
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    const paginatedTickers = filteredTickers.slice(start, end)

    // Mock response
    const mockApiResponse = {
      data: {
        tickers: paginatedTickers,
        pagination: {
          itemsPerPage,
          page,
          count: filteredTickers.length, // total items after filtering
        },
      },
      requestId: 'mock-request-id', // Mock request ID
    }

    // Respond with the mocked API data
    res.status(200).json(mockApiResponse)
  } catch (error) {
    console.error('Error fetching tickers:', error.message)
    res.status(500).json({ error: error.message })
  }
}
