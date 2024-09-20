// pages/missions/[slug].tsx

import { useDonation } from '../../contexts/DonationContext'
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { getPostBySlug, getAllPosts, getAllPostUpdates } from '../../utils/md'
import markdownToHtml from '../../utils/markdownToHtml'
import {
  ProjectItem,
  AddressStats,
  BountyStatus,
  TwitterUser,
} from '../../utils/types'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import PaymentModal from '@/components/PaymentModal'
import ThankYouModal from '@/components/ThankYouModal'
import { fetchGetJSON } from '../../utils/api-helpers'
// import Head from 'next/head'
import SEOHead from '@/components/SEOHead'
import ProjectHeader from '@/components/ProjectHeader'
import ProjectMenu from '@/components/ProjectMenu'
import MenuSections from '@/components/MenuSections'
import AsideSection from '@/components/AsideSection'
import tweetsData from '../../data/tweets.json'
import React from 'react'

type SingleProjectPageProps = {
  project: ProjectItem
  projects: ProjectItem[]
}

const Project: NextPage<SingleProjectPageProps> = ({ project }) => {
  const { dispatch } = useDonation()
  const router = useRouter()

  const [modalOpen, setModalOpen] = useState(true) // Payment Modal
  const [isThankYouModalOpen, setThankYouModalOpen] = useState(false) //Thank you modal

  const [selectedProject, setSelectedProject] = useState<ProjectItem>()

  // Markdown Project Data
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
    contributorsBitcoin,
    contributorsLitecoin,
    advocates,
    hashtag,

    // Resources and Metadata
    website,
    tutorials,
    owner,

    // Links
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
    isBitcoinOlympics2024,
    serviceFeesCollected,
    isMatching,
    matchingMultiplier,
    recurringAmountGoal,
    recurringPeriod,
    totalPaid,

    // Timelines
    expectedCompletion,
    updates,
  } = project

  // State Variables
  const [addressStats, setAddressStats] = useState<AddressStats>()
  const [twitterUsers, setTwitterUsers] = useState<TwitterUser[]>([])
  const [matchingTotal, setMatchingTotal] = useState(0)
  const [serviceFeeCollected, setServiceFeesCollected] =
    useState(serviceFeesCollected)
  const [twitterContributors, setTwitterContributors] = useState<TwitterUser[]>(
    []
  )
  const [twitterContributorsBitcoin, setTwitterContributorsBitcoin] = useState<
    TwitterUser[]
  >([])
  const [twitterContributorsLitecoin, setTwitterContributorsLitecoin] =
    useState<TwitterUser[]>([])
  const [twitterAdvocates, setTwitterAdvocates] = useState<TwitterUser[]>([])

  const [faq, setFaq] = useState<any>({})
  const [faqCount, setFaqCount] = useState<number>(0)

  const [monthlyTotal, setMonthlyTotal] = useState(0)
  const [monthlyDonorCount, setMonthlyDonorCount] = useState(0)
  const [percentGoalCompleted, setPercentGoalCompleted] = useState(0)
  const [timeLeftInMonth, setTimeLeftInMonth] = useState(0)

  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(
    'mission'
  )
  const [selectedUpdateId, setSelectedUpdateId] = useState<number | null>(null)

  // Utility Functions
  const isValidUsernames = (usernames: string | undefined): boolean => {
    return typeof usernames === 'string' && usernames.trim().length > 0
  }

  function closeModal() {
    setModalOpen(false)
    setThankYouModalOpen(false)
    // Remove query parameters related to modal
    if (router.query.modal || router.query.thankyou || router.query.name) {
      const { modal, thankyou, name, ...newQuery } = router.query
      router.push(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true }
      )
    }
  }

  function openPaymentModal() {
    setSelectedProject(project)
    setModalOpen(true)

    dispatch({
      type: 'SET_PROJECT_DETAILS',
      payload: {
        slug: project.slug,
        title: project.title,
        image: project.coverImage,
      },
    })

    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, modal: 'true' },
      },
      undefined,
      { shallow: true }
    )
  }

  function openThankYouModal() {
    setSelectedProject(project)
    setThankYouModalOpen(true)
  }

  function extractUsername(url: string) {
    const regex = /\/([^/]+)$/
    const match = url.match(regex)
    return match ? match[1] : url
  }

  async function fetchFAQData(slug: string) {
    try {
      const faqDataModule = await import(`../../data/projects/${slug}/faq.json`)
      return faqDataModule.default
    } catch (error) {
      console.error('Error fetching FAQ data:', error)
      return {} // Return an empty object if there's an error
    }
  }

  // Format function
  function formatLits(value: any) {
    const num = Number(value)

    if (isNaN(num) || value === '' || value === null) {
      return '0'
    }

    if (num === 0) {
      return '0'
    }

    let [whole, fraction] = num.toFixed(8).split('.')
    whole += ''

    if (fraction && /^0+$/.test(fraction)) {
      return whole
    }

    if (fraction) {
      fraction =
        fraction.slice(0, 2) +
        ' ' +
        fraction.slice(2, 5) +
        ' ' +
        fraction.slice(5)
    }

    return fraction ? `${whole}.${fraction}` : whole
  }

  // Load FAQ data
  useEffect(() => {
    async function loadFAQData() {
      const data = await fetchFAQData(slug)
      const totalItems = data?.questionsAndAnswers?.reduce(
        (acc: number, category: any) => {
          return acc + category.items.length
        },
        0
      )
      setFaqCount(totalItems)
      setFaq(data)
    }

    loadFAQData()
  }, [slug])

  // Fetch donations, contributors, and supporters
  useEffect(() => {
    const fetchData = async () => {
      setAddressStats(undefined)
      const stats = await fetchGetJSON(`/api/getInfo/?slug=${slug}`)
      setAddressStats(stats)
      setServiceFeesCollected(serviceFeesCollected)

      // Matching goal calculation
      if (
        isMatching &&
        typeof matchingMultiplier === 'number' &&
        isBitcoinOlympics2024
      ) {
        const matchingTotalCalc =
          stats.funded_txo_sum * matchingMultiplier - stats.funded_txo_sum
        setMatchingTotal(matchingTotalCalc)
      }

      // Monthly goal calculation
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

        const monthlyDonations = stats.donatedCreatedTime.filter(
          (donation: any) => {
            const donationDate = new Date(donation.createdTime * 1000)
            return donationDate >= startOfMonth && donationDate <= endOfMonth
          }
        )

        setMonthlyDonorCount(monthlyDonations.length)
        const monthlyTotalCalc = monthlyDonations.reduce(
          (total: number, donation: any) => total + Number(donation.amount),
          0
        )
        const percentGoalCompletedCalc =
          (monthlyTotalCalc / recurringAmountGoal) * 100

        setMonthlyTotal(monthlyTotalCalc)
        setPercentGoalCompleted(percentGoalCompletedCalc)

        const timeLeft = endOfMonth.getTime() - currentDate.getTime()
        const daysLeft = Math.ceil(timeLeft / (1000 * 3600 * 24))
        setTimeLeftInMonth(daysLeft)
      }

      const fetchTwitterUsers = async (usernames: string) => {
        const response = await fetch(`/api/twitterUsers?usernames=${usernames}`)
        return response.json()
      }

      if (isValidUsernames(contributor)) {
        const contributorsResponse = await fetchTwitterUsers(contributor!)
        setTwitterContributors(contributorsResponse)
      }

      if (isValidUsernames(contributorsBitcoin)) {
        const contributorsBitcoinResponse = await fetchTwitterUsers(
          contributorsBitcoin!
        )
        setTwitterContributorsBitcoin(contributorsBitcoinResponse)
      }

      if (isValidUsernames(contributorsLitecoin)) {
        const contributorsLitecoinResponse = await fetchTwitterUsers(
          contributorsLitecoin!
        )
        setTwitterContributorsLitecoin(contributorsLitecoinResponse)
      }

      if (isValidUsernames(advocates)) {
        const advocatesResponse = await fetchTwitterUsers(advocates!)
        setTwitterAdvocates(advocatesResponse)
      }

      if (stats.supporters && stats.supporters.length > 0) {
        const supporters = stats.supporters.map((supporter: any) => {
          if (typeof supporter === 'string' || supporter instanceof String) {
            return extractUsername(supporter.toString())
          } else {
            return 'anonymous'
          }
        })

        const uniqueSupporters = Array.from(new Set(supporters)).join(',')
        const twitterUsersResponse = await fetchTwitterUsers(uniqueSupporters)
        setTwitterUsers(twitterUsersResponse)
      }
    }

    fetchData().catch(console.error)
  }, [
    contributor,
    contributorsBitcoin,
    contributorsLitecoin,
    advocates,
    slug,
    isMatching,
    matchingMultiplier,
    isBitcoinOlympics2024,
    isRecurring,
    recurringAmountGoal,
    serviceFeesCollected,
  ])

  // Handle opening modals based on query parameters
  useEffect(() => {
    if (router.query.thankyou === 'true') {
      openThankYouModal()
    }
  }, [router.query.thankyou])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const query = new URLSearchParams(window.location.search)
      const modal = query.get('modal')
      if (modal === 'true') {
        setModalOpen(true)
      } else {
        setModalOpen(false)
      }
    }
  }, [])

  // Handle selected menu item based on query parameters
  useEffect(() => {
    const menu = router.query.menu
    const updateId = router.query.updateId

    const selectedMenu = Array.isArray(menu) ? menu[0] : menu

    if (selectedMenu) {
      setSelectedMenuItem(selectedMenu)
    } else {
      setSelectedMenuItem('mission')
    }

    if (updateId) {
      setSelectedUpdateId(Number(updateId))
      if (selectedMenu !== 'updates') {
        setSelectedMenuItem('updates')
      }
    }
  }, [router.query])

  // Scroll to selected update
  useEffect(() => {
    if (selectedUpdateId) {
      const element = document.getElementById(`update-${selectedUpdateId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [selectedUpdateId])

  // Global click handler to reset selectedUpdateId
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      if (updates) {
        let isOutside = true
        updates.forEach((post) => {
          const element = document.getElementById(`update-${post.id}`)
          if (element && element.contains(event.target as Node)) {
            isOutside = false
          }
        })

        if (isOutside) {
          setSelectedUpdateId(null)
        }
      }
    }

    document.addEventListener('click', handleGlobalClick)
    return () => {
      document.removeEventListener('click', handleGlobalClick)
    }
  }, [updates])

  // pages/missions/[slug].tsx

  useEffect(() => {
    if (!router.isReady) return

    const modalParam = router.query.modal
    if (modalParam === 'true') {
      setModalOpen(true)

      // Set the selected project
      setSelectedProject(project)

      // Dispatch the project details to DonationContext
      dispatch({
        type: 'SET_PROJECT_DETAILS',
        payload: {
          slug: project.slug,
          title: project.title,
          image: project.coverImage,
        },
      })
    } else {
      setModalOpen(false)
    }
  }, [router.isReady, router.query.modal])

  // Handler for menu item changes
  const handleMenuItemChange = (
    newMenuItem: string,
    updateId: number | null = null
  ) => {
    setSelectedMenuItem(newMenuItem)

    const updatedURL = updateId
      ? `/projects/${slug}?menu=${newMenuItem}&updateId=${updateId}`
      : `/projects/${slug}?menu=${newMenuItem}`

    router.push(updatedURL, undefined, { shallow: true })
  }

  if (!router.isFallback && !slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <>
      <SEOHead title={title} summary={summary} coverImage={coverImage} />
      <div
        className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex h-full w-screen max-w-none items-center bg-[#f2f2f2] bg-cover bg-center pb-8"
        style={{
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
        }}
      >
        <article className="relative mx-auto mt-32 flex min-h-screen w-[1300px] max-w-[90%] flex-col-reverse pb-16 lg:flex-row lg:items-start">
          <div className="content w-full leading-relaxed text-gray-800 lg:mr-5">
            {/* Project Header */}
            <ProjectHeader title={title} summary={summary} />

            {/* Project Menu */}
            <ProjectMenu
              onMenuItemChange={handleMenuItemChange}
              activeMenu={selectedMenuItem}
              commentCount={
                hashtag && tweetsData[hashtag] ? tweetsData[hashtag].length : 0
              }
              faqCount={faqCount || 0}
              updatesCount={(updates && updates.length - 1) || 0}
            />

            {/* Menu Sections */}
            <MenuSections
              selectedMenuItem={selectedMenuItem || 'mission'}
              title={title}
              content={content || ''}
              socialSummary={socialSummary || ''}
              faq={faq}
              faqCount={faqCount}
              updates={updates || []}
              selectedUpdateId={selectedUpdateId}
              setSelectedUpdateId={setSelectedUpdateId}
              hashtag={hashtag || ''}
              tweetsData={tweetsData}
              twitterContributors={twitterContributors}
              twitterContributorsBitcoin={twitterContributorsBitcoin}
              twitterContributorsLitecoin={twitterContributorsLitecoin}
              twitterAdvocates={twitterAdvocates}
              twitterUsers={twitterUsers}
              isBitcoinOlympics2024={isBitcoinOlympics2024 || false}
              formatLits={formatLits}
              website={website || ''}
              gitRepository={gitRepository || ''}
              twitterHandle={twitterHandle || ''}
              discordLink={discordLink || ''}
              telegramLink={telegramLink}
              facebookLink={facebookLink}
              redditLink={redditLink}
            />
          </div>

          {/* Aside Section */}
          <AsideSection
            title={title}
            coverImage={coverImage}
            addressStats={addressStats as AddressStats}
            isMatching={isMatching || true}
            isBitcoinOlympics2024={isBitcoinOlympics2024 || false}
            isRecurring={isRecurring}
            matchingTotal={matchingTotal}
            serviceFeeCollected={serviceFeeCollected || 0}
            totalPaid={totalPaid || 0}
            formatLits={formatLits}
            monthlyTotal={monthlyTotal}
            recurringAmountGoal={recurringAmountGoal}
            monthlyDonorCount={monthlyDonorCount}
            timeLeftInMonth={timeLeftInMonth}
            bountyStatus={bountyStatus as BountyStatus}
            openPaymentModal={openPaymentModal}
          />
        </article>
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        project={selectedProject}
      />
      <ThankYouModal
        isOpen={isThankYouModalOpen}
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

export async function getServerSideProps(context: any) {
  const { params } = context

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
