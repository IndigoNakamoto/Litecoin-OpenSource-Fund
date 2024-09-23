// components/social-icons/index.tsx
import { FaLink, FaEnvelope, FaGlobe } from 'react-icons/fa' // FaEnvelope for mail icon
import {
  SiGithub,
  SiFacebook,
  SiYoutube,
  SiLinkedin,
  SiX,
  SiReddit,
  SiTelegram,
  SiDiscord,
} from 'react-icons/si'
import React from 'react'

// Icons taken from: https://react-icons.github.io/react-icons/

const components = {
  mail: FaEnvelope,
  github: SiGithub,
  discord: SiDiscord,
  facebook: SiFacebook,
  youtube: SiYoutube,
  linkedin: SiLinkedin,
  twitter: SiX, // Assuming SiX represents Twitter; replace if different
  nostr: null, // Nostr icon might not be available, handle separately if needed
  x: SiX,
  reddit: SiReddit,
  telegram: SiTelegram,
  website: FaGlobe,
  link: FaLink,
}

interface SocialIconProps {
  kind: string
  href: string
  size?: number
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void // Added onClick prop
}

const SocialIcon: React.FC<SocialIconProps> = ({
  kind,
  href,
  size = 8,
  onClick,
}) => {
  if (
    !href ||
    (kind === 'mail' &&
      !/^mailto:\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(href))
  )
    return null

  const IconComponent = components[kind]

  // Handle cases where the icon might not be available
  if (!IconComponent) return null

  const padding = 10

  return (
    <a
      className={`inline-block text-gray-600 transition-colors duration-300 hover:text-gray-900`} // Change color on hover
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      onClick={onClick} // Added onClick handler
    >
      <span className="sr-only">{kind}</span>
      <div
        className={`flex group-hover:text-white h-${padding} w-${padding} items-center justify-center rounded-lg transition-colors`}
      >
        <IconComponent
          className={`fill-current h-${6} w-${6} text-gray-700 transition-colors group-hover:text-gray-900`}
          size={size}
        />
      </div>
    </a>
  )
}

export default SocialIcon
