// /pages/api/twitterUsers.ts
import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { kv } from '@vercel/kv'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { usernames, clearCache } = req.query

  console.log('\n \n api/twitterUsers')

  if (!usernames) {
    // console.log('Usernames parameter is missing')
    res.status(400).json({ error: 'Usernames parameter is required' })
    return
  }

  const usernamesStr = Array.isArray(usernames)
    ? usernames.join(',')
    : usernames
  const cacheKey = `twitterUsers:${usernamesStr}`

  try {
    //clearCache // eslint-disable-next-line no-constant-condition
    if (clearCache) {
      // Clear cache logic
      // console.log(`Clearing cache for key: ${cacheKey}`)
      await kv.del(cacheKey)
    }

    // console.log('Checking KV for cached data')
    let users = await kv.get<
      { name: string; screen_name: string; profile_image_url_https: string }[]
    >(cacheKey)

    if (!users) {
      // console.log('No cached data found, calling Twitter API using GET')
      const endpoint = `https://api.twitter.com/2/users/by?usernames=${usernamesStr}&user.fields=profile_image_url`

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      })

      users = response.data.data.map((obj) => ({
        name: obj.name,
        screen_name: obj.username,
        profile_image_url_https: obj.profile_image_url,
      }))

      // console.log('Caching the new data from Twitter API')
      await kv.set(cacheKey, users) // Expires after 1 hour, adjust as needed
    }

    res.status(200).json(users)
  } catch (error) {
    if (error.response) {
      console.error('Error data:', error.response.data)
      console.error('Error status:', error.response.status)
      console.error('Error headers:', error.response.headers)
    } else if (error.request) {
      console.error('Error request:', error.request)
    } else {
      console.error('Error message:', error.message)
    }
    console.error('Error config:', error.config)

    res.status(500).json({
      error: 'Failed to fetch Twitter user data',
      message: error.message,
      details: error.response?.data || error.request || error.message,
    })
  }
}

export default handler
