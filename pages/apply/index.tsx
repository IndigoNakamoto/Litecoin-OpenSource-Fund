import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import { InferGetStaticPropsType } from 'next'
import { allPages } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { MDXComponents } from '@/components/MDXComponents'
import ApplySection from '@/components/ApplySection'
import React from 'react'

const DEFAULT_LAYOUT = 'ApplyLayout'

export const getStaticProps = async () => {
  const apply = allPages.find((p) => p.slug === 'apply')
  return { props: { apply } }
}

export default function Apply({
  apply,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSEO
        title="Apply to One of Lite.Spaces' Grant Programs"
        description="Litecoin Foundation Grants: Apply for Funding & Support Open-Source Projects. Learn criteria, grant types, and get listed on Lite.Space. Enhance the Litecoin ecosystem globally."
      />
      {/* {apply ? (
        <MDXLayoutRenderer
          layout={DEFAULT_LAYOUT}
          content={apply}
          MDXComponents={MDXComponents}
        />
      ) : (
        <h1>Content not found.</h1>
      )} */}

      <ApplySection title="Apply for a Grant" style="apply">
        <div className="my-8 xs:my-4">
          <p>
            The Litecoin Foundation FOSS Council is always on the lookout for
            new and innovative projects that align with our mission to support
            and maintain a sustainable ecosystem of funding for free and
            open-source projects, particularly those related to Litecoin.
          </p>
          <p>
            If you're working on an open-source project that could use some
            financial support, we'd love to hear from you. We provide grants to
            projects that:
          </p>
          <ul>
            <li>
              Contribute to the development of new Litecoin or Litecoin-adjacent
              software.
            </li>
            <li>
              Work on improving existing free and open-source software that is
              important to the Litecoin ecosystem.
            </li>
            <li>Promote education and outreach about Litecoin.</li>
            <li>Conduct research into Litecoin-related topics.</li>
          </ul>
          <p>
            Our goal is to help make Litecoin more accessible, robust, secure,
            and decentralized, and we believe that supporting open-source
            projects is one of the best ways to achieve this.
          </p>
          <h1>Our Programs</h1>
          <p>
            At Lite.Space, we are dedicated to ensuring a fair and unbiased
            grant selection process. We stand firmly against discrimination of
            any kind, be it based on race, creed, color, age, origin, ancestry,
            religion, gender, sexual preference, gender identity, disability,
            genetic background, veteran status, military service, or any other
            protected category by law.
          </p>
          <p>
            Applications must be clear, detailed, and brief. The ideal
            submission is a one-page document that thoroughly presents all the
            necessary details for a complete and informed evaluation.
          </p>
          <h3 className="mb-4 text-xl font-bold leading-normal md:text-2xl">
            Explore - Website Listing
          </h3>
          <p className="mb-8">
            FOSS projects that align with the Lite.Space ethos are encouraged to
            apply for a spot on our website. Donors can allocate their
            contributions to specific projects listed. If your initiative
            advances Litecoin and FOSS, we invite you to apply for visibility on
            our platform.
          </p>
          <Link
            href="/apply/to-be-listed"
            className="rounded  bg-blue-500 px-4 py-2 font-semibold no-underline hover:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            List Your FOSS Project with Lite.Space
          </Link>
          <h3 className="mb-4 text-xl font-bold leading-normal md:text-2xl">
            General Grants
          </h3>
          <p className="mb-8">
            The Lite.Space General Fund, replenished by generous donations,
            disburses grants on a quarterly basis. Our board meticulously
            reviews each application to award funds to the most impactful
            initiatives that propel the Litecoin ecosystem forward.
          </p>
          <Link
            href="/apply/grant"
            className="rounded  bg-blue-500 px-4 py-2 font-semibold no-underline hover:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Apply for a Lite.Space General Grant
          </Link>
          <h3 className="mb-4 text-xl font-bold leading-normal md:text-2xl">
            Long-Term Support Grants
          </h3>
          <p className="mb-8">
            For projects vital to the Litecoin framework, we offer a limited
            series of long-term support grants. These are specifically designed
            for the stewards of Litecoin Core and affiliated projects, ensuring
            ongoing development and maintenance.
          </p>
          <Link
            href="/apply/lts"
            className="rounded  bg-blue-500 px-4 py-2 font-semibold no-underline hover:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Apply for a Long-Term Support Grant from Lite.Space
          </Link>
        </div>
      </ApplySection>
    </>
  )
}
