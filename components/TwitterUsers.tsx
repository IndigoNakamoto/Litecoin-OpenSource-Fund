// components/TwitterUsers.tsx
import Link from './Link'
import Image from 'next/image' // Import the next/image component
import Head from 'next/head'

type TwitterUser = {
  name: string
  screen_name: string
  profile_image_url_https: string
}

type TwitterUsersProps = {
  users: TwitterUser[]
}

const TwitterUsers: React.FC<TwitterUsersProps> = ({ users }) => {
  return (
    <div className="col-span-2 col-start-2 grid grid-cols-2 space-y-2 sm:gap-x-2 md:grid-cols-3 md:gap-x-8">
      {users.map((user, index) => (
        <div className="items-left flex flex-col space-x-2 pt-8" key={index}>
          {index < 3 && ( // Preload first three images (if critical)
            <Head>
              <link
                rel="preload"
                as="image"
                href={user.profile_image_url_https.replace('_normal', '')}
              />
            </Head>
          )}
          <Link href={`https://twitter.com/${user.screen_name}`}>
            <Image
              src={user.profile_image_url_https.replace('_normal', '')}
              alt={user.name}
              width={120}
              height={120}
              className="h-36 w-36 rounded-full"
              loading="lazy" // Apply lazy loading
            />
          </Link>
        </div>
      ))}
    </div>
  )
}

export default TwitterUsers
