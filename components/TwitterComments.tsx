// components/TwitterComments.tsx
import React, { useEffect, useState } from 'react'
import TweetEmbed from 'react-tweet-embed'

const TwitterComments = ({ hashtag }) => {
  const [tweets, setTweets] = useState<string[] | null>(null)

  /*
  Example tweets:  [
    '1709187570351943763',
    '1709071167544332364',
    '1708663790307319882',
    '1708478191633846424',
    '1708323788386172977',
    '1708216564531536163',
    '1708205070267879899',
    '1708179619533254919',
    '1708155923170984321',
    '1707708093566423133'
  ]
*/

  useEffect(() => {
    // Fetch tweets from your backend or a service
    fetch(`/api/getTweets?hashtag=${hashtag}`)
      .then((response) => response.json())
      .then((data) => setTweets(data))
  }, [hashtag])

  return (
    <div>
      {tweets ? (
        tweets.map((tweetId) => (
          <div key={tweetId}>
            <TweetEmbed tweetId={tweetId} />
          </div>
        ))
      ) : (
        <p>Loading tweets...</p>
      )}
    </div>
  )
}

export default TwitterComments
