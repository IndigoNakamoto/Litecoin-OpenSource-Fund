export type ProjectItem = {
  slug: string
  nym: string
  content?: string
  title: string
  summary: string
  coverImage: string
  git: string
  twitter?: string
  website: string
  personalTwitter?: string
  bonusUSD?: number
  hidden?: boolean
  type: string
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
