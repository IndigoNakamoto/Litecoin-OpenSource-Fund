// components/PostsList.tsx

import React from 'react'
import PostX from './PostX'
import PostYouTube from './PostYouTube'
import { extractYouTubeID, extractXPostID } from '../utils/extractIds' // Adjust the import path as needed

interface Post {
  id: string
  fieldData: {
    link: string
    name: string
  }
  // ... other fields if necessary
}

interface PostsListProps {
  posts: Post[]
}

const PostsList: React.FC<PostsListProps> = ({ posts }) => {
  return (
    <div className="posts-list">
      <h1>Posts</h1>
      {posts.map((post) => {
        const { id, fieldData } = post
        const { link, name } = fieldData

        if (!link) {
          // Skip if there's no link
          return null
        }

        // Determine the type of link and extract the relevant ID
        let YouTubeID: string | null = null
        let XPostID: string | null = null

        if (link.includes('youtube.com') || link.includes('youtu.be')) {
          YouTubeID = extractYouTubeID(link)
        } else if (link.includes('x.com') || link.includes('twitter.com')) {
          XPostID = extractXPostID(link)
        }

        // Render based on the extracted ID
        if (YouTubeID) {
          return (
            <div key={id} className="post-item">
              <PostYouTube YouTubeID={YouTubeID} />
            </div>
          )
        } else if (XPostID) {
          return (
            <div key={id} className="post-item">
              <PostX XPostID={XPostID} />
            </div>
          )
        } else {
          // Optionally handle other types of links or content
          return (
            <div key={id} className="post-item">
              <a href={link} target="_blank" rel="noopener noreferrer">
                {name}
              </a>
            </div>
          )
        }
      })}
    </div>
  )
}

export default PostsList
