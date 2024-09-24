import Image from 'next/legacy/image'
import Link from 'next/link'
import { ProjectItem } from '../utils/types'

export type ProjectCardProps = {
  project: ProjectItem
  openPaymentModal: (project: ProjectItem) => void
  bgColor: string // Accept bgColor as a prop
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  // openPaymentModal,
  bgColor,
}) => {
  const {
    slug,
    title,
    summary,
    coverImage,
    // gitRepository,
    // twitterHandle,
    // nym,
  } = project

  // const showButton = project.bountyStatus !== 'completed'

  return (
    <figure
      className={`flex flex-col justify-between rounded-3xl p-4 sm:p-6 md:p-8 lg:p-14 ${bgColor} w-full space-y-4 overflow-y-auto sm:space-x-0 sm:space-y-0`}
    >
      <Link href={`/projects/${slug}`} passHref>
        <div className="relative max-h-max min-h-[150px] min-w-[150px] max-w-[200px]">
          <Image
            alt={title}
            src={coverImage}
            layout="fill"
            objectFit="cover"
            objectPosition="50% 50%"
            className="cursor-pointer rounded-xl"
            priority={true}
          />
        </div>
      </Link>
      <figcaption className="flex flex-1 flex-col justify-between pt-0 sm:pt-8">
        <div className="h-auto">
          <h2 className="font-space-grotesk text-2xl font-semibold leading-tight tracking-wide text-[#333333] sm:text-3xl">
            {title}
          </h2>
          <p
            className="pt-4 text-sm font-medium text-[#333333] sm:text-base"
            style={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 4, // Limits to 4 lines
            }}
          >
            {summary}
          </p>
        </div>
        <div className="mt-4 text-left ">
          <Link
            href={`/projects/${slug}`}
            passHref
            className="text-secondary-500 hover:text-secondary-600 font-bold tracking-wider text-[#7e7e7e] underline"
            aria-label="FIND OUT MORE"
          >
            FIND OUT MORE &rarr;
          </Link>
        </div>
      </figcaption>
    </figure>
  )
}

export default ProjectCard
