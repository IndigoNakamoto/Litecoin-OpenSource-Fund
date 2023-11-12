import React from 'react'
import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import { InferGetStaticPropsType } from 'next'
import { allPages } from 'contentlayer/generated'
import ApplySection from '@/components/ApplySection'

export const getStaticProps = async () => {
  const apply = allPages.find((p) => p.slug === 'apply')
  return { props: { apply } }
}

// Reusable Component for Grant Section
const GrantSection = ({ title, description, link, linkText }) => (
  <>
    <h3 className="mb-4 text-xl font-bold leading-normal md:text-2xl">
      {title}
    </h3>
    <p className="mb-8">{description}</p>
    <Link
      href={link}
      className="rounded-full bg-blue-500 px-4 py-2 font-semibold no-underline transition duration-300 hover:bg-blue-400"
    >
      {linkText}
    </Link>
  </>
)

export default function Apply({
  apply,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSEO
        title="Lite.Space | Apply"
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
        <div className="my-8 xs:my-4 ">
          <p className="text-xl">
            The Litecoin Foundation Lite.Space Council offers grants for
            innovative open-source projects that enhance the Litecoin ecosystem.
            Projects that develop new Litecoin software, improve existing FOSS
            relevant to Litecoin, promote Litecoin education and outreach, or
            conduct Litecoin-related research are eligible.
          </p>
          <p className="text-xl">
            We aim to foster a more accessible, robust, secure, and
            decentralized Litecoin network through these grants. Applications
            should be clear, concise, and provide detailed yet brief
            information.
          </p>

          <h1>Programs</h1>

          <GrantSection
            title="Lite.Space Website Listing"
            description="Apply to feature your project on our website, attracting potential donor support."
            link="/apply/to-be-listed"
            linkText="List Your FOSS Project with Lite.Space"
          />
          <GrantSection
            title="General Grants"
            description="Quarterly grants from the Lite.Space General Fund, supporting impactful Litecoin ecosystem projects."
            link="/apply/grant"
            linkText="Apply for a Lite.Space General Grant"
          />
          <GrantSection
            title="Long-Term Support Grants"
            description="Dedicated to vital Litecoin framework projects, focusing on ongoing development and maintenance."
            link="/apply/lts"
            linkText="Apply for a Long-Term Support Grant from Lite.Space"
          />
        </div>
      </ApplySection>
    </>
  )
}
