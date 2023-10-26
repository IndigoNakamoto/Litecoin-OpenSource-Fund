import Image from 'next/legacy/image'

import Link from 'next/link'
import { ProjectItem } from '../utils/types'

export type ProjectCardProps = {
  project: ProjectItem
  openPaymentModal: (project: ProjectItem) => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  openPaymentModal,
}) => {
  const {
    slug,
    title,
    summary,
    coverImage,
    gitRepository,
    twitterHandle,
    nym,
  } = project

  return (
    <figure className="h-full rounded-xl border border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-900 sm:space-y-2">
      <div className="relative h-64 w-full">
        <Link href={`/missions/${slug}`} passHref>
          <div className="relative h-64 w-full">
            <Image
              alt={title}
              src={coverImage}
              layout="fill"
              objectFit="cover"
              objectPosition="50% 50%"
              className="cursor-pointer rounded-t-xl bg-white dark:bg-black"
              priority={true}
            />
          </div>
        </Link>
      </div>

      <figcaption className="flex h-max flex-col justify-between p-4">
        <div className="h-28 ">
          <h2 className="font-bold">{title}</h2>
          <div className="line-clamp-3 ">{summary}</div>
        </div>
        <div className="grid grid-cols-2 pt-4">
          {' '}
          <button
            className="rounded border border-stone-800 bg-stone-800 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:border-transparent  hover:bg-blue-400 hover:text-white dark:bg-white dark:text-black dark:hover:bg-blue-400 hover:dark:text-white"
            onClick={() => openPaymentModal(project)}
          >
            Donate
          </button>
          <Link
            href={`/missions/${slug}`}
            passHref
            className="text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-400 pt-2 text-center hover:underline"
            aria-label="View Details"
          >
            View Details &rarr;
          </Link>
        </div>
      </figcaption>
    </figure>
  )
}

export default ProjectCard
