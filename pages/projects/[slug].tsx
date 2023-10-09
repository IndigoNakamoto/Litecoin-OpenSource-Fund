//pages/projects/[slug].tsx
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
// import Link from 'next/link'
// import ShareButtons from '../../components/ShareButtons'
import { fetchGetJSON } from '../../utils/api-helpers'
import TwitterUsers from '../../components/TwitterUsers'
import { TwitterUser } from '../../utils/types'
import Head from 'next/head'
import ProjectMenu from '../../components/ProjectMenu'
import TwitterFeed from '../../components/TwitterFeed'

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

  const {
    slug,
    title,
    summary,
    coverImage,
    // git,
    // twitter,
    content,
    // nym,
    // website,
    // personalTwitter,
    contributor,
    hashtag,
  } = project

  // const [stats, setStats] = useState<Stats>()
  const [addressStats, setAddressStats] = useState<AddressStats>()
  const [twitterUsers, setTwitterUsers] = useState<TwitterUser[]>([])
  const [twitterContributors, setTwitterContributors] = useState<TwitterUser[]>(
    []
  )
  // Add a state variable for the selected menu item.
  const [selectedMenuItem, setSelectedMenuItem] = useState('project')

  // Define a handler function for menu item changes.
  const handleMenuItemChange = (newMenuItem) => {
    setSelectedMenuItem(newMenuItem)
  }

  useEffect(() => {
    const fetchData = async () => {
      setAddressStats(undefined)
      const stats = await fetchGetJSON(`/api/getInfo/?slug=${slug}`)
      // console.log('stats.supporters: ', stats.supporters)
      // console.log('Contributor: ', contributor)

      setAddressStats(stats)
      // Fetch Twitter user details
      if (stats.supporters && stats.supporters.length > 0) {
        const supporters = stats.supporters
          .map((supporter) => extractUsername(supporter))
          .join(',')

        const response = await fetch(
          `/api/twitterUsers?usernames=${supporters}`
        )
        const twitterUsers = await response.json()
        setTwitterUsers(twitterUsers)
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
    }

    fetchData().catch(console.error)
  }, [contributor, slug])

  if (!router.isFallback && !slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <>
      <Head>
        <title>{slug} - Lite.Space</title>
      </Head>
      <div>
        <article className="mt-10 lg:flex lg:flex-row lg:items-start">
          {/* Aside */}
          <aside className="mb-8 flex min-w-[16rem] flex-col gap-4 lg:sticky lg:top-32 lg:flex-col lg:items-start">
            <div className={'relative h-[16rem] w-full sm:w-full'}>
              <Image
                alt={title}
                src={coverImage}
                layout="fill"
                objectFit="cover"
                objectPosition="50% 50%"
              />
            </div>
            <div className="flex w-full items-start gap-8 p-4 sm:flex-row sm:items-center sm:gap-8">
              {addressStats && (
                <div className="">
                  <h5 className="text-xl font-bold">
                    Ł {addressStats.funded_txo_sum}{' '}
                  </h5>
                  <h4 className="text-sm">Raised</h4>
                </div>
              )}

              {addressStats && (
                <div className="">
                  <h5 className="text-xl font-bold">{addressStats.tx_count}</h5>
                  <h4 className="text-sm">Donations</h4>
                </div>
              )}
            </div>

            <button
              onClick={openPaymentModal}
              className="hover:white block w-full rounded border bg-blue-500 px-2 py-1 text-sm font-semibold text-white hover:border-transparent hover:bg-blue-600 dark:bg-white dark:text-black dark:hover:bg-blue-500 sm:px-4 sm:py-2 sm:text-base"
            >
              Donate
            </button>
          </aside>
          {/* Body */}
          <div className="content max-w-[100ch] px-4 leading-relaxed text-gray-800 dark:text-gray-300 lg:px-8">
            <h1 className="pb-4 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
              {title}
            </h1>

            <p className="prose max-w-none pb-0 pt-0 dark:prose-dark">
              {summary}
            </p>
            <ProjectMenu onMenuItemChange={handleMenuItemChange} />
            {/* Use conditional rendering to change the displayed content. */}
            {selectedMenuItem === 'project' && content && (
              <div
                className="markdown min-h-[70vh]"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
            {selectedMenuItem === 'comments' && (
              // #MESSAGES SECTION!!
              <div className="markdown min-h-[70vh]">
                {/* Render comments content here */}
                <h1>{`${hashtag}`}</h1>
                <TwitterFeed hashtag={hashtag} />
              </div>
              // END OF MESSAGES SECTION.
            )}
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
