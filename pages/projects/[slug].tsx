import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { getPostBySlug, getAllPosts } from '../../utils/md'
import markdownToHtml from '../../utils/markdownToHtml'
import Image from 'next/image'
import ProjectList from '../../components/ProjectList'
import BackToProjects from '../../components/BackToProjects'
import { ProjectItem, Stats, AddressStats } from '../../utils/types'
import { NextPage } from 'next/types'
import { useEffect, useState } from 'react'
import PaymentModal from '../../components/PaymentModal'
import Link from 'next/link'
import ShareButtons from '../../components/ShareButtons'
import { fetchGetJSON } from '../../utils/api-helpers'

type SingleProjectPageProps = {
  project: ProjectItem
  projects: ProjectItem[]
}

const Project: NextPage<SingleProjectPageProps> = ({ project, projects }) => {
  const router = useRouter()

  const [modalOpen, setModalOpen] = useState(false)

  const [selectedProject, setSelectedProject] = useState<ProjectItem>()

  function closeModal() {
    setModalOpen(false)
  }

  function openPaymentModal() {
    console.log('opening single project modal...')
    setSelectedProject(project)
    setModalOpen(true)
  }

  const {
    slug,
    title,
    summary,
    coverImage,
    git,
    twitter,
    content,
    nym,
    website,
    personalTwitter,
  } = project

  const [stats, setStats] = useState<Stats>()
  const [addressStats, setAddressStats] = useState<AddressStats>()

  useEffect(() => {
    const fetchData = async () => {
      setAddressStats(undefined)
      const stats = await fetchGetJSON(`/api/getInfo/?slug=${slug}`)
      setAddressStats(stats)
    }

    fetchData().catch(console.error)
  }, [slug])

  if (!router.isFallback && !slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <>
      <div className="flex flex-col items-center">
        <div className={'relative h-[15rem] w-full'}>
          <Image
            alt={title}
            src={coverImage}
            layout="fill"
            objectFit="contain"
            objectPosition="50% 50%"
          />
        </div>

        <div className="flex w-full p-4 py-8 md:px-8">
          <BackToProjects />
        </div>
        <article className="px-4 pb-8 md:px-8 lg:flex lg:flex-row-reverse lg:items-start">
          <aside className="bg-light mb-8 flex min-w-[20rem] items-center justify-between gap-4 rounded-xl p-4 lg:flex-col lg:items-start">
            <button
              onClick={openPaymentModal}
              className="block rounded border border-stone-800 bg-stone-800 px-4 py-2 font-semibold text-white hover:border-transparent hover:bg-blue-500 hover:text-stone-800 dark:bg-white dark:text-black dark:hover:bg-blue-500"
            >
              Donate
            </button>
            {addressStats && (
              <div>
                <h5>Raised</h5>
                <h4>{addressStats.funded_txo_sum} LTC</h4>
              </div>
            )}

            {addressStats && (
              <div>
                <h5>Donations</h5>
                <h4>{addressStats.tx_count}</h4>
              </div>
            )}
          </aside>

          <div className="max-w-[60ch] px-4 leading-relaxed text-gray-800 dark:text-gray-300 lg:px-8">
            <Link href={website} className="no-underline">
              <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                {title}
              </h1>
            </Link>
            <p className="prose max-w-none pb-8 pt-8 dark:prose-dark">
              {summary}
            </p>

            <p className="prose max-w-none pb-0 pt-0 dark:prose-dark">
              by{' '}
              <Link
                href={`https://twitter.com/${personalTwitter || twitter}`}
                passHref
              >
                {nym}
              </Link>
            </p>
            <ShareButtons project={project} />
            <hr className="mb-8"></hr>
            {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
          </div>
        </article>
      </div>
      <div className="flex w-full items-center justify-between pb-8">
        <h1 id="funds">You might also like...</h1>
      </div>
      <ProjectList
        projects={projects}
        exclude={slug}
        openPaymentModal={openPaymentModal}
      />
      <PaymentModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        project={selectedProject}
      />
    </>
  )
}

export default Project

export async function getStaticProps({ params }: { params: any }) {
  const post = getPostBySlug(params.slug)

  const projects = getAllPosts()
  console.log('before: ', post.content || 'nothing')
  const content = await markdownToHtml(post.content || '')
  console.log('after: ', content)
  return {
    props: {
      project: {
        ...post,
        content,
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
