//pages/bounties/index.tsx

import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import PaymentModal from '../../components/PaymentModal'
import ProjectCard from '../../components/ProjectCard'
import { ProjectItem } from '../../utils/types'
import { getAllPosts } from '../../utils/md'
// import Link from '@/components/Link'
import { isBounty } from 'pages/missions'

const AllProjects: NextPage<{ projects: ProjectItem[] }> = ({ projects }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const [selectedProject, setSelectedProject] = useState<ProjectItem>()

  const [sortedProjects, setSortedProjects] = useState<ProjectItem[]>()

  useEffect(() => {
    setSortedProjects(projects.filter(isBounty).sort(() => 0.5 - Math.random()))
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
      <h1 className="mt-10 pl-4 font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 xs:text-6xl sm:leading-10 md:text-7xl md:leading-14">
        Bounties
      </h1>

      <section className="">
        {/* <h2
          id="funds"
          className="mt-4 pl-4 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-5xl"
        >
          Open Bounties
        </h2> */}
        <div className="rounded-xl bg-gradient-to-b from-red-600 to-white p-4 pb-12 dark:from-red-600 dark:to-gray-900">
          <div className="flex w-full items-center justify-between pb-8"></div>
          <ul className="grid max-w-5xl gap-4 md:grid-cols-2">
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
