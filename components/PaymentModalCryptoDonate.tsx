import React from 'react'
import { useDonation } from '../contexts/DonationContext'
import { QRCodeSVG } from 'qrcode.react'

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

  const handleDone = () => {
    dispatch({ type: 'RESET_DONATION_STATE', payload: {} }) // Reset state when done
    onRequestClose()
  }

  const qrValue = `${depositAddress}?amount=${pledgeAmount}&currency=${pledgeCurrency}`

  return (
    <div className="flex items-center justify-center">
      <div className="my-auto flex flex-col items-center justify-center space-y-4  p-8">
        <h2 className="font-space-grotesk text-2xl font-bold text-white">
          Complete Your Donation
        </h2>
        <p className="text-white">
          Please send your donation to the following address:
        </p>

        <QRCodeSVG
          value={qrValue}
          size={256}
          bgColor="#222222"
          fgColor="#ffffff"
        />
        <p className="text-white">
          Scan the QR code above to donate {pledgeAmount} {pledgeCurrency}.
        </p>
        <div className="w-full rounded-lg bg-gray-700  p-4">
          <p className="text-white">{depositAddress}</p>
        </div>
        <button
          onClick={handleDone}
          className="mt-4 w-full rounded-2xl bg-white text-2xl font-semibold text-[#222222]"
        >
          Done
        </button>
      </div>
    </div>
  )
}

export default PaymentModalCryptoDonate
