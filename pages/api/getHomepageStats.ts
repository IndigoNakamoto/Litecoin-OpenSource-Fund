// /pages/api/getHomepageStats.ts

import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // 1. Fetch Data from Blockchair Public API
    const response = await fetch('https://api.blockchair.com/litecoin/stats')

    if (!response.ok) {
      throw new Error(`Blockchair API error: ${response.statusText}`)
    }

    const blockchairData = await response.json()

    if (!blockchairData || !blockchairData.data) {
      throw new Error('Invalid data from Blockchair API')
    }

    const data = blockchairData.data

    // 2. Extract and Calculate Required Data

    // Number of Daily Transactions
    const numberOfDailyTransactions = data.transactions_24h

    // USD Value per Day
    const volume24h = data.volume_24h // In satoshis
    const marketPriceUsd = data.market_price_usd

    // Convert volume from satoshis to LTC
    const totalLtcTransferred = volume24h / 1e8

    // Calculate USD Value per Day
    const usdValuePerDay = totalLtcTransferred * marketPriceUsd

    // Network Security (Hashrate in PH/s)
    const hashrate24h = parseFloat(data.hashrate_24h) // In H/s
    const networkSecurity = hashrate24h / 1e15 // Convert to PH/s

    // Daily Addresses
    const dailyAddresses = data.hodling_addresses

    // 3. Prepare and Send the Response
    const result = {
      numberOfDailyTransactions,
      usdValuePerDay,
      networkSecurity,
      dailyAddresses,
    }

    res.status(200).json(result)
  } catch (error) {
    console.error('Error in getHomepageStats API:', error)
    res.status(500).json({ statusCode: 500, message: (error as Error).message })
  }
}
