import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { kv } from '@vercel/kv'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { usernames } = req.query

  console.log('\n \n api/twitterUsers')
  if (!usernames) {
    console.log('Usernames parameter is missing')
    res.status(400).json({ error: 'Usernames parameter is required' })
    return
  }

  // Convert usernames to a string and create a cache key
  const usernamesStr = Array.isArray(usernames)
    ? usernames.join(',')
    : usernames
  const cacheKey = `twitterUsers:${usernamesStr}`
  console.log(`Cache key generated: ${cacheKey}`)

  try {
    // Attempt to retrieve cached data
    console.log('Checking KV for cached data')
    let users = await kv.get<
      { name: string; screen_name: string; profile_image_url_https: string }[]
    >(cacheKey)

    if (!users) {
      // If not cached, make a request to the Twitter API using POST
      console.log('No cached data found, calling Twitter API using POST')
      const endpoint = 'https://api.twitter.com/1.1/users/lookup.json'

      const response = await axios.post(
        endpoint,
        {
          screen_name: usernamesStr, // Send the data in the request body
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
            'Content-Type': 'application/x-www-form-urlencoded', // Set the content type for POST
          },
        }
      )

      // Map the response data to the desired format
      users = response.data.map((obj) => ({
        name: obj.name,
        screen_name: obj.screen_name,
        profile_image_url_https: obj.profile_image_url_https,
      }))

      console.log('Caching the new data from Twitter API')
      // Cache the newly fetched data
      await kv.set(cacheKey, users) // Expires after 1 hour, adjust as needed
    }

    // Return the users, either from cache or fresh from the Twitter API
    res.status(200).json(users)
  } catch (error) {
    console.error('ERROR: ', error.message)
    // console.error(error)
    res.status(error.statusCode).json({
      error: 'Failed to fetch Twitter user data',
      message: error.message,
    })
  }
}

export default handler
