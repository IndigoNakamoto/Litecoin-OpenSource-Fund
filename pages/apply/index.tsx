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
      {apply ? (
        <MDXLayoutRenderer
          layout={DEFAULT_LAYOUT}
          content={apply}
          MDXComponents={MDXComponents}
        />
      ) : (
        <h1>Content not found.</h1>
      )}

      <ApplySection title="Our Programs" style="apply">
        <div className="my-8">
          <p>All our programs are open to applicants worldwide.</p>
          <p>
            Lite.Space does not discriminate in its grant selection process with
            applicants, whether internal or external, because of race, creed,
            color, age, national origin, ancestry, religion, gender, sexual
            orientation, gender identity, disability, genetic information,
            veteran status, military status, application for military service or
            any other class per local, state or federal law.
          </p>
          <p>
            Applications should be well written, informative, and concise. A
            great application will fit comfortably on one page while containing
            all information that is required to assess and judge the project or
            applicant.
          </p>
          <h3 className="mb-4 text-xl font-bold leading-normal md:text-2xl">
            Website Listing
          </h3>
          <p className="mb-8">
            Any FOSS project that is aligned with the Lite.Space mission is free
            to submit an application to be listed on the Lite.Space website.
            Donors may recommend their gifts be directed to specific projects on
            this list. If you are helping Litecoin and FOSS, please submit an
            application to be listed on our site.
          </p>
          <Link
            href="/apply/to-be-listed"
            className="rounded  bg-blue-500 px-4 py-2 font-semibold no-underline hover:bg-blue-100 dark:bg-blue-500 dark:hover:bg-blue-300"
          >
            Apply to be listed on Lite.Space
          </Link>
          <h3 className="mb-4 text-xl font-bold leading-normal md:text-2xl">
            General Grant
          </h3>
          <p className="mb-8">
            General grants are funded by donations to the Lite.Space General
            Fund and will be distributed quarterly by our board. We evaluate and
            assess all applications to make sure grants are awarded to high
            impact projects in the Litecoin space.
          </p>
          <Link
            href="/apply/grant"
            className="rounded  bg-blue-500 px-4 py-2 font-semibold no-underline hover:bg-blue-100 dark:bg-blue-500 dark:hover:bg-blue-300"
          >
            Apply for a Lite.Space General Grant
          </Link>
          <h3 className="mb-4 text-xl font-bold leading-normal md:text-2xl">
            Long-Term Support
          </h3>
          <p className="mb-8">
            We have a limited number of long-term support grants available for
            projects that are critical to the Litecoin ecosystem. These grants
            are geared towards developers and maintainers of Litecoin Core and
            similar.
          </p>
          <Link
            href="/apply/lts"
            className="rounded  bg-blue-500 px-4 py-2 font-semibold no-underline hover:bg-blue-100 dark:bg-blue-500 dark:hover:bg-blue-300"
          >
            Apply for a Lite.Space LTS Grant
          </Link>
        </div>
      </ApplySection>
    </>
  )
}
