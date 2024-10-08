// next.config.js
const { withContentlayer } = require('next-contentlayer')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app https://js.dev.shift4.com https://widget.thegivingblock.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self' https://fonts.gstatic.com;
  frame-src giscus.app https://js.dev.shift4.com https://widget.thegivingblock.com;;
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    reactStrictMode: true,
    transpilePackages: ['react-tweet'],
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    // images: {
    //   domains: [
    //     'pbs.twimg.com',
    //     'abs.twimg.com',
    //     'static.tgb-preprod.com',
    //     'static.tgbwidget.com',
    //     'cdn.prod.website-files.com',
    //   ],
    // },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'pbs.twimg.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'abs.twimg.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'static.tgb-preprod.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'static.tgbwidget.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'cdn.prod.website-files.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'foss.litecoin.net',
          pathname: '/**',
        },
        // Add any additional domains if necessary
      ],
    },
    imageSizes: [64, 128, 256, 512],
    eslint: {
      dirs: ['pages', 'components', 'lib', 'layouts', 'scripts'],
    },
    async headers() {
      return [
        {
          source: '/api/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value:
                "default-src *; script-src * 'unsafe-inline'; connect-src *; img-src *; style-src * 'unsafe-inline';",
            },
            // Other headers you want to test with reduced restrictions
          ],
        },
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
      ]
    },
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      return config
    },
  })
}
