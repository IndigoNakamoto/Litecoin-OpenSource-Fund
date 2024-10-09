import React from 'react'
import PostX from './PostX'
import PostYouTube from './PostYouTube'

function PostsList() {
  return (
    <div className="markdown">
      <h1>PostsList</h1>
      <PostX
        tweetId={[
          '1764101413356052870',
          '1711124576715915586',
          '1710990765566951919',
          '1710628331912081468',
          '1710265897728823479',
          '1710089856825581982',
          '1710066625049669766',
          '1709931002460807392',
          '1709903463658787068',
          '1709616221459718440',
          '1709589816398995744',
          '1711200405814702257',
          '1709541029681012871',
          '1709178595606745364',
        ]}
      />
      <PostYouTube youtubeLink="nSLBvAOlhKc" />
    </div>
  )
}

export default PostsList
