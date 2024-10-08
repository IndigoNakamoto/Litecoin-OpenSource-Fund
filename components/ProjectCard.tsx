// components/ProjectCard.js
import Image from 'next/image'
import Link from 'next/link'
import { ProjectItem } from '../utils/types'
import { customImageLoader } from '../utils/customImageLoader'

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
  const { slug, title, summary, coverImage } = project

  console.log('Image website url: ', coverImage)

  return (
    <figure
      className={`flex flex-col justify-between rounded-3xl p-4 sm:p-6 md:p-6 ${bgColor} w-full space-y-4 overflow-y-auto sm:space-x-0 sm:space-y-0`}
    >
      <Link href={`/projects/${slug}`} passHref>
        <div className="relative max-h-max min-h-[150px] min-w-[150px] max-w-full">
          <Image
            loader={customImageLoader} // Use the custom loader
            src={coverImage} // Ensure this is a valid URL from Webflow
            alt={title}
            fill // Replaces layout="fill"
            style={{ objectFit: 'cover', objectPosition: '50% 50%' }} // Moved styling to 'style' prop
            className="cursor-pointer rounded-xl"
            priority={true}
            sizes="(max-width: 768px) 100vw,
                   (max-width: 1200px) 50vw,
                   33vw"
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
        <div className="mt-4 text-left">
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
