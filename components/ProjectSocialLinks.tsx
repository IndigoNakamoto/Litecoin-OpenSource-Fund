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
      url: website,
    },
    {
      kind: 'github',
      url: gitRepository,
    },
    {
      kind: 'x',
      url: twitterHandle,
    },
    {
      kind: 'discord',
      url: discordLink,
    },
    {
      kind: 'telegram',
      url: telegramLink,
    },
    {
      kind: 'facebook',
      url: facebookLink,
    },
    {
      kind: 'reddit',
      url: redditLink,
    },
  ]

  return (
    <div className="flex flex-col space-x-1 p-2 px-6">
      <p className="font-semibold text-gray-800">LINKS:</p>
      {projectLinks.map((link) => (
        <a
          className="text-sm text-[#222222] transition"
          target="_blank"
          rel="noopener noreferrer"
          key={link.kind}
          href={link.url}
        >
          <div className="group flex w-min flex-row items-center space-x-2 rounded-xl px-2  hover:text-white">
            <SocialIcon kind={link.kind} href={link.url} size={2} />
            <p className=" group-hover:text-white">
              {formatLinkText(link.kind, link.url)}
            </p>
          </div>
        </a>
      ))}
    </div>
  )
}

export default ProjectSocialLinks
