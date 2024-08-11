import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import PaymentModal from '../../components/PaymentModal'
import ProjectCard from '../../components/ProjectCard'
import { ProjectItem, ProjectCategory, BountyStatus } from '../../utils/types'
import { getAllPosts } from '../../utils/md'
import LitecoinIcon from '@/components/litecoin-icons'

const AllProjects: NextPage<{ projects: ProjectItem[] }> = ({ projects }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const [selectedProject, setSelectedProject] = useState<ProjectItem>()

  const [openSourceProjects, setOpenSourceProjects] = useState<ProjectItem[]>()
  const [DevOpsProjects, setDevOpsProjects] = useState<ProjectItem[]>()
  const [bountyProjects, setBountyProjects] = useState<ProjectItem[]>()

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
  }, [projects])

  function closeModal() {
    setModalOpen(false)
  }

  function openPaymentModal(project: ProjectItem) {
    setSelectedProject(project)
    setModalOpen(true)
  }

  const bgColors = ['bg-[#EEEEEE]', 'bg-[#c6d3d6]', 'bg-[#f3ccc4]']

  return (
    <>
      <Head>
        <title>Projects</title>
      </Head>
      <section className="flex flex-col rounded-3xl">
        <div className="flex w-full items-center justify-between"></div>
        <ul className="grid max-w-full gap-6 md:grid-cols-2">
          {openSourceProjects &&
            openSourceProjects.map((p, i) => (
              <li key={i}>
                <ProjectCard
                  project={p}
                  openPaymentModal={openPaymentModal}
                  bgColor={bgColors[i % bgColors.length]}
                />
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
