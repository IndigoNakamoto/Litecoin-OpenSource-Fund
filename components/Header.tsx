import siteMetadata from '@/data/siteMetadata'
// import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import React from 'react'
// import { useRouter } from 'next/router' // <- Import useRouter hook

const Header = () => {
  // const router = useRouter() // <- Get the router object

  return (
    <header className="z-9 flex items-center justify-between py-0 font-barlow-semi-condensed text-gray-800 dark:text-gray-200">
      <div className="pt-2">
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center">
            <div className="mr-3">
              <Logo className="h-20" />
            </div>
            {typeof siteMetadata.headerTitle === 'string' ? (
              <div className="hidden h-9 text-3xl font-semibold sm:block">
                {siteMetadata.headerTitle}
              </div>
            ) : (
              siteMetadata.headerTitle
            )}
          </div>
        </Link>
      </div>
      <div className="flex items-center text-base leading-5">
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
