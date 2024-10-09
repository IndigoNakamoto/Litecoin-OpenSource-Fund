import React from 'react'
import DonationStats from './DonationStats'
import Image from 'next/image'
import { BountyStatus, AddressStats } from '../utils/types'
import {
  defaultAddressStats,
  defaultBountyStatus,
} from '../utils/defaultValues'
import { customImageLoader } from '../utils/customImageLoader'

type AsideSectionProps = {
  title: string
  coverImage: string
  addressStats?: AddressStats
  isMatching?: boolean
  isBitcoinOlympics2024?: boolean
  isRecurring?: boolean
  matchingTotal?: number
  serviceFeeCollected?: number
  totalPaid?: number
  matchingDonors?: []
  formatLits: (value: any) => string
  formatUSD: (value: any) => string
  monthlyTotal?: number
  recurringAmountGoal?: number
  monthlyDonorCount?: number
  timeLeftInMonth?: number
  bountyStatus?: BountyStatus
  openPaymentModal: () => void
}

const AsideSection: React.FC<AsideSectionProps> = ({
  title,
  coverImage,
  addressStats = defaultAddressStats,
  isMatching = false,
  isBitcoinOlympics2024 = false,
  isRecurring = false,
  matchingTotal = 0,
  serviceFeeCollected = 0,
  totalPaid = 0,
  matchingDonors = [],
  formatLits,
  formatUSD,
  monthlyTotal = 0,
  recurringAmountGoal = 0,
  monthlyDonorCount = 0,
  timeLeftInMonth = 0,
  bountyStatus = defaultBountyStatus,
  openPaymentModal,
}) => (
  <aside className="top-32 mb-8 flex min-w-[20rem] flex-col space-y-4 bg-[#dddddd] p-4 lg:sticky lg:flex-col lg:space-x-4 lg:space-y-0">
    {/* Image and Donate Button Wrapper */}
    <div className="relative w-full max-w-full">
      {/* Cover Image */}
      <div className="relative max-h-max min-h-[150px] min-w-[150px] max-w-full">
        <Image
          loader={customImageLoader} // Use the custom loader
          src={coverImage}
          alt={title}
          fill
          style={{ objectFit: 'cover', objectPosition: '50% 50%' }} // Moved styling to 'style' prop
          className=""
          priority={true}
          sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
        />
      </div>
      {/* Donation Stats */}
      <div className="flex w-full flex-col pt-4">
        <DonationStats
          addressStats={addressStats}
          isMatching={isMatching}
          isBitcoinOlympics2024={isBitcoinOlympics2024}
          isRecurring={isRecurring}
          matchingTotal={matchingTotal}
          serviceFeeCollected={serviceFeeCollected}
          matchingDonors={matchingDonors}
          totalPaid={totalPaid}
          formatUSD={formatUSD}
          monthlyTotal={monthlyTotal}
          recurringAmountGoal={recurringAmountGoal}
          monthlyDonorCount={monthlyDonorCount}
          timeLeftInMonth={timeLeftInMonth}
        />
      </div>

      {/* Donate Button */}
      <div className="relative w-full pt-6">
        <button
          onClick={openPaymentModal}
          className={`block w-full rounded-none bg-[#222222] font-space-grotesk text-xl font-semibold text-white transition-colors duration-200 hover:border-transparent hover:bg-[#363636] ${
            bountyStatus === 'completed' ? 'disabled' : ''
          }`}
          disabled={bountyStatus === 'completed'}
        >
          {bountyStatus === 'completed' ? 'Project Completed' : 'Donate'}
        </button>
      </div>
    </div>
  </aside>
)

export default AsideSection
