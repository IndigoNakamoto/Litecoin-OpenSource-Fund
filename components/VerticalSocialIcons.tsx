import React from 'react'
import FacebookIcon from '@/components/social-icons-mobile/facebook.svg'
import GithubIcon from '@/components/social-icons-mobile/github.svg'
import TwitterIcon from '@/components/social-icons-mobile/twitter.svg'
import RedditIcon from '@/components/social-icons-mobile/reddit.svg'

interface VerticalSocialIconsProps {
  topOffset?: string
}

const VerticalSocialIcons: React.FC<VerticalSocialIconsProps> = ({
  topOffset = '47%',
}) => {
  return (
    <div
      className="fixed right-0 z-50 transform space-x-16" // Adjust the gap here
      style={{ top: topOffset, transform: 'translateY(-50%)' }}
    >
      <a
        href="https://x.com/ltcfoundation"
        target="_blank"
        rel="noopener noreferrer"
      >
        <TwitterIcon className="h-[26px] w-[26px]" />
      </a>
      <a
        href="https://reddit.com/r/litecoin"
        target="_blank"
        rel="noopener noreferrer"
      >
        <RedditIcon className="h-[26px] w-[26px]" />
      </a>
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <FacebookIcon className="h-[26px] w-[26px]" />
      </a>
      <a
        href="https://github.com/litecoin"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GithubIcon className="h-[26px] w-[26px]" />
      </a>
    </div>
  )
}

export default VerticalSocialIcons
