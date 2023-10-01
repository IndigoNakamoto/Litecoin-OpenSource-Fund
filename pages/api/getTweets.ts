// api/getTweets.ts
import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { hashtag } = req.query

  if (!hashtag) {
    res.status(400).json({ error: 'Hashtag parameter is required' })
    return
  }

  const endpoint = 'https://api.twitter.com/2/tweets/search/recent'

  try {
    const response = await axios.get(endpoint, {
      params: { query: `#${hashtag}` },
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    })

    // Assuming tweets are contained in the `data` field of the response object
    const tweets = response.data.data.map((tweet) => {
      return {
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        user: {
          name: tweet.user.name,
          screen_name: tweet.user.screen_name,
          profile_image_url_https: tweet.user.profile_image_url_https,
        },
      }
    })

    res.status(200).json(tweets)
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch tweets',
      message: error.message,
    })
  }
}

export default handler
