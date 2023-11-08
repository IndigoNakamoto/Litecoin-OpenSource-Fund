//pages/missions/[slug].tsx
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { getPostBySlug, getAllPosts, getAllPostUpdates } from '../../utils/md'
import markdownToHtml from '../../utils/markdownToHtml'
import Image from 'next/legacy/image'
// import ProjectList from '../../components/ProjectList'
// import BackToProjects from '../../components/BackToProjects'
import { ProjectItem, AddressStats, Donation } from '../../utils/types'
import { NextPage } from 'next/types'
import { useEffect, useState } from 'react'
import PaymentModal from '../../components/PaymentModal'
// import Link from 'next/link'
import { fetchGetJSON } from '../../utils/api-helpers'
import TwitterUsers from '../../components/TwitterUsers'
import {
  TwitterUser,
  BountyStatus,
  BugSeverity,
  BugStatus,
  FundingStatus,
  RecurringPeriod,
} from '../../utils/types'
import Head from 'next/head'
import ProjectMenu from '../../components/ProjectMenu'
import TwitterFeed from '../../components/TwitterFeed'
import SocialMediaShare from '../../components/SocialMediaShare'
import tweetsData from '../../data/tweets.json'
import { FAQSection } from '@/components/FAQSection'
import ProjectUpdate from '../../components/ProjectUpdate'
import React from 'react'
import ProjectSocialLinks from '@/components/ProjectSocialLinks'

type SingleProjectPageProps = {
  project: ProjectItem
  projects: ProjectItem[]
}

