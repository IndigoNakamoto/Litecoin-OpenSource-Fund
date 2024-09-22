import type { NextPage } from 'next'
import Head from 'next/head'
// import { useEffect, useState } from 'react'
import PaymentModal from '@/components/PaymentModal'
import ProjectCard from '@/components/ProjectCard'
import { ProjectItem, ProjectCategory, BountyStatus } from '../../utils/types'
import { getAllPosts } from '../../utils/md'
// import LitecoinIcon from '@/components/litecoin-icons'
import VerticalSocialIcons from '@/components/VerticalSocialIcons'
import faqData from '../../data/pages/faq.json'
import { FAQSection } from '@/components/FAQSection'
import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import TypingScroll from '@/components/TypingScroll'
// TODO: Fix scroll bar. Return to default

const project = {
  slug: 'general',
  title: 'General Fund',
  summary: '',
  coverImage: '/static/images/projects/generalfund2.png',
  telegramLink: '',
  redditLink: '',
  facebookLink: '',
  type: ProjectCategory.BOUNTY,
  isRecurring: false,
}

function useIsLgScreen() {
  const [isLgScreen, setIsLgScreen] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')

    const handleResize = () => {
      setIsLgScreen(mediaQuery.matches)
    }

    handleResize() // Set initial value
    mediaQuery.addEventListener('change', handleResize)

    return () => {
      mediaQuery.removeEventListener('change', handleResize)
    }
  }, [])

  return isLgScreen
}

