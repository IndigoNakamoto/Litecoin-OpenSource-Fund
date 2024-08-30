import React, { useState } from 'react'

// 3.0928% transaction fee from shift4

export default function PaymentModalFiatOption() {
  //    = useState(100) // Default amount is $100
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100)

  const [customAmount, setCustomAmount] = useState('') // State for manual input

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount)
    setCustomAmount('') // Clear custom amount when a default button is selected
  }

  const handleInputChange = (e) => {
    const value = e.target.value

    // Validate the input value to ensure it's a positive number with up to 2 decimal places
    if (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value) >= 0) {
      setCustomAmount(value)
      setSelectedAmount(null) // Clear the selected amount when user manually enters an amount
    }
  }

  const handleInputBlur = () => {
    if (customAmount !== '') {
      const formattedAmount = parseFloat(customAmount).toFixed(2)
      setCustomAmount(formattedAmount)
    }
  }

  return (
    <div className="flex w-full flex-col gap-4 pt-5">
      <div className="flex h-full w-full justify-between space-x-6 pt-6 font-space-grotesk">
        <button
          className={`w-[24vw] rounded-3xl border border-white ${
            selectedAmount === 50
              ? 'bg-white text-[#222222]'
              : 'bg-[#222222] text-white'
          } text-lg font-semibold`}
          onClick={() => handleAmountClick(50)}
        >
          $50
        </button>
        <button
          className={`w-[24vw] rounded-3xl border border-white ${
            selectedAmount === 100
              ? 'bg-white text-[#222222]'
              : 'bg-[#222222] text-white'
          } text-lg font-semibold`}
          onClick={() => handleAmountClick(100)}
        >
          $100
        </button>
        <button
          className={`w-[24vw] rounded-3xl border border-white ${
            selectedAmount === 250
              ? 'bg-white text-[#222222]'
              : 'bg-[#222222] text-white'
          } text-lg font-semibold`}
          onClick={() => handleAmountClick(250)}
        >
          $250
        </button>
      </div>
      <div className="flex h-full w-full justify-between space-x-6 font-space-grotesk">
        <button
          className={`w-[24vw] rounded-3xl border border-white ${
            selectedAmount === 500
              ? 'bg-white text-[#222222]'
              : 'bg-[#222222] text-white'
          } text-lg font-semibold`}
          onClick={() => handleAmountClick(500)}
        >
          $500
        </button>
        <button
          className={`w-[24vw] rounded-3xl border border-white ${
            selectedAmount === 1000
              ? 'bg-white text-[#222222]'
              : 'bg-[#222222] text-white'
          } text-lg font-semibold`}
          onClick={() => handleAmountClick(1000)}
        >
          $1,000
        </button>
        <button
          className={`w-[24vw] rounded-3xl border border-white ${
            selectedAmount === 2500
              ? 'bg-white text-[#222222]'
              : 'bg-[#222222] text-white'
          } text-lg font-semibold`}
          onClick={() => handleAmountClick(2500)}
        >
          $2,500
        </button>
      </div>
      <div className="relative w-full">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-space-grotesk text-lg text-white">
          $
        </span>
        <input
          type="number"
          className="w-full appearance-none rounded-3xl border border-white bg-[#222222] pl-8 font-space-grotesk text-lg text-white"
          value={customAmount || selectedAmount || ''}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          step="0.01" // Ensures input increments by pennies
          min="0" // Ensures no negative values
        />
      </div>
      <div className="flex-rowen flex align-middle">
        <input type="checkbox" />
        <p className="text-white">Cover transaction fees (?)</p>
      </div>
    </div>
  )
}
