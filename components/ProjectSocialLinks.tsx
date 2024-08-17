import SocialIcon from './social-icons'

const formatLinkText = (kind, url) => {
  if (!url) {
    return '' // Return an empty string if the URL is undefined or null
  }

  // Normalize the URL by stripping out protocol and www
  const normalizedUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '')

  switch (kind) {
    case 'website':
      return normalizedUrl // Return the normalized URL directly
    case 'github':
      return 'Github'
    case 'x':
    case 'telegram':
      return `@${normalizedUrl.split('/').pop()}` // Extract the last part of the URL and prepend '@'
    case 'discord':
      return 'Discord' // Just returns "Discord"
    case 'facebook':
      return normalizedUrl.split('/').pop() // Extract the last part of the URL
    case 'reddit':
      return `/r/${normalizedUrl.split('/').pop()}` // Extract the last part of the URL and prepend "/r/"
    default:
      return normalizedUrl
  }
}

const ProjectSocialLinks = ({
  website,
  gitRepository,
  twitterHandle,
  discordLink,
  telegramLink,
  facebookLink,
  redditLink,
}) => {
  const projectLinks = [
    {
      kind: 'website',
      url: website, // https://www.litecoin.com/ => <ICON> www.litecoin.com
    },
    {
      kind: 'github',
      url: gitRepository, // https://www.x.com/LTCFoundation => <ICON> @LTCFoundation
    },
    {
      kind: 'x',
      url: twitterHandle, // https://www.x.com/LTCFoundation => <ICON> @LTCFoundation
    },
    {
      kind: 'discord',
      url: discordLink, // https://discord.gg/As4DKfgP => <ICON> Discord
    },
    {
      kind: 'telegram',
      url: telegramLink, // https://t.me/LTCFoundation => <ICON> @LTCFoundation
    },
    {
      kind: 'facebook',
      url: facebookLink, // https://www.facebook.com/litecoin => <ICON> litecoin
    },
    {
      kind: 'reddit',
      url: redditLink, // https://www.reddit.com/r/litecoin => <ICON> /r/litecoin
    },
  ]

  return (
    <div className="flex flex-col space-x-1 p-2 px-6 ">
      <p className="font-semibold text-gray-800">LINKS:</p>
      {projectLinks.map((link) => (
        <a
          className="text-sm text-[#222222] transition "
          target="_blank"
          rel="noopener noreferrer"
          key={link.kind}
          href={link.url}
        >
          <div className="transistion 500ms flex flex-row items-center space-x-2 rounded-xl  px-2 transition-colors duration-200 hover:text-white">
            <SocialIcon kind={link.kind} href={link.url} size={2} />
            <p>{formatLinkText(link.kind, link.url)}</p>
          </div>
        </a>
      ))}
    </div>
  )
}

export default ProjectSocialLinks
