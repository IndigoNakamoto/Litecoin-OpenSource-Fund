// components/TwitterComments.tsx
import React, { useEffect, useState } from 'react'
import { Tweet } from 'react-tweet'

const TwitterFeed = ({ hashtag, tweetsData }) => {
  const [tweets, setTweets] = useState<string[] | null>(null) // Explicitly type tweets

  useEffect(() => {
    const tweetsForHashtag = tweetsData[hashtag]
    setTweets(tweetsForHashtag || [])
  }, [hashtag])

  return (
    <div>
      {tweets ? (
        tweets.map((tweetId) => (
          <div key={tweetId}>
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
