//pages/missions/[slug].tsx
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
import { fetchGetJSON } from '../../utils/api-helpers'
import TwitterUsers from '../../components/TwitterUsers'
import { TwitterUser } from '../../utils/types'
import Head from 'next/head'
import ProjectMenu from '../../components/ProjectMenu'
import TwitterFeed from '../../components/TwitterFeed'
import SocialMediaShare from '../../components/SocialMediaShare'
import tweetsData from '../../data/tweets.json'
import { FAQSection } from '@/components/FAQSection'

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

  async function fetchFAQData(slug: string) {
    try {
      const faqDataModule = await import(`../../data/projects/faq/${slug}.json`)
      return faqDataModule.default
    } catch (error) {
      console.error('Error fetching FAQ data:', error)
      return {} // Return an empty object if there's an error (e.g., file doesn't exist)
    }
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
    contributor,
    hashtag,
    socialSummary,
  } = project

  // const [stats, setStats] = useState<Stats>()
  const [addressStats, setAddressStats] = useState<AddressStats>()
  const [twitterUsers, setTwitterUsers] = useState<TwitterUser[]>([])
  const [twitterContributors, setTwitterContributors] = useState<TwitterUser[]>(
    []
  )

  const [faq, setFaq] = useState<any>({})
  const [faqCount, setFaqCount] = useState<any>()

  useEffect(() => {
    async function loadFAQData() {
      const data = await fetchFAQData(slug)
      const totalItems = data?.questionsAndAnswers?.reduce((acc, category) => {
        return acc + category.items.length
      }, 0)
      setFaqCount(totalItems)
      setFaq(data)
    }

    loadFAQData()
  }, [slug])

  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(
    'mission'
  )

  // Define a handler function for menu item changes.
  const handleMenuItemChange = (newMenuItem) => {
    setSelectedMenuItem(newMenuItem)

    // Update the URL without causing a page reload
    // const updatedURL = `/missions/${slug}?menu=${newMenuItem}`
    // router.push(updatedURL, undefined, { shallow: true })
    return newMenuItem
  }

  useEffect(() => {
    // Check for menu query parameter
    if (router.query.menu) {
      switch (router.query.menu) {
        case 'community':
          setSelectedMenuItem('community')
          break
        case 'comments':
          setSelectedMenuItem('comments')
          break
        case 'faq':
          setSelectedMenuItem('faq')
          break
        case 'updates':
          setSelectedMenuItem('updates')
          break
        case 'project':
          setSelectedMenuItem('mission')
          break
        default:
          setSelectedMenuItem('mission')
      }
    } else {
      setSelectedMenuItem('mission')
    }
  }, [router.query])

  useEffect(() => {
    const fetchData = async () => {
      // Fetch mission info
      setAddressStats(undefined)
      const stats = await fetchGetJSON(`/api/getInfo/?slug=${slug}`)
      setAddressStats(stats)

      // Fetch Twitter user details
      if (stats.supporters && stats.supporters.length > 0) {
        const supporters = stats.supporters
          .map((supporter) => {
            if (typeof supporter === 'string' || supporter instanceof String) {
              return extractUsername(supporter)
            } else {
              return 'anonymous'
            }
          })
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
        <title>Lite.Space | {slug}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={summary} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@LTCFoundation" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={summary} />
        {/* <meta name="twitter:creator" content="@LTCFoundation" /> */}
        <meta
          name="twitter:image"
          content={`https://www.lite.space${coverImage}`}
        />
        <meta
          property="og:image"
          content={`https://www.lite.space${coverImage}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div>
        <article className="mt-10 flex flex-col-reverse xl:flex-row xl:items-start">
          <div className="content max-w-max rounded-xl bg-gradient-to-b from-gray-100 to-white p-4 leading-relaxed text-gray-700 dark:from-gray-800 dark:to-gray-800 dark:text-gray-300 md:px-8 xl:mr-5 xl:max-w-[84ch]">
            {/* ## PROJECT HEADER */}
            <h1 className="pb-4 text-3xl font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
              {title}
            </h1>

            <p className="prose max-w-none pb-0 pt-0 text-xl font-medium dark:prose-dark">
              {summary}
            </p>

            {/* ## PROJECT CONTENT */}
            <ProjectMenu
              onMenuItemChange={handleMenuItemChange}
              activeMenu={selectedMenuItem}
              commentCount={
                hashtag && tweetsData[hashtag] ? tweetsData[hashtag].length : 0
              }
              faqCount={faqCount || 0}
              updatesCount={0}
            />
            {/* ### Mission Section */}
            {selectedMenuItem === 'mission' && content && (
              <div
                className="markdown min-h-[70vh]"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
            {/* ### X Comments Section */}
            {selectedMenuItem === 'comments' && (
              <div className="markdown">
                <h1>{`${hashtag}`}</h1>
                <TwitterFeed hashtag={hashtag} tweetsData={tweetsData} />
              </div>
            )}
            {/* ### FAQ Section */}
            {selectedMenuItem === 'faq' && (
              <div className="markdown">
                <FAQSection faqCategories={faq.questionsAndAnswers} />
              </div>
            )}
            {/* ### Updates Section */}
            {selectedMenuItem === 'updates' && content && (
              <div className="markdown min-h-full"></div>
            )}
            {/* ### Community Section */}
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
          {/* TODO: Make the aside sticky so that when scroll, it does not move */}
          <aside className="top-32 mb-8 flex min-w-[20rem] flex-col space-y-4 rounded-xl bg-gradient-to-b from-gray-100 to-gray-100 p-8 dark:from-gray-800 dark:to-gray-700 xs:p-4 md:p-8 lg:items-start xl:sticky xl:p-4">
            <div className="relative h-[20rem] w-full overflow-hidden rounded-lg xl:h-[14rem] ">
              <Image
                alt={title}
                src={coverImage}
                layout="fill"
                objectFit="cover"
                objectPosition="50% 50%"
                priority={true}
              />
            </div>

            <div className="flex w-full items-start space-x-8 sm:flex-row sm:items-center">
              {addressStats && (
                <div className="">
                  <h5 className="text-3xl font-semibold">
                    {addressStats.tx_count}
                  </h5>
                  <h4 className="text-sm">Donations</h4>
                </div>
              )}

              {addressStats && (
                <div className="">
                  <h5 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
                    Ł {addressStats.funded_txo_sum}{' '}
                  </h5>
                  <h4 className="text-sm">Litecoin Raised</h4>
                </div>
              )}
            </div>

            <button
              onClick={openPaymentModal}
              className="hover:white block w-full rounded bg-blue-500 text-xl  text-white hover:border-transparent hover:bg-blue-400 dark:bg-blue-400 dark:text-gray-100 dark:hover:bg-blue-300"
            >
              Support this mission
            </button>
            <SocialMediaShare
              className="mt-0 flex space-x-4 "
              title={title}
              summary={socialSummary}
            />
          </aside>
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
