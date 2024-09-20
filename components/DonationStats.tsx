// components/DonationStats.tsx
import React from 'react'
import { AddressStats } from '../utils/types' // Adjust the path as necessary

type DonationStatsProps = {
  addressStats: AddressStats
  isMatching: boolean
  isBitcoinOlympics2024: boolean
  isRecurring: boolean
  matchingTotal: number
  serviceFeeCollected: number
  totalPaid: number
  formatLits: (value: any) => string
  monthlyTotal?: number
  recurringAmountGoal?: number
  monthlyDonorCount?: number
  timeLeftInMonth?: number
}

type StatItemProps = {
  value: string | number
  label: string
}

const StatItem: React.FC<StatItemProps> = ({ value, label }) => (
  <div className="mt-2">
    <h4 className="font-space-grotesk text-3xl font-semibold text-blue-500">
      {value}
    </h4>
    <h4 className="font-space-grotesk">{label}</h4>
  </div>
)

const DonationStats: React.FC<DonationStatsProps> = ({
  addressStats,
  isMatching,
  isBitcoinOlympics2024,
  isRecurring,
  matchingTotal,
  serviceFeeCollected,
  totalPaid,
  formatLits,
  monthlyTotal,
  recurringAmountGoal,
  monthlyDonorCount,
  timeLeftInMonth,
}) => {
  if (!addressStats) return null

  return (
    <div className="flex w-full flex-col">
      {!isBitcoinOlympics2024 && !isRecurring && (
        <div className="flex w-full flex-col">
          <StatItem
            value={`Ł ${formatLits(addressStats.funded_txo_sum)}`}
            label="Litecoin Raised"
          />
          <StatItem
            value={`Ł ${formatLits(matchingTotal)}`}
            label="Donations Matched by Charlie Lee"
          />
          <StatItem
            value={`Ł ${formatLits(serviceFeeCollected)}`}
            label="15% Service Fee Collected"
          />
          <StatItem
            value={`Ł ${formatLits(totalPaid)}`}
            label="Litecoin Paid to Contributors"
          />
          <StatItem value={addressStats.tx_count || '0'} label="Donations" />
        </div>
      )}

      {isMatching && isBitcoinOlympics2024 && (
        <div className="flex w-full flex-col">
          <StatItem
            value={`Ł ${formatLits(addressStats.funded_txo_sum)}`}
            label="The Litecoin Community Raised Prize"
          />
          <StatItem
            value={`Ł ${formatLits(matchingTotal)}`}
            label="Prizes Matched by Charlie Lee & Galal Doss"
          />
          <StatItem
            value={`Ł ${formatLits(
              addressStats.funded_txo_sum + matchingTotal
            )} + $8,000`}
            label="Total Prize Pool"
          />
          <StatItem
            value={`Ł ${formatLits(totalPaid)}`}
            label="Awarded to Bitcoin Olympics 2024 Participants"
          />
          <StatItem value="Ł 0" label="15% Service Fee Collected" />
          <StatItem value={addressStats.tx_count || '0'} label="Donations" />
        </div>
      )}

      {isRecurring && (
        <div className="w-full rounded-lg text-gray-800">
          <div className="flex w-full flex-row lg:flex-col">
            <div>
              <h2 className="font-space-grotesk font-semibold">
                Total Donations
              </h2>
              <StatItem
                value={`Ł ${formatLits(addressStats.funded_txo_sum)}`}
                label="Litecoin Raised"
              />
              <StatItem
                value={addressStats.tx_count || '0'}
                label="Supporters"
              />
            </div>
            <div className="pl-16 lg:pl-0 lg:pt-4">
              <h2 className="font-space-grotesk font-semibold">Monthly Goal</h2>
              <div>
                <StatItem
                  value={`Ł ${formatLits(monthlyTotal)}`}
                  label={`Donated of Ł${recurringAmountGoal} monthly goal`}
                />
              </div>
              <div className="flex flex-row">
                <div className="flex flex-col">
                  <h4 className="mt-4 font-space-grotesk text-3xl font-semibold text-blue-500">
                    {monthlyDonorCount}
                  </h4>
                  <h4 className="font-space-grotesk">Supporters</h4>
                </div>
                <div className="ml-8 flex flex-col">
                  <h4 className="mt-4 font-space-grotesk text-3xl font-semibold text-blue-500">
                    {timeLeftInMonth}
                  </h4>
                  <h4 className="font-space-grotesk">Days to go</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DonationStats
