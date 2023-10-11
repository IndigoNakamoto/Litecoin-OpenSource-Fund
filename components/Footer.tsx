import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer>
      <div className="z-9 flex h-32 flex-col items-center">
        <div className="my-3 flex space-x-5">
          <SocialIcon
            kind="mail"
            href={`mailto:${siteMetadata.email}`}
            size={6}
          />
          <SocialIcon kind="github" href={siteMetadata.github} size={6} />
          <SocialIcon kind="facebook" href={siteMetadata.facebook} size={6} />
          <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
        </div>
        <div className="lg:text-md mb-2  flex text-sm text-gray-500 dark:text-gray-400 md:space-x-1.5 lg:space-x-2">
          <div className="flex space-x-0.5">
            <div>{`© ${new Date().getFullYear()}`}</div>
            <div>{siteMetadata.author}</div>
          </div>
          <div>-</div>
          <div className="flex space-x-0.5">
            <div>{`© ${new Date().getFullYear()}`}</div>
            <div>OpenSats</div>
          </div>
          <div>-</div>
          <Link href="/terms">Terms</Link>
          <div>-</div>
          <Link href="/privacy">Privacy</Link>
        </div>
        <div className="space-x-4 text-center text-xs text-gray-500 dark:text-gray-400">
          Litecoin Foundation, Inc. Singapore (UEN: 201709179W) is a non-profit
          organization.
          <br />
        </div>
      </div>
    </footer>
  )
}
