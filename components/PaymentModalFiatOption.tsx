import React, { useState, useRef } from 'react'
import { useDonation } from '../contexts/DonationContext'

export default function PaymentModalFiatOption() {
  const { dispatch } = useDonation()
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100)
  const [customAmount, setCustomAmount] = useState('')
  const [coverFees, setCoverFees] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const buttonValues = [50, 100, 250, 500, 1000, 2500]

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
    setCoverFees(false)
    dispatch({ type: 'SET_PLEDGED_AMOUNT', payload: amount.toString() }) // Set amount in context
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value) >= 0) {
      setCustomAmount(value)
      setSelectedAmount(null)
      setCoverFees(false)
      dispatch({ type: 'SET_PLEDGED_AMOUNT', payload: value }) // Update state with custom amount
    }
  }

  const handleInputBlur = () => {
    if (customAmount !== '') {
      const formattedAmount = parseFloat(customAmount).toFixed(2)
      setCustomAmount(formattedAmount)
      dispatch({ type: 'SET_PLEDGED_AMOUNT', payload: formattedAmount }) // Update on blur
    }
  }

  const handleCoverFeesChange = () => {
    setCoverFees((prev) => !prev)
    if (!coverFees && inputRef.current) {
      const baseAmount = parseFloat(customAmount) || selectedAmount || 0
      const totalAmount = (baseAmount * 1.030928).toFixed(2)
      setCustomAmount(totalAmount)
      dispatch({ type: 'SET_PLEDGED_AMOUNT', payload: totalAmount }) // Adjust for fees
    } else if (coverFees && inputRef.current) {
      const baseAmount = parseFloat(customAmount) / 1.030928
      setCustomAmount(baseAmount.toFixed(2))
      dispatch({ type: 'SET_PLEDGED_AMOUNT', payload: baseAmount.toFixed(2) }) // Revert fees
    }
  }

  const displayAmount =
    customAmount || (selectedAmount ? selectedAmount.toFixed(2) : '')

  const isCustomAmount =
    !buttonValues.includes(Number(displayAmount)) && customAmount !== ''

  return (
    <div className="flex w-full flex-col gap-4 pt-5">
      <div className="flex h-full w-full justify-between space-x-6 pt-6 font-space-grotesk">
        {buttonValues.slice(0, 3).map((value) => (
          <button
            key={value}
            className={`w-[24vw] rounded-3xl border border-[#222222] ${
              selectedAmount === value
                ? 'bg-[#222222] text-[#f0f0f0]'
                : 'bg-[#f0f0f0] text-[#222222]'
            } text-lg font-semibold`}
            onClick={() => handleAmountClick(value)}
          >
            ${value}
          </button>
        ))}
      </div>
      <div className="flex h-full w-full justify-between space-x-6 font-space-grotesk">
        {buttonValues.slice(3).map((value) => (
          <button
            key={value}
            className={`w-[24vw] rounded-3xl border border-[#222222] ${
              selectedAmount === value
                ? 'bg-[#222222] text-[#f0f0f0]'
                : 'bg-[#f0f0f0] text-[#222222]'
            } text-lg font-semibold`}
            onClick={() => handleAmountClick(value)}
          >
            ${value}
          </button>
        ))}
      </div>
      <div className="relative w-full">
        <span
          className={`absolute left-4 top-1/2 -translate-y-1/2 font-space-grotesk text-lg font-semibold text-[#222222] ${
            isCustomAmount
              ? 'bg-[#222222] text-[#f0f0f0]'
              : 'bg-[#f0f0f0] text-[#222222]'
          }`}
        >
          $
        </span>
        <input
          type="number"
          ref={inputRef}
          className={`w-full appearance-none rounded-3xl border pl-8 pr-4 font-space-grotesk text-lg font-semibold ${
            isCustomAmount
              ? 'bg-[#222222] text-[#f0f0f0]'
              : 'bg-[#f0f0f0] text-[#222222]'
          }`}
          value={displayAmount}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          step="0.01"
          min="0"
          style={{ paddingLeft: '2rem' }}
        />
      </div>
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={coverFees}
          onChange={handleCoverFeesChange}
          className="h-4 w-4 border-white bg-[#222222]"
          id="cover-transaction-fees"
        />
        <label htmlFor="cover-transaction-fees" className="text-[#222222]">
          Cover transaction fees (?)
        </label>
      </div>
    </div>
  )
}
