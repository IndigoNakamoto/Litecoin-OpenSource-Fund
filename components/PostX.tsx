import React from 'react'
import { Tweet } from 'react-tweet'

function PostX({ tweetId }) {
  return (
    <div data-theme="light">
      <Tweet id={tweetId} />
    </div>
  )
}

export default PostX
