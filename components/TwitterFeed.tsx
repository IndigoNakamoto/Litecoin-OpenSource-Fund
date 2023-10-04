// components/TwitterComments.tsx
import React, { useEffect, useState } from 'react'
import { Tweet } from 'react-tweet'

const TwitterFeed = ({ hashtag }) => {
  const [tweets, setTweets] = useState<string[] | null>(null) // Explicitly type tweets

  useEffect(() => {
    // Fetch tweets from your backend or a service
    fetch(`/api/getTweets?hashtag=${hashtag}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => setTweets(data))
      .catch((error) => console.error('Error fetching tweets:', error))
  }, [hashtag])

  return (
    <div>
      {tweets ? (
        tweets.map((tweetId) => (
          <div key={tweetId}>
            <h1>{tweetId}</h1>
            <Tweet id={tweetId} />
          </div>
        ))
      ) : (
        <p>Loading tweets...</p>
      )}
    </div>
  )
}

export default TwitterFeed
