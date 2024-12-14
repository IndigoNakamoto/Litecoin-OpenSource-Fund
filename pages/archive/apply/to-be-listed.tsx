import WebsiteApplicationForm from '@/components/WebsiteApplicationForm'
// import PageSection from '@/components/PageSection'
import ApplySection from '@/components/ApplySection'
import { PageSEO } from '@/components/SEO'
import React from 'react'
// import CustomLink from '@/components/Link'

export default function Apply() {
  return (
    <>
      <PageSEO
        title="Lite.Space | FOSS Listing"
        description="Litecoin Foundation Grants: Apply for Funding & Support Open-Source Projects. Learn criteria, grant types, and get listed on Lite.Space. Enhance the Litecoin ecosystem globally."
      />
      <ApplySection title="Apply to be Listed">
        <div className="my-8 mt-10 xs:my-4">
          <p className="">
            The information collected below will be used in order to vet your
            project. If approved, Lite.Space will create a project page on our
            website where visitors can learn more about your project and donate
            if they choose to.{' '}
            <strong>Your project will be listed for one year.</strong> After one
            year, you will be prompted to re-send your application should you
            wish to be listed again.
          </p>
          <p>
            If your project is selected to be listed, we will reach out with any
            additional information necessary to ensure you are able to receive
            donation payouts. This may include tax related information depending
            on your location, litecoin addresses or similar payment information
            that is required to receive donation payouts from Lite.Space.
          </p>
          <WebsiteApplicationForm />
        </div>
      </ApplySection>
    </>
  )
}
