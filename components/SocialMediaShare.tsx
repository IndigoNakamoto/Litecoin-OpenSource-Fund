import { useRouter } from 'next/router'
import SocialIcon from './social-icons'

const SocialMediaShare = ({ title, summary, className }) => {
  const router = useRouter()
  const currentURL = 'http://preview.lite.space' + router.asPath
  console.log('currentURL: ', currentURL)

  const shareLinks = [
    {
      kind: 'x',
      url: `https://twitter.com/intent/tweet?text=${summary}%0A%0A&url=${currentURL}%0A%0A&via=LTCFoundation`,
    },
    {
      kind: 'facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${currentURL}`,
    },
    // { kind: 'link', url: currentURL },
  ]

  return (
    <div className={className}>
      <p className="font-bold"> Share: </p>
      {shareLinks.map((link) => (
        <SocialIcon key={link.kind} kind={link.kind} href={link.url} size={5} />
      ))}
    </div>
  )
}

export default SocialMediaShare
