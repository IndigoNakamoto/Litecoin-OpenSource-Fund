import { NewsletterAPI } from 'pliny/newsletter'
import siteMetadata from '@/data/siteMetadata'

if (!siteMetadata.newsletter) {
  throw new Error('Newsletter configuration is missing in siteMetadata.')
}

export default NewsletterAPI({
  provider: siteMetadata.newsletter.provider,
})

// export default async function auth(req: NextApiRequest, res: NextApiResponse) {
//   // Do whatever you want here, before the request is passed down
//   return await NewsletterAPI(req, res, {
//     provider: ...
//   })
// }
