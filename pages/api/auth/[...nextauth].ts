// Import the Session type from NextAuth
//pages/pai/auth/[...nextauth].ts
import { Session, Profile } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import NextAuth from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'

// Extend the Session type to include the username property
interface CustomSession extends Session {
  user: {
    name: string
    email: string
    image: string
    username: string
    id: string
  }
}

interface CustomProfile {
  data: {
    id: string
    name: string
    image: string
    username: string
  }
}

export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      version: '2.0', // opt-in to Twitter OAuth 2.0
      profile(profile) {
        const { id, name, username, profile_image_url: image } = profile.data
        console.log('PROFILE: ', profile)
        return {
          id,
          name,
          username,
          image,
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, profile }) => {
      console.log('PROFILE in JWT:', profile)
      if (profile) {
        const customProfile = profile as CustomProfile // Cast to CustomProfile
        token.username = customProfile.data.username
      }
      return token
    },
    session: async ({ session, token, user }) => {
      console.log('TOKEN in session: ', token)
      const customSession = session as CustomSession
      customSession.user.username = token.username as string // Cast to string to satisfy TypeScript
      return customSession
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // other options...
})
