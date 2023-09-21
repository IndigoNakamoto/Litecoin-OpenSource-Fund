// pages/api/btcpay.ts
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CURRENCY, MIN_AMOUNT } from '../../config'
import { fetchPostJSONAuthed } from '../../utils/api-helpers'
import { PayReq, ProjectItem } from '../../utils/types'
import { getPostBySlug } from '../../utils/md'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { amount, project_slug, email, name, twitter }: PayReq = req.body
    const REDIRECT = 'http://lite.space/thankyou'
    const username = process.env.BTCPAY_USERNAME
    const password = process.env.BTCPAY_PASSWORD

    const base64Credentials = Buffer.from(username + ':' + password).toString(
      'base64'
    )

    const auth = `Basic ${base64Credentials}`

    try {
      // Validate the amount that was passed from the client.
      if (amount != null && amount < MIN_AMOUNT) {
        throw new Error('Invalid amount.')
      }
      if (!project_slug) {
        throw new Error('Invalid project.')
      }

      let project: ProjectItem
      try {
        project = getPostBySlug(project_slug, true)
      } catch {
        throw new Error('Invalid project.')
      }
      const reqData = {
        currency: CURRENCY,
        metadata: {
          orderId: project_slug,
          project_name: project.title,
          buyerName: name || 'anonymous',
          buyerEmail: email || null,
          buyerTwitter: twitter || null,
          posData: {
            orderId: project_slug,

            project_name: project.title,
            buyerName: name || 'anonymous',
            buyerEmail: email || null,
            buyerTwitter: twitter || null,
          },
        },
        checkout: { redirectURL: REDIRECT },
      }

      if (amount) {
        Object.assign(reqData, { amount })
      }

      const data = await fetchPostJSONAuthed(
        `${process.env.BTCPAY_URL}/stores/${process.env.BTCPAY_STORE_ID}/invoices`,
        auth,
        reqData
      )

      res.status(200).json(data)
    } catch (err) {
      console.log(err)
      res.status(500).json({ statusCode: 500, message: (err as Error).message })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
