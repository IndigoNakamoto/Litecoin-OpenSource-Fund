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
  openPaymentModal,
  bgColor,
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

  const showButton = project.bountyStatus !== 'completed'

  return (
    <figure
      className={`flex h-full flex-col justify-between rounded-3xl p-14 ${bgColor} dark:border-stone-800 dark:bg-stone-900 sm:space-y-2`}
    >
      {/* Wrap both the image and figcaption in a container with padding */}
      <Link href={`/missions/${slug}`} passHref>
        <div className="relative max-h-max min-h-[150px] w-[40%] min-w-[150px]">
          {/* Set width equal to height */}
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
      <figcaption className="flex flex-grow flex-col justify-between pt-8">
        <div className="h-32 sm:h-auto">
          <h2 className="font-space-grotesk text-[30px] font-semibold leading-[32px] tracking-wide text-[#333333]">
            {title}
          </h2>
          <div
            className="font-space-grotesk pt-4 text-[16px] font-medium tracking-wide text-[#333333] "
            style={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 4, // Limits to 4 lines
            }}
          >
            {summary}
          </div>
        </div>
      </figcaption>
      <div className="pt-12">
        <div className="mt-auto text-left">
          <Link
            href={`/missions/${slug}`}
            passHref
            className="text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-400 font-bold tracking-wider text-[#7e7e7e] underline"
            aria-label="FIND OUT MORE"
          >
            FIND OUT MORE &rarr;
          </Link>
        </div>
      </div>
    </figure>
  )
}

export default ProjectCard
