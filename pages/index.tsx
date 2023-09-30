import { useEffect, useState } from 'react'
import ProjectList from '../components/ProjectList'

import { PageSEO } from '@/components/SEO'

import siteMetadata from '@/data/siteMetadata'

import { sortedBlogPost, allCoreContent } from 'pliny/utils/contentlayer'
import { InferGetStaticPropsType } from 'next'

import { allBlogs } from 'contentlayer/generated'
import { getAllPosts, getPostBySlug } from '../utils/md'
import type { Blog } from 'contentlayer/generated'
import { useRouter } from 'next/router'
import { ProjectItem } from '../utils/types'
import PaymentModal from '../components/PaymentModal'
import { isBounty, isDevelopment, isProject } from './projects'
import Typing from '@/components/Typing'
import CustomLink from '@/components/Link'

export const getStaticProps = async () => {
  const sortedPosts = sortedBlogPost(allBlogs) as Blog[]
  const posts = allCoreContent(sortedPosts)

  const litespacefund = getAllPosts().filter(isDevelopment)
  const bounties = getAllPosts()
    .filter(isBounty)
    .sort(() => 0.5 - Math.random())
  const projects = getAllPosts()
    .filter(isProject)
    .sort(() => 0.5 - Math.random())

  const generalFund = getPostBySlug('general_fund', true)
  const opsFund = getPostBySlug('operations_budget', true)

  return {
    props: { posts, projects, bounties, litespacefund, generalFund, opsFund },
  }
}

export default function Home({
  projects,
  bounties,
  litespacefund,
  opsFund,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [modalOpen, setModalOpen] = useState(false)

  const router = useRouter()

  const [selectedProject, setSelectedProject] = useState<ProjectItem>()

  // const [litespacefund, setlitespacefund] = useState<ProjectItem[]>()

  function closeModal() {
    setModalOpen(false)
  }

  function openPaymentModal(project: ProjectItem) {
    setSelectedProject(project)
    setModalOpen(true)
  }

  useEffect(() => {
    if (router.isReady) {
      // console.log(router.query)
      if (router.query.donate === 'ops') {
        openPaymentModal(opsFund)
      }
    }
  }, [router.isReady])
  return (
    <>
      <PageSEO
        title={siteMetadata.title}
        description={siteMetadata.description}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-2 pt-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Support <Typing />
          </h1>
          <p className="text-2xl leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
          {/* 
          TODO: IMPORT LITECOIN DEVELOPMENT CARDS
          */}

          {/* <div className="flex flex-wrap">
            <div>
              <button
                onClick={openGeneralFundModal}
                className="mb-2 mr-2 block rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:border-transparent hover:bg-blue-500 hover:text-black dark:text-black dark:hover:text-white"
              >
                Donate to General Fund
              </button>
            </div>
            <div>
              <button
                onClick={openopsFundModal}
                className="block rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-500 hover:border-transparent hover:bg-blue-500 hover:text-black dark:hover:text-white"
              >
                Donate to Operations Budget
              </button>
            </div>
          </div> */}
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-16 md:space-y-5 xl:pt-24">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Open Bounties
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Explore Bounty Opportunities
            {/* <CustomLink href="/bounties" className="underline">
              
            </CustomLink>{' '} */}
          </p>
        </div>
        <ProjectList projects={bounties} openPaymentModal={openPaymentModal} />
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-16 md:space-y-5 xl:pt-24">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Explore Projects
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Browse through and directly support projects selected by the
            Litecoin Foundation.
          </p>
        </div>
        <ProjectList
          projects={projects}
          openPaymentModal={openPaymentModal}
          columns={3}
        />
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-16 md:space-y-5 xl:pt-24">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Development Fund
          </h1>
        </div>
        <ProjectList
          projects={litespacefund}
          openPaymentModal={openPaymentModal}
        />
      </div>
      {/* <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-16 md:space-y-5 xl:pt-24">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Stay Updated
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Read the latest posts from the{' '}
            <CustomLink href="/about" className="underline">
              OpenSats team
            </CustomLink>
            .
          </p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <li key={slug} className="py-12">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>
                          {formatDate(date, siteMetadata.locale)}
                        </time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold leading-8 tracking-tight">
                            <Link
                              href={`/blog/${slug}`}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                      <div className="text-base font-medium leading-6">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Read "${title}"`}
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div> */}
      {/* {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )} */}
      {/* {siteMetadata.newsletter && siteMetadata.newsletter.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )} */}
      <PaymentModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        project={selectedProject}
      />
      {/* <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-16 md:space-y-5 xl:pt-16">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Apply for Funding
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Are you an open-source contributor? Do you align with{' '}
            <CustomLink href="/mission" className="underline">
              our mission
            </CustomLink>
            ? Are you working on Bitcoin, nostr, or freedom tech in general?{' '}
            <CustomLink href="/apply" className="underline">
              Apply for funding!
            </CustomLink>
          </p>
        </div>
      </div> */}
    </>
  )
}
