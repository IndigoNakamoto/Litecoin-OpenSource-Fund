// components/CommunitySection.tsx
import TwitterUsers from '@/components/TwitterUsers'
import React from 'react'
import { TwitterUser } from '../utils/types' // Adjust the path as necessary

type CommunitySectionProps = {
  twitterContributors: TwitterUser[]
  twitterContributorsBitcoin: TwitterUser[]
  twitterContributorsLitecoin: TwitterUser[]
  twitterAdvocates: TwitterUser[]
  twitterUsers: TwitterUser[]
  isBitcoinOlympics2024: boolean
}

const CommunitySection: React.FC<CommunitySectionProps> = ({
  twitterContributors,
  twitterContributorsBitcoin,
  twitterContributorsLitecoin,
  twitterAdvocates,
  twitterUsers,
  isBitcoinOlympics2024,
}) => (
  <>
    <div className="markdown">
      {twitterContributors.length > 0 && !isBitcoinOlympics2024 && (
        <>
          <h3>
            {twitterContributors.length > 1 ? 'Contributors' : 'Contributor'}
          </h3>
          <TwitterUsers users={twitterContributors} />
        </>
      )}
    </div>
    <div className="markdown">
      {twitterContributors.length > 0 && isBitcoinOlympics2024 && (
        <>
          <h3>
            {twitterContributors.length > 1
              ? 'BTC Startup Labs'
              : 'Contributor'}
          </h3>
          <TwitterUsers users={twitterContributors} />
        </>
      )}
    </div>
    <h2 className="markdown font-space-grotesk text-3xl font-semibold">
      The Community
    </h2>
    <div className="markdown">
      {twitterContributorsLitecoin.length > 0 && (
        <>
          <h3>
            {twitterContributorsLitecoin.length > 1
              ? 'Litecoin Contributors'
              : 'Litecoin Contributor'}
          </h3>
          <TwitterUsers users={twitterContributorsLitecoin} />
        </>
      )}
    </div>
    <div className="markdown">
      {twitterContributorsBitcoin.length > 0 && (
        <>
          <h3>
            {twitterContributorsBitcoin.length > 1
              ? 'Bitcoin Contributors'
              : 'Bitcoin Contributor'}
          </h3>
          <TwitterUsers users={twitterContributorsBitcoin} />
        </>
      )}
    </div>
    <div className="markdown">
      {twitterAdvocates.length > 0 && (
        <>
          <h3>{twitterAdvocates.length > 1 ? 'Advocates' : 'Advocate'}</h3>
          <TwitterUsers users={twitterAdvocates} />
        </>
      )}
    </div>
    <div className="markdown">
      {twitterUsers.length > 0 && (
        <>
          <h3>{twitterUsers.length > 1 ? 'Supporters' : 'Supporter'}</h3>
          <TwitterUsers users={twitterUsers} />
        </>
      )}
    </div>
  </>
)

export default CommunitySection
