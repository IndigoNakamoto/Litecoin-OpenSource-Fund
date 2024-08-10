import Image from 'next/legacy/image'
import Link from 'next/link'
import { ProjectItem } from '../utils/types'

export type ProjectCardProps = {
  project: ProjectItem
  openPaymentModal: (project: ProjectItem) => void
  showButton?: boolean // Make showButton optional with a default value
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

  const showButton = project.bountyStatus !== 'completed'

  return (
    <figure className="h-full rounded-xl border border-stone-200 bg-[#EEEEEE] dark:border-stone-800 dark:bg-stone-900 sm:space-y-2">
      {/* TODO: Change from card to 2 columns for xl */}
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
        <div className="h-32 ">
          <h2
            className="font-space-grotesk text-[30px] font-semibold leading-[32px] tracking-[-0.5px] text-[#222222]"
            style={{
              wordSpacing: '0px',
              textTransform: 'none',
              textDecoration: 'none',
              transform: 'scaleX(1.2)', // Slight horizontal scaling
              transformOrigin: 'left center',
            }}
          >
            {title}
          </h2>
          <div className="font-space-grotesk pt-4 text-[16px] font-normal">
            {summary}
          </div>
        </div>
        <div className="pt-4">
          <div className="pt-2 text-left">
            <Link
              href={`/missions/${slug}`}
              passHref
              className="text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-400 hover:underline"
              aria-label="FIND OUT MORE"
            >
              FIND OUT MORE &rarr;
            </Link>
          </div>
        </div>
      </figcaption>
    </figure>
  )
}

export default ProjectCard
