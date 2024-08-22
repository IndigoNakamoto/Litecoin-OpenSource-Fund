import ProjectSubmissionForm from '@/components/ProjectSubmissionForm'
import ApplySection from '@/components/ApplySection'
// import Link from '@/components/Link'
// import CustomLink from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import React from 'react'

export default function Apply() {
  return (
    <>
      <PageSEO
        title="Litecoin.com | Submit Your Project"
        description="Submit your project to Litecoin.com for community crowdfunding and support. Join the Litecoin ecosystem and get your project listed today."
      />
      <ApplySection title="Submit a Project">
        <div className="my-auto mt-10 max-w-4xl space-y-8 xs:my-4">
          <p>
            Have a project that can benefit the Litecoin community? Use the form
            below to submit your project for consideration. Once approved, your
            project will be listed on Litecoin.com, where the community can help
            crowdfund and support your initiative.
          </p>
          <p>
            We will review the information you provide to ensure it aligns with
            our goals and values. If your project is selected, we'll reach out
            with any additional details needed to finalize your listing. This
            may include providing Litecoin addresses or other payment details to
            facilitate donations.
          </p>
          <ProjectSubmissionForm />
        </div>
      </ApplySection>
    </>
  )
}
