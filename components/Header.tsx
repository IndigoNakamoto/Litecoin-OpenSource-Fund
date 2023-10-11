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
    <header className="z-9 flex items-center justify-between py-6">
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
        {/* <div className="block">
          {headerNavLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className={
                link.isButton
                  ? 'rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-500 hover:border-transparent hover:bg-blue-500 hover:text-white'
                  : `mr-[-0.5] hidden p-2 font-medium ${
                      router.pathname === link.href
                        ? 'font-bold'
                        : 'text-gray-900'
                    } hover:text-blue-500 dark:text-gray-100 dark:hover:text-blue-400 sm:p-3 md:inline-block`
              }
            >
              {link.title}
            </Link>
          ))}
        </div> */}
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
