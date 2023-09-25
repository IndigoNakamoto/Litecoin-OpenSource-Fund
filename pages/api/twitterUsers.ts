import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { usernames } = req.query

  if (!usernames) {
    res.status(400).json({ error: 'Usernames parameter is required' })
    return
  }

  const endpoint = 'https://api.twitter.com/1.1/users/lookup.json'

  try {
    const response = await axios.get(endpoint, {
      params: { screen_name: usernames },
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    })

    const users = response.data.map((obj) => {
      return {
        name: obj.name,
        screen_name: obj.screen_name,
        profile_image_url_https: obj.profile_image_url_https,
      }
    })

    res.status(200).json(users)
  } catch (error) {
    console.log('Failed to fetch Twitter user data:', error.message)
    res.status(500).json({
      error: 'Failed to fetch Twitter user data',
      message: error.message,
    })
  }
}

export default handler
