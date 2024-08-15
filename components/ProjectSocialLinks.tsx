import SocialIcon from './social-icons'

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
    <div className="flex w-min space-x-1 rounded-xl bg-blue-100 p-2 px-6 ">
      <p className="font-semibold text-gray-800 "> LINKS: </p>
      {projectLinks.map((link) => (
        <SocialIcon key={link.kind} kind={link.kind} href={link.url} size={5} />
      ))}
    </div>
  )
}

export default ProjectSocialLinks
