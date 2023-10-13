import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import React from 'react'
import { useRouter } from 'next/router' // <- Import useRouter hook

const Header = () => {
  const router = useRouter() // <- Get the router object

  return (
    <header className="z-9 flex items-center justify-between py-6 font-barlow-semi-condensed">
      <div>
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between">
            <div className="mr-3">
              <Logo />
            </div>
            {typeof siteMetadata.headerTitle === 'string' ? (
              <div className="hidden h-6 text-2xl font-semibold sm:block">
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
