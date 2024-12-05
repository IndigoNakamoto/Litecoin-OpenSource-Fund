// pages/api/getHomepageStats.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import { kv } from '@vercel/kv' // Import KV from Vercel

type HomepageStats = {
  numberOfDailyTransactions: number
  usdValuePerDay: number
  networkSecurity: number
  dailyAddresses: number
  median_transaction_fee_usd_24h: number
}

const fetchHomepageStats = async (): Promise<HomepageStats> => {
  const cacheKey = 'homepageStats'
  const cachedStats = await kv.get<HomepageStats>(cacheKey)

  if (cachedStats !== null && cachedStats !== undefined) {
    return cachedStats
  }

  try {
    // Fetch data from Blockchair API
    const response = await fetch('https://api.blockchair.com/litecoin/stats')

    if (!response.ok) {
      throw new Error(`Blockchair API error: ${response.statusText}`)
    }

    const blockchairData = await response.json()

    if (!blockchairData || !blockchairData.data) {
      throw new Error('Invalid data from Blockchair API')
    }

    const data = blockchairData.data

    // Extract and calculate required data
    const numberOfDailyTransactions = data.transactions_24h

    // USD Value per Day
    const volume24h = data.volume_24h // In satoshis
    const marketPriceUsd = data.market_price_usd
    const median_transaction_fee_usd_24h = data.median_transaction_fee_usd_24h

    // Convert volume from satoshis to LTC
    const totalLtcTransferred = volume24h / 1e8

    // Calculate USD Value per Day
    const usdValuePerDay = totalLtcTransferred * marketPriceUsd

    // Network Security (Hashrate in PH/s)
    const hashrate24h = parseFloat(data.hashrate_24h) // In H/s
    const networkSecurity = hashrate24h / 1e15 // Convert to PH/s

    // Daily Addresses
    const dailyAddresses = data.hodling_addresses

    const homepageStats: HomepageStats = {
      numberOfDailyTransactions,
      usdValuePerDay,
      networkSecurity,
      dailyAddresses,
      median_transaction_fee_usd_24h,
    }

    // Cache the result for 5 minutes (300 seconds)
    await kv.set(cacheKey, homepageStats, { ex: 300 })

    return homepageStats
  } catch (error) {
    console.error('Error fetching homepage stats:', error)
    throw new Error('Failed to fetch homepage stats')
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HomepageStats | { error: string }>
) {
  try {
    const homepageStats = await fetchHomepageStats()
    res.status(200).json(homepageStats)
  } catch (error) {
    console.error('Error in getHomepageStats handler:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
