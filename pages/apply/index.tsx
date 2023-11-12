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
        <div className="my-8 xs:my-4">
          <p>
            The Litecoin Foundation Lite.space Council offers grants for
            innovative open-source projects that enhance the Litecoin ecosystem.
            Projects that develop new Litecoin software, improve existing FOSS
            relevant to Litecoin, promote Litecoin education and outreach, or
            conduct Litecoin-related research are eligible.
          </p>
          <p>
            We aim to foster a more accessible, robust, secure, and
            decentralized Litecoin network through these grants. Applications
            should be clear, concise, and provide detailed yet brief
            information.
          </p>

          <h1>Programs</h1>

          <h3 className="mb-4 text-xl font-bold leading-normal md:text-2xl">
            Lite.Space Website Listing
          </h3>
          <p className="mb-8">
            Apply to feature your project on our website, attracting potential
            donor support.
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
            Quarterly grants from the Lite.Space General Fund, supporting
            impactful Litecoin ecosystem projects.
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
            Dedicated to vital Litecoin framework projects, focusing on ongoing
            development and maintenance.
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
