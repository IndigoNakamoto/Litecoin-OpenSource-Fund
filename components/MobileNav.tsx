import { useState } from 'react'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'
import SocialIcon from '@/components/social-icons-mobile'
import siteMetadata from '@/data/siteMetadata'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = 'auto'
      } else {
        // Prevent scrolling
        document.body.style.overflow = 'hidden'
      }
      return !status
    })
  }

  return (
    <div className="z-100 ">
      <div
        className="ml-1 mr-1 flex items-center rounded-3xl bg-blue-500 px-4 py-1 hover:bg-blue-400 dark:bg-blue-400 dark:hover:bg-blue-300"
        role="button"
        tabIndex={0}
        onClick={onToggleNav}
        onKeyPress={onToggleNav}
        aria-label="Toggle Menu"
      >
        <span className="mr-2 font-semibold text-white dark:text-gray-100">
          Menu
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-8 w-8 text-white dark:text-gray-100"
        >
          <path d="M3 4.5h14v1H3zM3 9.5h14v1H3zM3 14.5h14v1H3z" />
        </svg>
      </div>

      <div
        className={`fixed bottom-2 right-2 top-2 z-10 min-w-[400px] transform rounded-3xl backdrop-blur-3xl duration-200 ease-in xs:w-full sm:w-1/2 md:clear-left md:w-1/3 xl:min-w-[400px] ${
          navShow ? 'translate-x-0' : 'translate-x-[105%]'
        }`}
        style={{ backgroundColor: 'rgba(12, 12, 12, 0.65)' }} // Using RGBA to achieve 40% transparency on a dark background
      >
        {/* x button */}
        <div className="flex justify-end">
          <button
            className="mr-8 mt-4 h-8 w-8 rounded"
            aria-label="Toggle Menu"
            onClick={onToggleNav}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-8 w-8 text-gray-100"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div></div>
        </div>
        {/* links */}
        <div className="flex flex-col gap-x-6 ">
          <nav className="mt-8 h-full">
            {headerNavLinks.map((link) => (
              // hover:text-blue-400 is not working
              <div key={link.title} className="px-12 py-2">
                <Link
                  href={link.href}
                  className="text-3xl font-semibold tracking-widest text-gray-100 hover:text-blue-300 dark:text-gray-100 dark:hover:text-blue-300"
                  onClick={onToggleNav}
                >
                  {link.title}
                </Link>
              </div>
            ))}
          </nav>
          <div className="">
            <div className="absolute bottom-12 mt-12 flex w-full flex-col ">
              {/* Social Icons */}
              <div className="flex space-x-4 px-12">
                <SocialIcon
                  kind="mail"
                  href={`mailto:${siteMetadata.email}`}
                  size={6}
                />
                <SocialIcon kind="github" href={siteMetadata.github} size={6} />
                <SocialIcon
                  kind="facebook"
                  href={siteMetadata.facebook}
                  size={6}
                />
                <SocialIcon
                  kind="youtube"
                  href={siteMetadata.youtube}
                  size={6}
                />
                <SocialIcon
                  kind="linkedin"
                  href={siteMetadata.linkedin}
                  size={6}
                />
                <SocialIcon kind="x" href={siteMetadata.twitter} size={6} />
              </div>
              {/* Footer */}
              <div className=" ml-12 mt-12 flex flex-col space-y-2 text-xl text-gray-100 ">
                <Link
                  href="/grant-policy"
                  className="hover:text-blue-200"
                  onClick={onToggleNav}
                >
                  Grant Policy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-blue-200"
                  onClick={onToggleNav}
                >
                  Terms
                </Link>
                <Link
                  href="/privacy"
                  className="hover:text-blue-200"
                  onClick={onToggleNav}
                >
                  Privacy
                </Link>
              </div>
              <div className="ml-12 mt-12 text-xs text-gray-100 dark:text-gray-400">
                <div className="flex flex-row space-x-1">
                  <div>{`© ${new Date().getFullYear()}`}</div>
                  <div>{siteMetadata.author}</div>
                  <div>|</div>
                  <div>{`© ${new Date().getFullYear()}`}</div>
                  <div>OpenSats</div>
                </div>
              </div>
              <div className="ml-12 text-xs text-gray-100 dark:text-gray-400">
                Litecoin Foundation, Inc. Singapore (UEN: 201709179W) is a
                non-profit organization.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileNav
