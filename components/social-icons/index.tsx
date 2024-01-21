//components/social-icons/index.tsx
import Mail from './mail.svg'
import Github from './github.svg'
import Facebook from './facebook.svg'
import Youtube from './youtube.svg'
import Linkedin from './linkedin.svg'
import Twitter from './twitter.svg'
import Nostr from './nostr.svg'
import X from './x.svg'
import Reddit from './reddit.svg'
import Telegram from './telegram.svg'
import Globe from './globe.svg'
import Discord from './discord.svg'

// Icons taken from: https://simpleicons.org/
// and from: https://www.flaticon.com/icon-fonts-most-downloaded

const components = {
  mail: Mail,
  github: Github,
  discord: Discord,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  nostr: Nostr,
  x: X,
  reddit: Reddit,
  telegram: Telegram,
  website: Globe,
}

const SocialIcon = ({ kind, href, size = 8 }) => {
  if (
    !href ||
    (kind === 'mail' &&
      !/^mailto:\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(href))
  )
    return null

  const SocialSvg = components[kind]

  const padding = 8

  return (
    <a
      className="text-sm text-gray-500 transition hover:text-gray-600"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      <span className="sr-only">{kind}</span>
      <div
        className={`group flex h-${padding} w-${padding} items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white dark:hover:bg-gray-800`}
      >
        <SocialSvg
          className={` fill-current h-${6} w-${6} text-gray-700 transition-colors duration-200 group-hover:text-blue-300 dark:text-gray-200`}
        />
      </div>
    </a>
  )
}

export default SocialIcon
