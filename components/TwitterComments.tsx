// components/TwitterComments.tsx
import { useEffect, useState } from 'react'

const TwitterComments = ({ hashtag }) => {
  const [tweets, setTweets] = useState(null)

  useEffect(() => {
    // Fetch tweets from your backend or a service
    fetch(`/api/getTweets?hashtag=${hashtag}`)
      .then((response) => response.json())
      .then((data) => setTweets(data))
  }, [hashtag])

  return (
    <div>
      {tweets ? (
        tweets.map((tweet) => (
          <div key={tweet.id}>
            {/* Render your tweet data */}
            <p>{tweet.text}</p>
          </div>
        ))
      ) : (
        <p>Loading tweets...</p>
      )}
    </div>
  )
}

export default TwitterComments
