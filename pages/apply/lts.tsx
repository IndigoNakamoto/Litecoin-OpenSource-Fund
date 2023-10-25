import ApplySection from '@/components/ApplySection'
import LTSApplicationForm from '@/components/LTSApplicationForm'
import React from 'react'
// import Link from '@/components/Link'
// import CustomLink from '@/components/Link'

export default function Apply() {
  return (
    <ApplySection title="Lite.Space Long Term Support">
      <div className="my-8 mt-10 xs:my-4">
        <p>
          The Litecoin Foundation, Inc. in Singapore operates as a public
          charity with a primary goal of funding Litecoin-centered free and
          open-source projects alongside educational and research initiatives.
        </p>

        <h3>Our Vision</h3>
        <p>
          We aspire to foster a sustainable ecosystem that provides consistent
          support to contributors to Litecoin and Free and Open Source Software
          (FOSS) tools. Our ambition is to ensure that innovative projects
          within the Litecoin community receive the necessary resources to
          flourish and contribute to the public's access to Litecoin
          infrastructure.
        </p>

        <h4>Application Criteria</h4>
        <p>
          If you are a developer or a project initiator keen on contributing to
          the Litecoin community or associated FOSS tools, we welcome you to
          apply for support through Lite.Space.
        </p>
        <ul>
          <li>
            Demonstrable contributions to Litecoin or associated FOSS projects.
          </li>
          <li>
            Commitment to transparency, accountability, and public progress
            updates.
          </li>
          <li>
            Ability to work independently and thrive in an open-source
            environment.
          </li>
          <li>Collaborative approach towards users and other contributors.</li>
        </ul>
        <p>
          If you believe in our vision and have a project in mind, apply below!
        </p>
        <LTSApplicationForm />
      </div>
    </ApplySection>
  )
}
