import DonateSection from '@/components/DonateSection'
import { PageSEO } from '@/components/SEO'
import PaymentForm from '@/components/PaymentForm'
import { ProjectCategory } from 'utils/types'
import React from 'react'

export default function Apply() {
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
          </div>
          <div className="mt-6 w-[600px] flex-none rounded-2xl border border-[#222222] bg-gray-100 p-6 xl:mt-0">
            <PaymentForm
              project={{
                slug: 'general',
                title: 'General',
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
