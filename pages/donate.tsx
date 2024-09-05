import DonateSection from '@/components/DonateSection'
import { PageSEO } from '@/components/SEO'
import React from 'react'

export default function Apply() {
  return (
    <>
      <PageSEO
        title="Litecoin.com | Donate"
        description="Submit your project to Litecoin.com for community crowdfunding and support. Join the Litecoin ecosystem and get your project listed today."
      />
      <DonateSection title="">
        <div className="mt-10 max-w-xl space-y-8">
          <h2>Why Donate to Litecoin Foundation?</h2>
          <p>
            Litecoin Foundation Inc. is a 501(c)(3) nonprofit organization whose
            mission is to promote the adoption, awareness & development of
            Litecoin & its ecosystem.
          </p>
          <p>
            Since Litecoin is a fairly launched, decentralized cryptocurrency,
            Litecoin Foundation’s primary source of financial support is through
            individual donations. Your contribution helps Litecoin Foundation
            continue to fund research and development, education, community
            support, partnerships and advocacy related to Litecoin,
            cryptocurrency and financial privacy.
          </p>
        </div>
      </DonateSection>
    </>
  )
}
