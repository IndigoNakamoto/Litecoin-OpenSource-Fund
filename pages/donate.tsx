// pages/donate.tsx

import { useRouter } from 'next/router'
import DonateSection from '@/components/DonateSection'
import { PageSEO } from '@/components/SEO'
import PaymentForm from '@/components/PaymentForm'
import { ProjectCategory } from 'utils/types'
import React, { useEffect, useState } from 'react'
import { useDonation } from '../contexts/DonationContext'

export default function Donate() {
  const { dispatch } = useDonation()
  const router = useRouter()
  const { reset } = router.query

  const [widgetSnippet, setWidgetSnippet] = useState('')
  const [widgetError, setWidgetError] = useState('')

  useEffect(() => {
    if (reset === 'true') {
      dispatch({ type: 'RESET_DONATION_STATE' })
      // Optionally, remove the reset parameter from the URL
      const newPath = router.pathname
      const newQuery = { ...router.query }
      delete newQuery.reset
      router.replace(
        {
          pathname: newPath,
          query: newQuery,
        },
        undefined,
        { shallow: true }
      )
    }
  }, [dispatch, reset, router])

  useEffect(() => {
    // Fetch the widget snippet from the API
    const fetchWidgetSnippet = async () => {
      try {
        const res = await fetch('/api/getWidgetSnippet')
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(
            `HTTP error! status: ${res.status} - ${
              errorData.error || res.statusText
            }`
          )
        }
        const data = await res.json()

        // The response contains 'popup', 'script', and 'iframe' options
        // We'll use the 'popup' option
        setWidgetSnippet(data.popup)

        // Parse and execute the script manually
        const parser = new DOMParser()
        const doc = parser.parseFromString(data.popup, 'text/html')
        const script = doc.querySelector('script')

        if (script) {
          const newScript = document.createElement('script')
          newScript.id = script.id
          newScript.innerHTML = script.innerHTML
          document.body.appendChild(newScript)
        }
      } catch (error) {
        console.error('Failed to fetch widget snippet:', error)
        setWidgetError(error.message)
      }
    }

    fetchWidgetSnippet()
  }, [])

  return (
    <>
      <PageSEO
        title="Litecoin.com | Donate"
        description="Submit your project to Litecoin.com for community crowdfunding and support. Join the Litecoin ecosystem and get your project listed today."
      />
      <DonateSection title="">
        <div className="mx-auto flex w-full flex-col items-center justify-between xl:flex-row xl:items-start ">
          <div className="max-w-[600px] flex-1 pr-0 xl:pr-6">
            <h1 className="font-space-grotesk text-4xl font-bold text-[#222222]">
              Why Donate to Litecoin Foundation?
            </h1>
            <p className="mt-6 text-lg text-[#222222]">
              Litecoin Foundation Inc. is a 501(c)(3) nonprofit organization
              whose mission is to promote the adoption, awareness & development
              of Litecoin & its ecosystem.
            </p>
            <p className="mt-4 text-lg text-[#222222]">
              Since Litecoin is a fairly launched, decentralized cryptocurrency,
              Litecoin Foundation’s primary source of financial support is
              through individual donations. Your contribution helps Litecoin
              Foundation continue to fund research and development, education,
              community support, partnerships and advocacy related to Litecoin,
              cryptocurrency and financial privacy.
            </p>
            <p className="mt-4 text-lg text-[#222222]">
              We now accept donations through Donor-Advised Funds (DAF). To
              contribute via DAF, please click the button below.
            </p>
            {/* Render the widget snippet or display an error */}
            <div className="mt-6">
              {widgetError ? (
                <p className="text-red-500">
                  Failed to load donation widget: {widgetError}
                </p>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: widgetSnippet }} />
              )}
            </div>
          </div>
          <div className="mt-12 w-full max-w-[600px] flex-none rounded-2xl border border-[#222222] bg-gray-100 p-6 xl:mt-0">
            <PaymentForm
              project={{
                slug: 'ltcfoundation',
                title: 'Litecoin Foundation',
                summary: '',
                coverImage: '',
                telegramLink: '',
                redditLink: '',
                facebookLink: '',
                type: ProjectCategory.BOUNTY,
                isRecurring: false,
              }}
              modal={false}
            />
          </div>
        </div>
      </DonateSection>
    </>
  )
}
