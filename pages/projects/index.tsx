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
      {/* TODO: fix h1 h2 xs sm md font sizes... */}
      <h1 className="mt-10 font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 xs:text-4xl sm:leading-10 md:text-7xl md:leading-14">
        Explore Projects
      </h1>
      <section className="flex flex-col p-4 md:p-8">
        <div className="mt-1 divide-y divide-gray-200 dark:divide-gray-700">
          <div className="space-y-2 pb-2 pt-0 md:space-y-5">
            <h1 className="text-3xl font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl sm:leading-10 md:text-5xl md:leading-14">
              Supporting <Typing />
            </h1>

            <p className="text-2xl leading-7 text-gray-500 dark:text-gray-400">
              {siteMetadata.description}
            </p>
          </div>
        </div>
      </section>
      <section className="flex flex-col p-4 md:p-8">
        <div className="flex w-full items-center justify-between pb-8">
          <h2
            id="funds"
            className="text-lg font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-3xl md:leading-14 xl:col-span-2"
          >
            Open Bounties
          </h2>
        </div>
        <ul className="grid max-w-5xl gap-4 md:grid-cols-2">
          {bountyProjects &&
            bountyProjects.map((p, i) => (
              <li key={i} className="">
                <ProjectCard project={p} openPaymentModal={openPaymentModal} />
              </li>
            ))}
        </ul>
      </section>
      <section className="flex flex-col p-4 md:p-8">
        <div className="flex w-full items-center justify-between pb-8">
          <h2
            id="funds"
            className="text-lg font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-3xl md:leading-14 xl:col-span-2"
          >
            Open-Source Projects
          </h2>
        </div>
        <ul className="grid max-w-5xl gap-4 md:grid-cols-2">
          {sortedProjects &&
            sortedProjects.map((p, i) => (
              <li key={i} className="">
                <ProjectCard project={p} openPaymentModal={openPaymentModal} />
              </li>
            ))}
        </ul>
      </section>
      <section className="flex flex-col items-center p-4 md:p-8">
        <div className="flex w-full items-center justify-between pb-8">
          <h2
            id="funds"
            className="text-lg font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-3xl md:leading-14 xl:col-span-2"
          >
            Litecoin Development Fund
          </h2>
        </div>
        <ul className="grid max-w-5xl gap-4 md:grid-cols-2">
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
