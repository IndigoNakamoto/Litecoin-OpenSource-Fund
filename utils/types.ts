export type ProjectItem = {
  title: string
  summary: string
  slug: string
  git?: string
  content?: string
  coverImage: string
  nym?: string
  website?: string
  twitter?: string
  personalTwitter?: string
  hidden?: boolean
  type: string
  contributor?: string
  owner?: string
  hashtag?: string
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
