// /pages/api/clearKV.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { kv } from '@vercel/kv'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    console.log(
      `[${new Date().toISOString()}] Method ${req.method} Not Allowed`
    )
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }

  // Authenticate the request using Authorization header
  const authHeader = req.headers['authorization']
  const expectedAuthHeader = `Bearer ${process.env.CRON_SECRET}`

  if (authHeader !== expectedAuthHeader) {
    console.log(`[${new Date().toISOString()}] Unauthorized access attempt`)
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Fetch all keys from the KV store using a wildcard pattern
    const keys = await kv.keys('*')

    if (keys.length === 0) {
      console.log(`[${new Date().toISOString()}] KV store is already empty.`)
      return res.status(200).json({ message: 'KV store is already empty.' })
    }

    console.log(
      `[${new Date().toISOString()}] Retrieved ${
        keys.length
      } keys. Starting deletion.`
    )

    // Define batch size to handle large numbers of keys
    const BATCH_SIZE = 100

    for (let i = 0; i < keys.length; i += BATCH_SIZE) {
      const batch = keys.slice(i, i + BATCH_SIZE)
      await Promise.all(batch.map((key) => kv.del(key)))
      console.log(
        `[${new Date().toISOString()}] Deleted batch ${i / BATCH_SIZE + 1}`
      )
    }

    console.log(
      `[${new Date().toISOString()}] All KV data cleared successfully.`
    )
    return res
      .status(200)
      .json({ message: 'All KV data cleared successfully.' })
  } catch (error: any) {
    console.error(`[${new Date().toISOString()}] Error clearing KV:`, error)
    return res.status(500).json({
      error: 'Failed to clear KV data.',
      details: error.message || 'An unexpected error occurred.',
    })
  }
}

export default handler
