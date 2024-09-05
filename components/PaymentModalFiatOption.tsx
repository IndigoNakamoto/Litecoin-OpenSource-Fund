import React, { useState, useRef } from 'react'

export default function PaymentModalFiatOption() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100)
  const [customAmount, setCustomAmount] = useState('') // State for manual input
  const [coverFees, setCoverFees] = useState(false) // State for covering transaction fees
  const inputRef = useRef<HTMLInputElement>(null) // Ref for input element

  const buttonValues = [50, 100, 250, 500, 1000, 2500]

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount)
    setCustomAmount('') // Clear custom amount when a default button is selected
    setCoverFees(false) // Reset cover fees checkbox when a default button is selected
  }

  const handleInputChange = (e) => {
    const value = e.target.value

    // Validate the input value to ensure it's a positive number with up to 2 decimal places
    if (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value) >= 0) {
      setCustomAmount(value)
      setSelectedAmount(null) // Clear the selected amount when user manually enters an amount
      setCoverFees(false) // Reset cover fees checkbox when user manually enters an amount
    }
  }

  const handleInputBlur = () => {
    if (customAmount !== '') {
      const formattedAmount = parseFloat(customAmount).toFixed(2)
      setCustomAmount(formattedAmount)
    }
  }

  const handleCoverFeesChange = () => {
    setCoverFees((prev) => !prev)

    // If checkbox is selected, apply the transaction fee
    if (!coverFees && inputRef.current) {
      const baseAmount = parseFloat(customAmount) || selectedAmount || 0
      const totalAmount = (baseAmount * 1.030928).toFixed(2)
      setCustomAmount(totalAmount)
    } else if (coverFees && inputRef.current) {
      // If checkbox is deselected, remove the transaction fee
      const baseAmount = parseFloat(customAmount) / 1.030928
      setCustomAmount(baseAmount.toFixed(2))
    }
  }

  // Determine the displayed amount in the input
  const displayAmount =
    customAmount || (selectedAmount ? selectedAmount.toFixed(2) : '')

  // Determine the background style of the input
  const isCustomAmount =
    !buttonValues.includes(Number(displayAmount)) && customAmount !== ''

  return (
    <div className="flex w-full flex-col gap-4 pt-5">
      <div className="flex h-full w-full justify-between space-x-6 pt-6 font-space-grotesk">
        {buttonValues.slice(0, 3).map((value) => (
          <button
            key={value}
            className={`w-[24vw] rounded-3xl border border-white ${
              selectedAmount === value
                ? 'bg-white text-[#222222]'
                : 'bg-[#222222] text-white'
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
            className={`w-[24vw] rounded-3xl border border-white ${
              selectedAmount === value
                ? 'bg-white text-[#222222]'
                : 'bg-[#222222] text-white'
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
              ? 'bg-white text-[#222222]'
              : 'bg-[#222222] text-white'
          }`}
        >
          $
        </span>
        <input
          type="number"
          ref={inputRef}
          className={`w-full appearance-none rounded-3xl border pl-8 pr-4 font-space-grotesk text-lg font-semibold ${
            isCustomAmount
              ? 'bg-white text-[#222222]'
              : 'bg-[#222222] text-white'
          }`}
          value={displayAmount}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          step="0.01" // Ensures input increments by pennies
          min="0" // Ensures no negative values
          style={{ paddingLeft: '2rem' }} // Ensure padding does not hide the dollar sign
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
        <label htmlFor="cover-transaction-fees" className="text-white">
          Cover transaction fees (?)
        </label>
      </div>
    </div>
  )
}
