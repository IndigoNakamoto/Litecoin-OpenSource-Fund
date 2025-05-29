// components/SEOHead.tsx
import Head from 'next/head'

type SEOHeadProps = {
  title: string
  summary: string
  coverImage: string
}

const SEOHead: React.FC<SEOHeadProps> = ({ title, summary, coverImage }) => {
  const imageUrl = coverImage.startsWith('http')
    ? coverImage
    : `https://www.litecoin.com${coverImage}`

  return (
    <Head>
      <title>Litecoin | {title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={summary} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@LTCFoundation" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={summary} />
      <meta name="twitter:image" content={imageUrl} />
      <meta property="og:image" content={imageUrl} />
    </Head>
  )
}

export default SEOHead
