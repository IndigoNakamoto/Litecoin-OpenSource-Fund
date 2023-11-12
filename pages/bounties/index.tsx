//pages/bounties/index.tsx

import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import PaymentModal from '../../components/PaymentModal'
import ProjectCard from '../../components/ProjectCard'
import { ProjectItem } from '../../utils/types'
import { getAllPosts } from '../../utils/md'
// import Link from '@/components/Link'
import { isBounty, isCompletedBounty } from 'pages/missions'

const AllProjects: NextPage<{ projects: ProjectItem[] }> = ({ projects }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const [selectedProject, setSelectedProject] = useState<ProjectItem>()

  const [sortedProjects, setSortedProjects] = useState<ProjectItem[]>()
  const [completedProjects, setCompletedProjects] = useState<ProjectItem[]>()

  useEffect(() => {
    setSortedProjects(projects.filter(isBounty).sort(() => 0.5 - Math.random()))
    setCompletedProjects(
      projects.filter(isCompletedBounty).sort(() => 0.5 - Math.random())
    )
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
        <title>Bounties | Lite.Space</title>
      </Head>
      <h1 className="pl-4 pt-20 text-5xl font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:leading-10 md:text-7xl md:leading-14 xl:col-span-2">
        Bounties
      </h1>

      <section className="flex flex-col rounded-3xl bg-gradient-to-b from-gray-200 to-gray-300 p-4 dark:from-gray-700 dark:to-gray-600 md:p-8">
        <div className="">
          <div className="flex w-full items-center justify-between"></div>
          <ul className="grid max-w-5xl gap-8 md:grid-cols-2">
            {sortedProjects &&
              sortedProjects.map((p, i) => (
                <li key={i} className="">
                  <ProjectCard
                    project={p}
                    openPaymentModal={openPaymentModal}
                  />
                </li>
              ))}
          </ul>
        </div>
      </section>
      <h1 className="pl-4 pt-20 text-5xl font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:leading-10 md:text-7xl md:leading-14 xl:col-span-2">
        Completed Bounties
      </h1>

      <section className="flex flex-col rounded-3xl bg-gradient-to-b from-gray-200 to-gray-300 p-4 dark:from-gray-700 dark:to-gray-600 md:p-8">
        <div className="">
          <div className="flex w-full items-center justify-between"></div>
          <ul className="grid max-w-5xl gap-8 md:grid-cols-2">
            {completedProjects &&
              completedProjects.map((p, i) => (
                <li key={i} className="">
                  <ProjectCard
                    project={p}
                    openPaymentModal={openPaymentModal}
                  />
                </li>
              ))}
          </ul>
        </div>
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
