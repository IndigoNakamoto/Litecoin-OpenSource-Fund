// pages/donate.tsx

import { useRouter } from 'next/router'
import DonateSection from '@/components/DonateSection'
import SectionProjects from '@/components/SectionProjects'
import { PageSEO } from '@/components/SEO'
import PaymentForm from '@/components/PaymentForm'
import { ProjectCategory } from 'utils/types'
import React, { useEffect, useState } from 'react'
import { useDonation } from '../contexts/DonationContext'
import CompletedProjects from '@/components/CompletedProjects'

export default function Donate() {
  const { dispatch } = useDonation()
  const router = useRouter()
  const { reset } = router.query

  const [widgetSnippet, setWidgetSnippet] = useState('')
  const [widgetError, setWidgetError] = useState('')
  const [showDAF, setShowDAF] = useState(false) // State to manage DAF section visibility

  // Handler to toggle DAF section visibility
  const handleDAFClick = () => {
    setShowDAF(true)
    // Optionally, scroll to the DAF section
    setTimeout(() => {
      const dafSection = document.getElementById('daf-section')
      if (dafSection) {
        dafSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

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
        title="Donate to Litecoin Foundation | Support Cryptocurrency Innovation"
        description="Support the Litecoin Foundation by making a donation. Your contribution helps advance Litecoin adoption, development, and community initiatives. Donate securely today."
        // keywords="Litecoin, Donate, Cryptocurrency, Support, Foundation, Blockchain"
      />
      <DonateSection title="">
        <div className="mx-auto flex w-full flex-col items-center justify-between xl:flex-row xl:items-start ">
          <div className="max-w-[600px] flex-1 pr-0 xl:pr-6">
            <h1 className="font-space-grotesk text-4xl font-bold text-[#222222]">
              Support the Future of Litecoin: Donate Today
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

        {/* Matching Donations Section */}
        <section className="mt-16 w-full rounded-lg bg-[#f9f9f9] p-8 shadow-md">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#222222]">
              Double Your Impact with Charlie Lee’s Matching Donations!
            </h2>
            <p className="mb-6 text-lg text-[#333333]">
              In an exciting announcement at the Litecoin Summit in Nashville,
              Charlie Lee has pledged to match donations up to{' '}
              <strong>$250,000 annually</strong> for the next five years,
              totaling <strong>$1.25 million</strong>! This means your donation
              will have double the impact.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
              <div className="flex-1">
                <h3 className="mb-2 text-2xl font-semibold text-[#222222]">
                  Allocation of Funds:
                </h3>
                <ul className="list-inside list-disc text-lg text-[#555555]">
                  <li>
                    <strong>$50,000</strong> dedicated to the Lite.Space
                    development platform and bounty program.
                  </li>
                  <li>
                    <strong>$200,000</strong> for direct support of the Litecoin
                    Foundation.
                  </li>
                </ul>
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-2xl font-semibold text-[#222222]">
                  Why It Matters:
                </h3>
                <p className="text-lg text-[#555555]">
                  "Because Litecoin was launched fairly, as you all know, we
                  didn’t print money for ourselves. So because of that the
                  Litecoin Foundation is very lean. Most projects that come to
                  us we have to turn down because we don’t have the funding. I
                  want to change that." - <em>Charlie Lee</em>
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-[#777777]">
              *Charlie Lee will match your donations dollar for dollar up to the
              specified amounts each year.
            </p>
          </div>
        </section>
        {/* End of Matching Donations Section */}
      </DonateSection>
      <SectionProjects>
        <div className="min-w-full p-8">
          <CompletedProjects />
        </div>
      </SectionProjects>
      {/* <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex h-full w-screen max-w-full items-center bg-[#f2f2f2] bg-cover bg-center pb-8">
        <div className="min-w-full bg-green-50 px-32">
          <CompletedProjects />
        </div>
      </section> */}
    </>
  )
}
