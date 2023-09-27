import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { getPostBySlug, getAllPosts } from '../../utils/md'
import markdownToHtml from '../../utils/markdownToHtml'
import Image from 'next/legacy/image'
// import ProjectList from '../../components/ProjectList'
// import BackToProjects from '../../components/BackToProjects'
import { ProjectItem, AddressStats } from '../../utils/types'
import { NextPage } from 'next/types'
import { useEffect, useState } from 'react'
import PaymentModal from '../../components/PaymentModal'
import Link from 'next/link'
// import ShareButtons from '../../components/ShareButtons'
import { fetchGetJSON } from '../../utils/api-helpers'
import TwitterUsers from '../../components/TwitterUsers'
import { TwitterUser } from '../../utils/types'
import Head from 'next/head'

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
    console.log('opening single project modal...')
    setSelectedProject(project)
    setModalOpen(true)
  }

  function extractUsername(url) {
    // This regex will match any string that ends with a forward slash followed by any sequence of non-slash characters.
    const regex = /\/([^/]+)$/
    const match = url.match(regex)
    return match ? match[1] : url // If the regex matched, return the captured group; otherwise, return the original url.
  }

  const {
    slug,
    title,
    summary,
    coverImage,
    // git,
    // twitter,
    content,
    // nym,
    website,
    // personalTwitter,
  } = project

  // const [stats, setStats] = useState<Stats>()
  const [addressStats, setAddressStats] = useState<AddressStats>()
  const [twitterUsers, setTwitterUsers] = useState<TwitterUser[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setAddressStats(undefined)
      const stats = await fetchGetJSON(`/api/getInfo/?slug=${slug}`)
      setAddressStats(stats)
      // Fetch Twitter user details
      if (stats.supporters && stats.supporters.length > 0) {
        const usernames = stats.supporters
          .map((supporter) => extractUsername(supporter))
          .join(',')
        const response = await fetch(`/api/twitterUsers?usernames=${usernames}`)
        const twitterUsers = await response.json()
        setTwitterUsers(twitterUsers)
      }
    }

    fetchData().catch(console.error)
  }, [slug])

  if (!router.isFallback && !slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <>
      <Head>
        <title>Lite.Space | {slug}</title>
      </Head>
      <div>
        <article className="lg:flex lg:flex-row lg:items-start">
          <aside className="mb-8 flex min-w-[16rem] flex-col gap-4 lg:sticky lg:top-32 lg:flex-col lg:items-start">
            <div className={'relative h-[18rem] w-full sm:h-[12rem] sm:w-full'}>
              <Image
                alt={title}
                src={coverImage}
                layout="fill"
                objectFit="contain"
                objectPosition="50% 50%"
              />
            </div>
            <div className="flex w-full flex-col items-start gap-8 p-4 sm:flex-row sm:items-center sm:gap-8">
              {addressStats && (
                <div className="text-center sm:text-left">
                  <h5>Raised</h5>
                  <h4>Ł {addressStats.funded_txo_sum} </h4>
                </div>
              )}

              {addressStats && (
                <div className="text-center sm:text-left">
                  <h5>Donations</h5>
                  <h4>{addressStats.tx_count}</h4>
                </div>
              )}
            </div>

            <button
              onClick={openPaymentModal}
              className="hover:white block w-full rounded border border-stone-800 bg-stone-800 px-2 py-1 text-sm font-semibold text-white hover:border-transparent hover:bg-blue-500 dark:bg-white dark:text-black dark:hover:bg-blue-500 sm:px-4 sm:py-2 sm:text-base"
            >
              Donate
            </button>
          </aside>

          <div className="content max-w-[100ch] px-4 leading-relaxed text-gray-800 dark:text-gray-300 lg:px-8">
            <Link href={website} className="no-underline">
              <h1 className="pb-4 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                {title}
              </h1>
            </Link>
            <p className="prose max-w-none pb-0 pt-0 dark:prose-dark">
              {summary}
            </p>
            {content && (
              <div
                className="markdown"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
            <div className="markdown">
              {twitterUsers.length > 0 ? (
                <>
                  <h1>Supporters</h1>
                  <TwitterUsers users={twitterUsers} />
                </>
              ) : null}
            </div>
          </div>
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
  console.log('params: ', params)
  const post = getPostBySlug(params.slug)

  const projects = getAllPosts()
  const content = await markdownToHtml(post.content || '')
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