const Project: NextPage<SingleProjectPageProps> = ({ project }) => {
  const router = useRouter()

  const [modalOpen, setModalOpen] = useState(false)

  const [selectedProject, setSelectedProject] = useState<ProjectItem>()

  function closeModal() {
    setModalOpen(false)
  }

  function openPaymentModal() {
    // console.log('opening single project modal...')
    setSelectedProject(project)
    setModalOpen(true)
  }

  function extractUsername(url) {
    // This regex will match any string that ends with a forward slash followed by any sequence of non-slash characters.
    const regex = /\/([^/]+)$/
    const match = url.match(regex)
    return match ? match[1] : url // If the regex matched, return the captured group; otherwise, return the original url.
  }

  async function fetchFAQData(slug: string) {
    try {
      const faqDataModule = await import(`../../data/projects/${slug}/faq.json`)
      return faqDataModule.default
    } catch (error) {
      console.error('Error fetching FAQ data:', error)
      return {} // Return an empty object if there's an error (e.g., file doesn't exist)
    }
  }

  const {
    // Main Info
    slug,
    title,
    summary,
    socialSummary,
    coverImage,
    content,

    // Community Interaction
    contributor,
    hashtag,

    // Resources and Metadata
    website,
    tutorials,
    owner,

    //Links
    twitterHandle,
    gitRepository,
    discordLink,
    telegramLink,
    facebookLink,
    redditLink,
    // Categorization and status
    type,
    bugSeverity,
    bugStatus,

    // Funding
    bountyAmount,
    bountyStatus,
    targetFunding,
    fundingDeadline,
    isRecurring,
    recurringAmountGoal,
    recurringPeriod,

    // Timelines
    expectedCompletion,
    updates,
  } = project

  const [addressStats, setAddressStats] = useState<AddressStats>()
  const [twitterUsers, setTwitterUsers] = useState<TwitterUser[]>([])
  const [twitterContributors, setTwitterContributors] = useState<TwitterUser[]>(
    []
  )

  const [faq, setFaq] = useState<any>({})
  const [faqCount, setFaqCount] = useState<any>()

  useEffect(() => {
    async function loadFAQData() {
      const data = await fetchFAQData(slug)
      const totalItems = data?.questionsAndAnswers?.reduce((acc, category) => {
        return acc + category.items.length
      }, 0)
      setFaqCount(totalItems)
      setFaq(data)
    }

    loadFAQData()
  }, [slug])

  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(
    'mission'
  )

  // Define a handler function for menu item changes.
  const handleMenuItemChange = (newMenuItem) => {
    setSelectedMenuItem(newMenuItem)

    // Update the URL without causing a page reload
    // const updatedURL = `/missions/${slug}?menu=${newMenuItem}`
    // router.push(updatedURL, undefined, { shallow: true })
    return newMenuItem
  }

  useEffect(() => {
    // Check for menu query parameter
    if (router.query.menu) {
      switch (router.query.menu) {
        case 'community':
          setSelectedMenuItem('community')
          break
        case 'comments':
          setSelectedMenuItem('comments')
          break
        case 'faq':
          setSelectedMenuItem('faq')
          break
        case 'updates':
          setSelectedMenuItem('updates')
          break
        case 'project':
          setSelectedMenuItem('mission')
          break
        default:
          setSelectedMenuItem('mission')
      }
    } else {
      setSelectedMenuItem('mission')
    }
  }, [router.query])

  /* 
    INPUT: 
    - ?isRecurring:Project that is recurring
    - recurringAmount?: number
    - startDate = 1st 
    - currentDate 
    - monthEndDate 
    - donatedCreatedTime = [{amount,createdTime},...]

    OUTPUT:
    - currentTotalAmount
    - currentPercentComplete
    
    */

  useEffect(() => {
    const fetchData = async () => {
      // Fetch mission info
      setAddressStats(undefined)
      const stats = await fetchGetJSON(`/api/getInfo/?slug=${slug}`)
      setAddressStats(stats)

      // if (
      //   stats.donatedCreatedTime &&
      //   stats.donatedCreatedTime.length > 0 &&
      //   isRecurring &&
      //   recurringAmountGoal
      // ) {
      //   const donatedCreatedTime: Donation[] = stats.donatedCreatedTime
      //   // Calculate time remaining based on RecurringPeriod
      //   let timeRemaining = 0
      //   switch (recurringPeriod) {
      //     case RecurringPeriod.WEEKLY:
      //       timeRemaining = 7 * 24 - new Date().getHours() // 7 days in a week
      //       break
      //     case RecurringPeriod.MONTHLY:
      //       timeRemaining =
      //         new Date(
      //           new Date().getFullYear(),
      //           new Date().getMonth() + 1,
      //           1
      //         ).getTime() - new Date().getTime() // Time remaining until the start of next month
      //       break
      //     case RecurringPeriod.QUARTERLY:
      //       // You can customize this calculation based on your definition of a quarter
      //       break
      //     default:
      //       timeRemaining = 0
      //   }

      //   // Filter donations for the current period based on RecurringPeriod
      //   const currentDate = new Date()
      //   const currentMonthLastDate = new Date(
      //     currentDate.getFullYear(),
      //     currentDate.getMonth() + 1,
      //     0
      //   )
      //   const currentQuarterEndDate = new Date(
      //     currentDate.getFullYear(),
      //     (currentDate.getMonth() + 3) % 12,
      //     1
      //   )

      //   let currentPeriodDonations: Donation[] = []
      //   switch (recurringPeriod) {
      //     case RecurringPeriod.WEEKLY:
      //       currentPeriodDonations = stats.donatedCreatedTime.filter(
      //         (donation) => {
      //           const donationDate = new Date(donation.createdTime)
      //           return (
      //             donationDate >= currentDate &&
      //             donationDate <= currentMonthLastDate
      //           )
      //         }
      //       )
      //       break
      //     case RecurringPeriod.MONTHLY:
      //       currentPeriodDonations = stats.donatedCreatedTime.filter(
      //         (donation) => {
      //           const donationDate = new Date(donation.createdTime)
      //           return (
      //             donationDate >= currentDate &&
      //             donationDate <= currentMonthLastDate
      //           )
      //         }
      //       )
      //       break
      //     case RecurringPeriod.QUARTERLY:
      //       currentPeriodDonations = stats.donatedCreatedTime.filter(
      //         (donation) => {
      //           const donationDate = new Date(donation.createdTime)
      //           return (
      //             donationDate >= currentDate &&
      //             donationDate <= currentQuarterEndDate
      //           )
      //         }
      //       )
      //       break
      //     default:
      //       currentPeriodDonations = []
      //   }

      //   console.log('Donations:', stats.donatedCreatedTime)
      //   console.log('Current Date:', currentDate)
      //   console.log('Current Month Last Date:', currentMonthLastDate)
      //   console.log('Current Quarter End Date:', currentQuarterEndDate)
      //   console.log('Current Period Donations:', currentPeriodDonations)

      //   // Calculate the total amount donated in the current period
      //   const currentPeriodAmountTotal = currentPeriodDonations.reduce(
      //     (total, donation) => {
      //       return total + donation.amount
      //     },
      //     0
      //   )

      //   // Calculate the total number of donations for the current period
      //   const currentPeriodDonationCount = currentPeriodDonations.length

      //   // Calculate the percentage of the goal reached
      //   const currentPercentComplete =
      //     (currentPeriodAmountTotal / recurringAmountGoal) * 100

      //   console.log('Time Remaining:', timeRemaining)
      //   console.log('Current Period Amount Total:', currentPeriodAmountTotal)
      //   console.log('Current Percent Complete:', currentPercentComplete)
      //   console.log(
      //     'Current Period Donation Count:',
      //     currentPeriodDonationCount
      //   )
      // }

      if (contributor) {
        const contributorsArray = contributor.split(',')
        if (contributorsArray.length > 0) {
          const contributorsResponse = await fetch(
            `/api/twitterUsers?usernames=${contributor}`
          )
          const twitterContributors = await contributorsResponse.json()
          setTwitterContributors(twitterContributors)
        }
      }

      // Fetch Twitter user details
      if (stats.supporters && stats.supporters.length > 0) {
        const supporters = stats.supporters
          .map((supporter) => {
            if (typeof supporter === 'string' || supporter instanceof String) {
              return extractUsername(supporter)
            } else {
              return 'anonymous'
            }
          })
          .join(',')
        const response = await fetch(
          `/api/twitterUsers?usernames=${supporters}`
        )
        const twitterUsers = await response.json()
        setTwitterUsers(twitterUsers)
      }
    }

    fetchData().catch(console.error)
  }, [contributor, slug])

  if (!router.isFallback && !slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <>
      <Head>
        <title>Lite.Space | {title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={summary} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@LTCFoundation" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={summary} />
        {/* <meta name="twitter:creator" content="@LTCFoundation" /> */}
        <meta
          name="twitter:image"
          content={`https://www.Lite.Space${coverImage}`}
        />
        <meta
          property="og:image"
          content={`https://www.Lite.Space${coverImage}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div>
        <article className="mt-10 flex flex-col-reverse xl:flex-row xl:items-start">
          <div className="content rounded-xl bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-gray-100 to-gray-200 p-4 leading-relaxed text-gray-800 dark:from-gray-800 dark:to-gray-700 dark:text-gray-200 md:px-8 xl:mr-5 xl:w-[84ch]">
            {/* ## PROJECT HEADER */}
            <h1 className="pb-4 text-3xl font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
              {title}
            </h1>
            <p className="prose max-w-none pb-0 pt-0 text-xl font-normal dark:prose-dark">
              {summary}
            </p>
            <div className="pt-4">
              <ProjectSocialLinks
                website={website}
                gitRepository={gitRepository}
                twitterHandle={twitterHandle}
                discordLink={discordLink}
                telegramLink={telegramLink}
                facebookLink={facebookLink}
                redditLink={redditLink}
              />
            </div>

            {/* ## PROJECT CONTENT */}
            <ProjectMenu
              onMenuItemChange={handleMenuItemChange}
              activeMenu={selectedMenuItem}
              commentCount={
                hashtag && tweetsData[hashtag] ? tweetsData[hashtag].length : 0
              }
              faqCount={faqCount || 0}
              updatesCount={(updates && updates?.length - 1) || 0}
            />
            {/* ### Mission Section */}
            {selectedMenuItem === 'mission' && content && (
              <div
                className="markdown"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
            {/* ### Comments Section */}
            {selectedMenuItem === 'comments' && (
              <div className="markdown">
                <h1>{`${hashtag}`}</h1>
                <TwitterFeed hashtag={hashtag} tweetsData={tweetsData} />
              </div>
            )}
            {/* ### FAQ Section */}
            {selectedMenuItem === 'faq' && (
              <div className="markdown">
                <FAQSection faqCategories={faq.questionsAndAnswers} />
              </div>
            )}
            {/* ### Updates Section */}
            {selectedMenuItem === 'updates' && content && (
              <div className="markdown min-h-full">
                <div>
                  {updates &&
                  updates.filter((post) => post.id > 0).length > 0 ? (
                    updates
                      .filter((post) => post.id > 0)
                      .map((post, index) => (
                        <ProjectUpdate
                          key={index}
                          title={post.title}
                          summary={post.summary}
                          authorTwitterHandle={post.authorTwitterHandle}
                          date={post.date}
                          tags={post.tags || []}
                          content={post.content}
                          id={post.id}
                        />
                      ))
                  ) : (
                    <h1>No updates available for this project.</h1>
                  )}
                </div>
              </div>
            )}

            {/* ### Community Section */}
            {selectedMenuItem === 'community' && (
              <>
                <div className="markdown">
                  {twitterContributors.length > 0 ? (
                    <>
                      <h1>
                        {twitterContributors.length > 1
                          ? 'Contributors'
                          : 'Contributor'}
                      </h1>
                      <TwitterUsers users={twitterContributors} />
                    </>
                  ) : null}
                </div>

                <div className="markdown">
                  {twitterUsers.length > 0 ? (
                    <>
                      <h1>
                        {twitterUsers.length > 1 ? 'Supporters' : 'Supporter'}
                      </h1>
                      <TwitterUsers users={twitterUsers} />
                    </>
                  ) : null}
                </div>
              </>
            )}
          </div>
          <aside className="top-0 mb-8 flex min-w-[20rem] flex-col space-y-4 rounded-xl bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-gray-100 to-gray-300 p-4 dark:from-gray-800 dark:to-gray-700 md:p-8 lg:items-start xl:sticky xl:p-4 xs:p-4">
            <div className="relative h-[20rem] w-full overflow-hidden rounded-lg xl:h-[14rem] ">
              <Image
                alt={title}
                src={coverImage}
                layout="fill"
                objectFit="cover"
                objectPosition="50% 50%"
                priority={true}
              />
            </div>

            <div className="flex w-full items-start space-x-8 sm:flex-row sm:items-center">
              {addressStats && (
                <div className="">
                  <h5 className="text-3xl font-semibold">
                    {addressStats.tx_count}
                  </h5>
                  <h4 className="text-sm">Donations</h4>
                </div>
              )}

              {/* Refactor for one time or recurring  */}
              {addressStats && (
                <div className="">
                  <h5 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
                    Ł {addressStats.funded_txo_sum}{' '}
                  </h5>
                  <h4 className="text-sm">Litecoin Raised</h4>
                </div>
              )}

              {/* Days to go */}
            </div>

            <button
              onClick={openPaymentModal}
              className="hover:white block w-full rounded bg-blue-500 text-xl text-white transition-colors  duration-200 hover:border-transparent hover:bg-blue-400 dark:bg-blue-400 dark:text-gray-100 dark:hover:bg-blue-300"
            >
              Support this mission
            </button>
            <SocialMediaShare
              className="mt-0 flex space-x-1"
              title={title}
              summary={socialSummary}
            />
          </aside>
        </article>
      </div>

      <PaymentModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        project={selectedProject}
      />
    </>
  )
}

export default Project

type ParamsType = {
  slug: string
}

export async function getStaticProps({ params }: { params: ParamsType }) {
  const post = getPostBySlug(params.slug)
  const updates = getAllPostUpdates(params.slug) || []

  const projects = getAllPosts()

  const content = await markdownToHtml(post.content || '')
  return {
    props: {
      project: {
        ...post,
        content,
        updates,
      },
      projects,
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts()

  return {
    paths: posts.map((post) => {
      return {
        params: {
          project: post,
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
