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
        className="ml-1 mr-1 flex items-center rounded-lg bg-blue-500 px-4 py-1 hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-300"
        role="button"
        tabIndex={0}
        onClick={onToggleNav}
        onKeyPress={onToggleNav}
        aria-label="Toggle Menu"
      >
        <span className="mr-2 font-semibold text-gray-100 dark:text-gray-800">
          Menu
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-8 w-8 text-gray-100 dark:text-gray-800"
        >
          <path d="M3 4.5h14v1H3zM3 9.5h14v1H3zM3 14.5h14v1H3z" />
        </svg>
      </div>

      <div
        className={`fixed bottom-2 right-2 top-2 z-10 transform  rounded-xl backdrop-blur-lg duration-200 ease-in xs:w-full sm:w-1/2 md:clear-left md:w-1/3 ${
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
                  className="text-3xl font-semibold tracking-widest text-gray-100 hover:text-blue-400 dark:text-gray-100 dark:hover:text-blue-400"
                  onClick={onToggleNav}
                >
                  {link.title}
                </Link>
              </div>
            ))}
          </nav>
          <div className="mt-10 flex flex-col">
            {/* Social Icons */}
            <div className="flex h-full space-x-4 px-12">
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
              <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} />
              <SocialIcon
                kind="linkedin"
                href={siteMetadata.linkedin}
                size={6}
              />
              <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
            </div>
            {/* Footer */}
            <div className=" ml-12 mt-12 flex flex-col text-xl text-gray-100 ">
              <Link
                href="/grant-policy"
                className="hover:text-blue-400"
                onClick={onToggleNav}
              >
                Grant Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-blue-400"
                onClick={onToggleNav}
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="hover:text-blue-400"
                onClick={onToggleNav}
              >
                Privacy
              </Link>
            </div>
            <div className="absolute bottom-10 mt-12 flex flex w-full flex-col items-center justify-center">
              <div className="lg:text-md mb-2  flex text-sm text-gray-100 dark:text-gray-400 md:space-x-1.5 lg:space-x-2">
                <div className="flex space-x-0.5">
                  <div>{`© ${new Date().getFullYear()}`}</div>
                  <div>{siteMetadata.author}</div>
                  <div>{`© ${new Date().getFullYear()}`}</div>
                  <div>OpenSats</div>
                </div>

                <div className="flex space-x-0.5"></div>
              </div>
              <div className="space-x-4 text-center text-xs text-gray-100 dark:text-gray-400">
                Litecoin Foundation, Inc. Singapore (UEN: 201709179W) is a
                non-profit organization.
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileNav
