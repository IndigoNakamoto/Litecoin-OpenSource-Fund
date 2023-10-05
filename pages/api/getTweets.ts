/*
  This file defines a Next.js API route for fetching recent tweets with a specific hashtag using the Twitter API v2.
  It expects a "hashtag" query parameter and makes an authenticated request to Twitter.
  If the "hashtag" parameter is missing or if the Twitter Bearer Token is missing, it returns an error response.

  Please ensure that you have set up the necessary environment variables, including TWITTER_BEARER_TOKEN,
  to use this API route effectively.

  Route URL: /api/twitter-recent-search
  Example usage: /api/twitter-recent-search?hashtag=myhashtag

  The response contains an array of tweet IDs matching the specified hashtag.
*/
import { NextApiRequest, NextApiResponse } from 'next'
import needle from 'needle'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { hashtag } = req.query

  if (!hashtag) {
    res.status(400).json({ error: 'Hashtag parameter is required' })
    return
  }

  // Your Twitter Bearer Token
  const bearerToken = process.env.TWITTER_BEARER_TOKEN

  if (!bearerToken) {
    res.status(500).json({ error: 'Twitter Bearer Token is missing' })
    return
  }

  try {
    // Make authenticated request to Twitter API v2 endpoint
    const endpointUrl = 'https://api.twitter.com/2/tweets/search/recent'
    const params = {
      query: `#${hashtag} -is:retweet`,
      'tweet.fields': 'id',
      // 'tweet.fields': 'author_id,text,created_at',
      // expansions: 'author_id',
      // 'user.fields': 'id,name,username,verified,profile_image_url',
    }

    const headers = {
      'User-Agent': 'v2RecentSearchJS',
      Authorization: `Bearer ${bearerToken}`,
    }

    const response = await needle('get', endpointUrl, params, {
      headers: headers,
    })

    if (response.statusCode === 200) {
      const tweetsData = response.body
      // console.log('Tweets data: ', tweetsData)
      const tweet_ids = tweetsData.data.map((tweet) => tweet.id)
      // console.log('TWEET DATA: ', tweet_ids)
      res.status(200).json(tweet_ids)
    } else {
      console.error('Error fetching tweets. Status Code:', response.statusCode)
      res.status(500).json({
        error: 'Failed to fetch tweets',
        message: response.body,
      })
    }
  } catch (error) {
    console.error('Error fetching tweets:', error)
    res.status(500).json({
      error: 'Failed to fetch tweets',
      message: error.message,
    })
  }
}

export default handler
