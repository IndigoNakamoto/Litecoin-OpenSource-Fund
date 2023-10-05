import '@/css/tailwind.css'
import '@/css/prism.css'
import 'katex/dist/katex.css'
// import '@/css/docsearch.css' // Uncomment if using algolia docsearch
// import '@docsearch/css' // Uncomment if using algolia docsearch
import 'styles/globals.css'

import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react' // <-- Import here

import siteMetadata from '@/data/siteMetadata'
import { Analytics } from 'pliny/analytics'
import { SearchProvider } from 'pliny/search'
import LayoutWrapper from '@/components/LayoutWrapper'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      <SessionProvider session={session}>
        {' '}
        {/* <-- Wrap your components here */}
        <Head>
          <meta content="width=device-width, initial-scale=1" name="viewport" />
        </Head>
        <Analytics analyticsConfig={siteMetadata.analytics} />
        <LayoutWrapper>
          {/* @ts-ignore */}
          <SearchProvider searchConfig={siteMetadata.search}>
            <Component {...pageProps} />
          </SearchProvider>
        </LayoutWrapper>
      </SessionProvider>{' '}
      {/* <-- Close the wrapper here */}
    </ThemeProvider>
  )
}
