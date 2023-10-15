import { useRouter } from 'next/router'
import SocialIcon from './social-icons'

const SocialMediaShare = ({ title, summary }) => {
  const router = useRouter()
  const currentURL = 'https://www.lite.space' + router.asPath
  console.log('currentURL: ', currentURL)
  const shareLinks = [
    {
      kind: 'twitter',
      url: `http://preview.lite.space/${router.asPath}`,
    },
    {
      kind: 'facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${currentURL}`,
    },
    {
      kind: 'linkedin',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${currentURL}&title=${title}&summary=${summary}&source=litespace`,
    },
    // Add more social links as needed.
  ]

  return (
    <div className="mt-4 flex space-x-4">
      {shareLinks.map((link) => (
        <SocialIcon key={link.kind} kind={link.kind} href={link.url} size={5} />
      ))}
    </div>
  )
}

export default SocialMediaShare
