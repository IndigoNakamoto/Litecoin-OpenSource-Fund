// components/SEOHead.tsx
import Head from 'next/head'

type SEOHeadProps = {
  title: string
  summary: string
  coverImage: string
}

const SEOHead: React.FC<SEOHeadProps> = ({ title, summary, coverImage }) => (
  <Head>
    <title>Litecoin | {title}</title>
    <meta property="og:title" content={title} />
    <meta property="og:description" content={summary} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@LTCFoundation" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={summary} />
    <meta
      name="twitter:image"
      content={`https://www.litecoin.com${coverImage}`}
    />
    <meta
      property="og:image"
      content={`https://www.litecoin.com${coverImage}`}
    />
  </Head>
)

export default SEOHead
