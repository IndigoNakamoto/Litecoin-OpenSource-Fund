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

  const [monthlyTotal, setMonthlyTotal] = useState(0)
  const [percentGoalCompleted, setPercentGoalCompleted] = useState(0)
  const [timeLeftInMonth, setTimeLeftInMonth] = useState(0)

  function formatLits(value) {
    const num = Number(value)

    if (isNaN(value) || value === '' || value === null) {
      return '0'
    }

    // Check if the value is zero
    if (num === 0) {
      return '0'
    }

    // Split the number into whole and fractional parts
    let [whole, fraction] = num.toFixed(8).split('.')
    whole += ''
    // Check if the fractional part is all zeros
    if (fraction && /^0+$/.test(fraction)) {
      return whole
    }

    // Format the fractional part with spaces
    if (fraction) {
      fraction =
        fraction.slice(0, 2) +
        ' ' +
        fraction.slice(2, 5) +
        ' ' +
        fraction.slice(5)
    }

    // Combine the whole and fractional parts
    return fraction ? `${whole}.${fraction}` : whole
  }

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

      // New logic for monthly goal calculation
      if (isRecurring && recurringAmountGoal) {
        const currentDate = new Date()
        const startOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        )
        const endOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        )

        // Filter donations
        const monthlyDonations = stats.donatedCreatedTime.filter((donation) => {
          // Convert donation createdTime to milliseconds by multiplying by 1000
          const donationDate = new Date(donation.createdTime * 1000)
          return donationDate >= startOfMonth && donationDate <= endOfMonth
        })

        const monthlyTotal = monthlyDonations.reduce(
          (total, donation) => total + Number(donation.amount),
          0
        )
        const percentGoalCompleted = (monthlyTotal / recurringAmountGoal) * 100

        // Set state for monthly total and percent completed
        setMonthlyTotal(monthlyTotal)
        setPercentGoalCompleted(percentGoalCompleted)

        // Calculating time left in the month
        const timeLeft = endOfMonth.getTime() - currentDate.getTime()
        const daysLeft = Math.ceil(timeLeft / (1000 * 3600 * 24))
        setTimeLeftInMonth(daysLeft)
      }

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

            <div className="flex w-full flex-col items-start">
              <div className="flex w-full items-start space-x-8 sm:flex-row sm:items-center">
                {addressStats && (
                  <div>
                    <h5 className="text-3xl font-semibold">
                      {addressStats.tx_count || '0'}
                    </h5>
                    <h4 className="text-sm">Donations</h4>
                  </div>
                )}

                {addressStats && (
                  <div>
                    <h5 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
                      Ł {formatLits(addressStats.funded_txo_sum)}{' '}
                    </h5>
                    <h4 className="text-sm">Litecoin Raised</h4>
                  </div>
                )}
              </div>

              {isRecurring && (
                <div className="mt-4 w-full rounded-lg bg-white p-2 text-gray-800">
                  <div className="font-medium ">
                    <h4>
                      Monthly Goal:
                      <span className="font-medium">
                        {'  '}Ł{recurringAmountGoal}
                      </span>{' '}
                    </h4>
                  </div>
                  <div className="flex w-full flex-row space-x-8">
                    <div>
                      <h4 className="text-sm font-semibold text-blue-500">
                        Ł {formatLits(monthlyTotal)} raised
                      </h4>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-500">
                        {Math.round(percentGoalCompleted)}% funded
                      </h4>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-500">
                        {timeLeftInMonth} days to go
                      </h4>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={openPaymentModal}
              className="hover:white block w-full rounded-lg bg-blue-500 text-xl text-white transition-colors  duration-200 hover:border-transparent hover:bg-blue-400 dark:bg-blue-400 dark:text-gray-100 dark:hover:bg-blue-300"
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