const AllProjects: NextPage<{ projects: ProjectItem[] }> = ({ projects }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectItem>()
  const [openSourceProjects, setOpenSourceProjects] = useState<ProjectItem[]>()
  const [DevOpsProjects, setDevOpsProjects] = useState<ProjectItem[]>()
  const [bountyProjects, setBountyProjects] = useState<ProjectItem[]>()
  const [completedProjects, setCompletedProjects] = useState<ProjectItem[]>()
  const [scrollPosition, setScrollPosition] = useState(0)
  const outerSpinnerRef = useRef(null)
  const innerSpinnerRef = useRef(null)
  const isLgScreen = useIsLgScreen()

  useEffect(() => {
    let previousScrollY = window.scrollY
    let rotationAngle = 0

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollDelta = currentScrollY - previousScrollY

      rotationAngle += scrollDelta * 0.08 // Adjust factor for desired speed
      if (outerSpinnerRef.current) {
        ;(
          outerSpinnerRef.current as HTMLElement
        ).style.transform = `rotate(${rotationAngle}deg)`
      }

      previousScrollY = currentScrollY
    }

    let requestId: number

    const animate = () => {
      requestId = requestAnimationFrame(animate)
      handleScroll()
    }

    animate()
    return () => {
      cancelAnimationFrame(requestId)
    }
  }, [])

  useEffect(() => {
    if (innerSpinnerRef.current) {
      const element = innerSpinnerRef.current as HTMLElement
      element.style.width = '80%' // Reduce the size of the inner element
      element.style.height = '80%'
    }
  }, [])

  // Create refs for the projects and bounties sections
  const projectsRef = useRef<HTMLDivElement>(null)
  const bountiesRef = useRef<HTMLDivElement>(null)
  // Scroll handler for "VIEW PROJECTS"
  const scrollToProjects = () => {
    const yOffset = -64 // Offset by the height of the sticky menu
    const yPosition =
      (projectsRef.current?.getBoundingClientRect().top ?? 0) +
      window.scrollY +
      yOffset
    window.scrollTo({ top: yPosition, behavior: 'smooth' })
  }

  const scrollToBounties = () => {
    const yOffset = -64 // Offset by the height of the sticky menu
    const yPosition =
      (bountiesRef.current?.getBoundingClientRect().top ?? 0) +
      window.scrollY +
      yOffset
    window.scrollTo({ top: yPosition, behavior: 'smooth' })
  }

  function closeModal() {
    setModalOpen(false)
  }

  useEffect(() => {
    const desiredOrder = [
      'General Fund',
      'Litecoin Core',
      'MWEB',
      'Ordinals Lite',
      'Litewallet',
      'Litecoin Development Kit',
      'Litecoin Mempool Explorer',
    ]

    setOpenSourceProjects(
      projects.filter(isProject).sort((a, b) => {
        const indexA = desiredOrder.indexOf(a.title)
        const indexB = desiredOrder.indexOf(b.title)

        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB
        }

        if (indexA !== -1) {
          return -1
        }
        if (indexB !== -1) {
          return 1
        }

        return a.title.localeCompare(b.title)
      })
    )

    setDevOpsProjects(
      projects
        .filter(isDevelopment)
        .sort((a, b) => a.title.localeCompare(b.title))
    )
    setBountyProjects(projects.filter(isBounty))
    setCompletedProjects(
      projects.filter(isCompletedBounty).sort(() => 0.5 - Math.random())
    )
  }, [projects])

  function openPaymentModal(project: ProjectItem) {
    setSelectedProject(project)
    setModalOpen(true)
  }

  const bgColors = ['bg-[#EEEEEE]', 'bg-[#c6d3d6]', 'bg-[#f3ccc4]']

  return (
    <div className="w-screen">
      <Head>
        <title>Projects</title>
      </Head>
      <VerticalSocialIcons />

      {/* Hero section 
      TODO: 
      - Donate now button opens the donate modal to the general donations project. 
      */}

      <section
        className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex max-h-fit min-h-[62vh] w-full items-center bg-cover bg-center lg:py-24"
        style={{
          backgroundImage: "url('/static/images/design/Mask-Group-19.webp')",
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
        }}
      >
        <div className="m-auto flex h-full w-[1300px] max-w-[90%] flex-col-reverse justify-center gap-y-40 lg:flex-row lg:items-center">
          <div className="lg:py-30 py-20 lg:w-1/2">
            <h1 className="font-space-grotesk text-4xl text-[41px] font-bold leading-[32px] tracking-wide text-black">
              Litecoin Projects
            </h1>
            <p className="w-11/12 pt-6 text-[19px]">
              The Litecoin Foundation is dedicated to consistently improving the
              Litecoin network, whilst supporting the development of exciting
              projects on the Litecoin blockchain. Below are a handful of
              initiatives that demonstrate Litecoin's commitment to innovation
              and improving the experience of its users.
            </p>
            <div className="my-8 flex w-11/12 max-w-[508px] flex-col gap-4">
              <div className="text-md rounded-3xl bg-[#222222] px-6 py-1 text-center font-medium">
                <button
                  className="text-md w-full cursor-pointer rounded-3xl bg-[#222222] text-center font-medium"
                  onClick={() => openPaymentModal(project)} // Add onClick handler
                >
                  DONATE NOW
                </button>
              </div>

              <div className="flex w-full flex-row justify-center gap-2">
                <button
                  className="text-md w-full cursor-pointer rounded-3xl bg-[#222222] px-6 py-3 text-center font-medium"
                  onClick={scrollToProjects}
                >
                  <span className="text-white">VIEW PROJECTS</span>
                </button>
                <button
                  className="text-md w-full cursor-pointer rounded-3xl bg-[#222222] px-6 py-3 text-center font-medium"
                  onClick={scrollToBounties} // Add onClick handler
                >
                  <span className="text-white">VIEW BOUNTIES</span>
                </button>
              </div>
            </div>
          </div>
          <div className="w-7/12 pt-80 lg:w-1/2 lg:pb-0 lg:pl-20 lg:pt-0">
            <div className="relative flex items-center justify-center">
              <img
                src="/static/images/design/outline-litecoin-spinner-inner.svg"
                alt="Litecoin Spinner Inner"
                className="absolute w-1/2 max-w-[160px] pb-8 lg:max-w-[full]"
              />
              <img
                src="/static/images/design/outline-litecoin-spinner-outer.svg"
                alt="Litecoin Spinner Outer"
                ref={outerSpinnerRef}
                className="absolute w-full lg:w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* OPEN SOURCE PROJECTS */}
      <section
        ref={projectsRef} // Attach ref to the projects section
        className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-20 flex max-h-fit min-h-[62vh] w-full items-center bg-cover bg-center"
        style={{
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
        }}
      >
        <div className="m-auto flex h-full w-[1300px] max-w-[90%] flex-col items-center justify-center">
          <h1 className="m-8 font-space-grotesk text-4xl text-[41px] font-medium leading-[32px] tracking-wide text-white">
            Open-Source Projects
          </h1>
          <ul className="grid max-w-full gap-6 md:grid-cols-2 xl:grid-cols-3">
            {openSourceProjects &&
              openSourceProjects.map((p, i) => {
                const isThreeCols = openSourceProjects.length >= 3
                const bgColor = isThreeCols
                  ? bgColors[i % 2] // Use only the first two colors if grid-cols-3
                  : bgColors[i % bgColors.length] // Use all colors otherwise

                return (
                  <li key={i}>
                    <ProjectCard
                      project={p}
                      openPaymentModal={openPaymentModal}
                      bgColor={bgColor}
                    />
                  </li>
                )
              })}
          </ul>
        </div>
      </section>

      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[300px] w-full bg-white bg-cover bg-center">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <h2 className="font-space-grotesk text-5xl font-semibold tracking-tight text-gray-800 lg:text-7xl">
            We Help Advance
          </h2>
          <h3 className="font-space-grotesk text-3xl font-semibold text-gray-800 lg:text-4xl">
            <TypingScroll />
          </h3>
          <p className="pt-2 font-space-grotesk text-2xl text-gray-600">
            Unite. Fund. Advance. - The Litecoin Project Development Portal
          </p>
        </div>
      </section>

      {/* SUBMIT PROJECT SECTION */}
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[600px] w-full bg-[#C5D3D6] bg-cover bg-center">
        <div className="m-auto flex h-full w-[1300px] max-w-[90%] flex-col-reverse justify-center gap-y-40 lg:flex-row lg:items-center">
          <div className="flex h-4/6 min-h-fit w-full flex-col justify-center border border-[#222222] p-16">
            <h1 className="m-auto font-space-grotesk text-4xl text-[41px] font-medium leading-[32px]  text-black">
              Submit a Project
            </h1>
            <p className="m-auto max-w-3xl text-lg  text-[#222222] ">
              We are looking to support talented individuals and teams who share
              our commitment to decentralized open-source solutions and the
              future of Litecoin.
            </p>
            <Link href="/projects/submit" className="m-auto">
              <button className="w-48 rounded-none border border-[#222222] py-2 font-semibold text-[#222222]">
                Submit Project
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* BOUNTIES SECTION */}
      <section
        ref={bountiesRef} // Attach ref to the bounties section
        className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-full bg-white bg-cover bg-center pb-20"
      >
        <div className="m-auto flex h-full w-[1300px] max-w-[90%] flex-col items-center justify-center">
          {/* <h1 className="m-8 font-space-grotesk text-4xl text-[41px] font-semibold leading-[32px]  text-black">
            Open Bounties
          </h1>
          <ul className="w-[100%]">
            {bountyProjects &&
              bountyProjects.map((p, i) => (
                <li key={i}>
                  <ProjectCard
                    project={p}
                    openPaymentModal={openPaymentModal}
                    bgColor={'bg-[#f3ccc4]'}
                  />
                </li>
              ))}
          </ul> */}
          <h1 className="m-8 font-space-grotesk text-4xl text-[41px] font-semibold leading-[32px] tracking-wide text-black">
            Past Projects
          </h1>
          <ul className="grid max-w-full gap-6 md:grid-cols-2 xl:grid-cols-3">
            {completedProjects &&
              completedProjects.map((p, i) => (
                <li key={i}>
                  <ProjectCard
                    project={p}
                    openPaymentModal={openPaymentModal}
                    bgColor={'bg-[#f3ccc4]'}
                  />
                </li>
              ))}
          </ul>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section
        className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-full bg-[#C5D3D6] bg-cover bg-center py-20 pt-16"
        style={{
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
        }}
      >
        <div className="m-auto flex h-full w-[1300px] max-w-[90%] flex-col md:justify-between lg:flex-row">
          {/* Left Column: Static h1 */}
          <div
            className="w-full pb-8 xl:w-[40%]"
            style={
              isLgScreen
                ? {
                    position: 'sticky',
                    top: '6rem', // Adjust this value as needed
                    alignSelf: 'start',
                  }
                : {}
            }
          >
            <h1 className="font-space-grotesk text-4xl text-[41px] font-semibold leading-[50px] text-black">
              Frequently Asked Questions:
            </h1>
            <p className="font-[15px]">
              To learn more about Litecoin, take a look at our FAQs:
            </p>
          </div>

          {/* Right Column: FAQ Section */}
          <div className="w-full xl:w-[60%]">
            <div className="rounded-x mt-8 w-full md:mt-0">
              <FAQSection faqCategories={faqData.questionsAndAnswers} />
            </div>
          </div>
        </div>
      </section>

      {/* TODO: CONTRIBUTORS SECTION */}
      {/* <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[600px] w-full  bg-[#F3CBC4] bg-cover bg-center">
        <div className="m-auto flex h-full w-[1300px] max-w-[90%] items-center justify-center p-8">
          <h1 className="m-8 font-space-grotesk text-4xl text-[41px] font-medium leading-[32px] tracking-wide text-black">
            Contributors
          </h1>
        </div>
      </section> */}

      {/* TODO: SUPPORTERS SECTION */}
      {/* <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[600px] w-full bg-white bg-cover bg-center">
        <div className="m-auto flex h-full w-[1300px] max-w-[90%] items-center justify-center p-8">
          <h1 className="m-8 font-space-grotesk text-4xl text-[41px] font-medium leading-[32px] tracking-wide text-black">
            Supporters
          </h1>
        </div>
      </section> */}

      <PaymentModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        project={project}
      />
    </div>
  )
}

export default AllProjects

export async function getStaticProps({ params }: { params: any }) {
  const projects = getAllPosts()

  return {
    props: {
      projects,
    },
  }
}

export function isOpenSatsProject(project: ProjectItem): boolean {
  return project.nym === 'Litecoin Foundation'
}

export function isNotOpenSatsProject(project: ProjectItem): boolean {
  return !isOpenSatsProject(project)
}

export function isBounty(project: ProjectItem): boolean {
  return (
    project.type === ProjectCategory.BOUNTY &&
    project.bountyStatus === BountyStatus.OPEN
  )
}

export function isCompletedBounty(project: ProjectItem): boolean {
  return project.bountyStatus === BountyStatus.COMPLETED
}

export function isOpenBounty(project: ProjectItem): boolean {
  return project.bountyStatus === BountyStatus.OPEN
}

export function isDevelopment(project: ProjectItem): boolean {
  return project.type === ProjectCategory.DEVELOPMENT
}
export function isProject(project: ProjectItem): boolean {
  return project.type === ProjectCategory.PROJECT
}
