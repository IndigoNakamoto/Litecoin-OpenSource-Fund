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
    <header className="z-9 flex items-center justify-between py-6 font-barlow-semi-condensed text-gray-800 dark:text-gray-200">
      <div>
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex h-12 items-center ">
            <div className="">
              <Logo className="mr-2 h-14" />
            </div>

            <div className="text-2xl font-semibold sm:block">
              <span style={{ display: 'block' }}>Lite</span>
              <span
                className=" text-blue-500"
                style={{ display: 'block', marginTop: '-0.35em' }}
              >
                .Space
              </span>
            </div>
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
