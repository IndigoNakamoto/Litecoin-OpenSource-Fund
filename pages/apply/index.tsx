import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import { InferGetStaticPropsType } from 'next'
import { allPages } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { MDXComponents } from '@/components/MDXComponents'
import PageSection from '@/components/PageSection'
import React from 'react'

const DEFAULT_LAYOUT = 'PageLayout'

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
        description="Global. Nym-friendly. Flexible."
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

      <PageSection title="Our Programs" image="/static/images/avatar.png">
        <p>
          All our programs are open to applicants worldwide. We are global and
          nym-friendly.
        </p>
        <p>
          Lite.Space does not discriminate in its grant selection process with
          applicants, whether internal or external, because of race, creed,
          color, age, national origin, ancestry, religion, gender, sexual
          orientation, gender identity, disability, genetic information, veteran
          status, military status, application for military service or any other
          class per local, state or federal law.
        </p>
        <p>
          Applications should be well written, informative, and concise. A great
          application will fit comfortably on one page while containing all
          information that is required to assess and judge the project or
          applicant.
        </p>
        <h2 className="mb-4 text-xl font-bold leading-normal md:text-2xl">
          Website Listing
        </h2>
        <p className="mb-8">
          Any FOSS project that is aligned with the Lite.Space mission is free
          to submit an application to be listed on the Lite.Space website.
          Donors may recommend their gifts be directed to specific projects on
          this list. If you are helping Litecoin and FOSS, please submit an
          application to be listed on our site.
        </p>
        <Link
          href="/apply/to-be-listed"
          className="rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-500 no-underline hover:text-black dark:hover:text-white"
        >
          Apply to be listed on Lite.Space
        </Link>
        <h2 className="mb-4 text-xl font-bold leading-normal md:text-2xl">
          General Grant
        </h2>
        <p className="mb-8">
          General grants are funded by donations to the Lite.Space General Fund
          and will be distributed quarterly by our board. We evaluate and assess
          all applications to make sure grants are awarded to high impact
          projects in the Litecoin space.
        </p>
        <Link
          href="/apply/grant"
          className="rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-500 no-underline hover:text-black dark:hover:text-white"
        >
          Apply for an Lite.Space General Grant
        </Link>
        <h2 className="mb-4 text-xl font-bold leading-normal md:text-2xl">
          Long-Term Support
        </h2>
        <p className="mb-8">
          We have a limited number of long-term support grants available for
          projects that are critical to the Litecoin ecosystem. These grants are
          geared towards developers and maintainers of Litecoin Core and
          similar.
        </p>
        <Link
          href="/apply/lts"
          className="rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-500 no-underline hover:text-black dark:hover:text-white"
        >
          Apply for an Lite.Space LTS Grant
        </Link>
      </PageSection>
    </>
  )
}
