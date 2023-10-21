//utils/types.ts
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      username: string
      name: string
      id: string
      image: string
    }
  }
}

export type ProjectItem = {
  // Main:
  slug: string
  title: string
  summary: string
  socialSummary?: string
  coverImage: string
  content?: string

  // Community
  contributor?: string
  hashtag?: string

  // Resources:
  hidden?: boolean
  type: string
  nym?: string
  website?: string
  tutorials?: string[]
  git?: string
  twitter?: string
  owner?: string
  category: 'protocol' | 'bounty' | 'bug-report' | 'other'
  isRecurring?: boolean
  recurringAmount?: number
  bountyAmount?: number
  bountyStatus?: 'open' | 'in-progress' | 'completed' | 'closed'
  bugSeverity?: 'low' | 'medium' | 'high' | 'critical'
  bugStatus?: 'open' | 'in-progress' | 'resolved' | 'closed'
  expectedCompletion?: Date
  updates?: ProjectUpdate[]
}

export type ProjectUpdate = {
  content: string
  title: string
  summary: string
  tags?: string[]
  date: string
  authorTwitterHandle: string
  id: number
}

export type PayReq = {
  amount: number
  project_slug: string
  project_name: string
  email?: string
  twitter?: string
  name?: string
}

export type InfoReq = {
  slug: string
}

export type Stats = {
  usd: {
    donations: number
    total: number
  }
  btc: {
    donations: number
    total: number
  }
}

export type AddressStats = {
  tx_count: number
  funded_txo_sum: number
  supporters: Array<string>
}

export type TwitterUser = {
  name: string
  screen_name: string
  profile_image_url_https: string
}

export type TwitterUsers = [TwitterUser]
