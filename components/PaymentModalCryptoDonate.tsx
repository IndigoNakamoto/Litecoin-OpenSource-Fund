import React, { useState } from 'react'
import { useDonation } from '../contexts/DonationContext'
import { QRCodeSVG } from 'qrcode.react'
// import { FaRegCopy } from 'react-icons/fa'
import { FaRegCopy } from 'react-icons/fa6'

interface PaymentModalCryptoDonateProps {
  depositAddress: string
  pledgeAmount: string
  pledgeCurrency: string
  onRequestClose: () => void
}

const PaymentModalCryptoDonate: React.FC<PaymentModalCryptoDonateProps> = ({
  depositAddress,
  pledgeAmount,
  pledgeCurrency,
  onRequestClose,
}) => {
  const { dispatch } = useDonation()
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false)
  const [copiedAmount, setCopiedAmount] = useState<boolean>(false)

  const handleDone = () => {
    dispatch({ type: 'RESET_DONATION_STATE', payload: {} }) // Reset state when done
    onRequestClose()
  }

  const handleCopy = (type: 'address' | 'amount') => {
    if (type === 'address') {
      navigator.clipboard.writeText(depositAddress)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 3000) // Reset after 3 seconds
    } else if (type === 'amount') {
      navigator.clipboard.writeText(pledgeAmount)
      setCopiedAmount(true)
      setTimeout(() => setCopiedAmount(false), 3000) // Reset after 3 seconds
    }
  }

  // Prepend currency type and amount to the address if pledged currency is bitcoin, litecoin, or dogecoin
  const qrValue = `${pledgeCurrency.toLowerCase()}:${depositAddress}?amount=${pledgeAmount}`

  return (
    <div className="flex items-center justify-center">
      <div className="my-auto flex flex-col items-center justify-center space-y-4 p-8">
        <h2 className="font-space-grotesk text-2xl font-bold text-[#222222]">
          Complete Your Donation
        </h2>
        <p className="text-[#222222]">
          Please send your donation to the following address:
        </p>

        <QRCodeSVG
          value={qrValue}
          size={256}
          bgColor="#222222"
          fgColor="#f2f2f2"
        />
        <p className="text-[#222222]">
          Scan the QR code above to donate {pledgeAmount} {pledgeCurrency}.
        </p>

        <div
          className="flex w-full cursor-pointer flex-row justify-between rounded-lg border border-[#222222] bg-[#f2f2f2] p-4"
          role="button"
          tabIndex={0}
          onClick={() => handleCopy('address')}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleCopy('address')
            }
          }}
        >
          <span>
            <FaRegCopy />
          </span>
          <p
            className={`break-all text-[#222222] transition-opacity duration-300 ${
              copiedAddress ? 'opacity-100' : 'opacity-100'
            }`}
          >
            {copiedAddress ? 'Address copied to clipboard!' : depositAddress}
          </p>
        </div>
        <div
          className="flex w-full cursor-pointer flex-row justify-between rounded-lg border border-[#222222] bg-[#f2f2f2] p-4"
          role="button"
          tabIndex={0}
          onClick={() => handleCopy('amount')}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleCopy('amount')
            }
          }}
        >
          <span>
            <FaRegCopy />
          </span>
          <p
            className={`break-all text-[#222222] transition-opacity duration-300 ${
              copiedAmount ? 'opacity-100' : 'opacity-100'
            }`}
          >
            {copiedAmount ? 'Amount copied to clipboard!' : pledgeAmount}
          </p>
        </div>

        <button
          onClick={handleDone}
          className="mt-4 w-full rounded-2xl bg-[#222222] text-2xl font-semibold text-[#f0f0f0]"
        >
          Done
        </button>
        <p className="mt-4 text-center text-base text-[#222222]">
          You will receive an email confirmation once your transaction is
          settled. Thank you for your generous support!
        </p>
      </div>
    </div>
  )
}

export default PaymentModalCryptoDonate
