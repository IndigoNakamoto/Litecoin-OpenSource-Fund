//pages/projects/index.tsx

import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import PaymentModal from '../../components/PaymentModal'
import ProjectCard from '../../components/ProjectCard'
import { ProjectItem } from '../../utils/types'
import { getAllPosts } from '../../utils/md'
// import Link from '@/components/Link'
import Typing from '@/components/Typing'
import siteMetadata from '@/data/siteMetadata'

const AllProjects: NextPage<{ projects: ProjectItem[] }> = ({ projects }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const [selectedProject, setSelectedProject] = useState<ProjectItem>()

  const [sortedProjects, setSortedProjects] = useState<ProjectItem[]>()
  const [openSatsProjects, setOpenSatsProjects] = useState<ProjectItem[]>()
  const [bountyProjects, setBountyProjects] = useState<ProjectItem[]>()

  useEffect(() => {
    setSortedProjects(projects.filter(isProject))
    setOpenSatsProjects(
      projects
        .filter(isDevelopment)
        .sort((a, b) => a.title.localeCompare(b.title))
    )
    setBountyProjects(projects.filter(isBounty))
  }, [projects])

  function closeModal() {
    setModalOpen(false)
  }

  function openPaymentModal(project: ProjectItem) {
    setSelectedProject(project)
    setModalOpen(true)
  }

  return (
    <>
      <Head>
        <title>Lite.Space | Projects</title>
      </Head>

      <section className="mt-4">
        <div className="rounded-xl bg-gradient-to-b from-blue-100 to-gray-100 p-4 dark:from-blue-500 dark:to-gray-700">
          <h1 className="mt-2 font-semibold leading-9 tracking-tight text-gray-800 dark:text-gray-100 xs:text-6xl sm:leading-10 md:text-7xl md:leading-14">
            Explore Missions
          </h1>
          <div className="space-y-2 pb-0 pt-4 md:space-y-5">
            <h1 className="text-3xl font-semibold leading-9 tracking-tight text-gray-800 dark:text-gray-100 sm:text-5xl sm:leading-10 md:text-5xl md:leading-14">
              Supporting <Typing />
            </h1>

            <p className="mb-0 pb-2 text-2xl leading-7 text-gray-700 dark:text-gray-200">
              {siteMetadata.description}
            </p>
          </div>
        </div>
      </section>
      {/* <hr className="mx-8 border-t-2 border-primary-200 dark:border-primary-900" /> */}
      {/* TODO: I want the section to start with bg-gray-200 and have a gradient to white with rounded corners */}
      <div className="space-y-2 pb-0 pt-10 md:space-y-5 xl:grid xl:grid-cols-3 xl:gap-x-8">
        {/* <h1 className="text-3xl font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-7xl md:leading-14 xl:col-span-2"> */}
        <h2 className="pl-4 font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 xs:text-5xl sm:leading-10 md:text-7xl md:leading-14 xl:col-span-2">
          Open-Source Missions
        </h2>
      </div>
      <section className="flex flex-col rounded-3xl bg-gradient-to-b from-gray-100 to-blue-100 p-8 dark:from-gray-600 dark:to-blue-500">
        <div className="flex w-full items-center justify-between"></div>
        <ul className="grid max-w-5xl gap-8 md:grid-cols-2">
          {sortedProjects &&
            sortedProjects.map((p, i) => (
              <li key={i} className="">
                <ProjectCard project={p} openPaymentModal={openPaymentModal} />
              </li>
            ))}
        </ul>
      </section>
      {/* <hr className="mx-8 border-t-2 border-primary-200 dark:border-primary-900" /> */}
      <div className="space-y-2 pb-0 pt-10 md:space-y-5 xl:grid xl:grid-cols-3 xl:gap-x-8">
        {/* <h1 className="text-3xl font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-7xl md:leading-14 xl:col-span-2"> */}
        <h2 className="pl-4 font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 xs:text-5xl sm:leading-10 md:text-7xl md:leading-14 xl:col-span-2">
          Bounty Missions
        </h2>
      </div>
      <section className="flex flex-col rounded-3xl bg-gradient-to-b from-blue-100 to-blue-200 p-8 dark:from-blue-500 dark:to-gray-700">
        <div className="flex w-full items-center justify-between"></div>
        <ul className="grid max-w-5xl gap-8 md:grid-cols-2">
          {bountyProjects &&
            bountyProjects.map((p, i) => (
              <li key={i} className="">
                <ProjectCard project={p} openPaymentModal={openPaymentModal} />
              </li>
            ))}
        </ul>
      </section>
      {/* <hr className="mx-8 border-t-2 border-primary-200 dark:border-primary-900" /> */}
      <div className="space-y-2 pb-0 pt-10 md:space-y-5 xl:grid xl:grid-cols-3 xl:gap-x-8">
        {/* <h1 className="text-3xl font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-7xl md:leading-14 xl:col-span-2"> */}
        <h2 className="pl-4 font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 xs:text-5xl sm:leading-10 md:text-7xl md:leading-14 xl:col-span-2">
          Development & Ops
        </h2>
      </div>
      <section className="flex flex-col rounded-3xl bg-gradient-to-b from-blue-200 to-gray-100 p-8 dark:from-gray-600 dark:to-blue-500">
        <div className="flex w-full items-center justify-between"></div>
        <ul className="grid max-w-5xl gap-8 md:grid-cols-2">
          {openSatsProjects &&
            openSatsProjects.map((p, i) => (
              <li key={i} className="">
                <ProjectCard project={p} openPaymentModal={openPaymentModal} />
              </li>
            ))}
        </ul>
      </section>
      <PaymentModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        project={selectedProject}
      />
    </>
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
  return project.type === 'Bounty'
}

export function isDevelopment(project: ProjectItem): boolean {
  return project.type === 'Development Fund'
}
export function isProject(project: ProjectItem): boolean {
  return project.type === 'Project'
}
