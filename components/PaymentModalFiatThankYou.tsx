// components/PaymentModalFiatThankYou.tsx
import React from 'react'
import { useDonation } from '../contexts/DonationContext'

type ThankYouModalProps = {
  onRequestClose: () => void
}

const PaymentModalFiatThankYou: React.FC<ThankYouModalProps> = ({
  onRequestClose,
}) => {
  const { state } = useDonation()

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="font-space-grotesk text-3xl font-bold text-[#222222]">
        Thank You for Your Donation!
      </h2>
      <p className="mt-4 text-lg text-[#222222]">
        Your generous donation to {state.projectTitle} has been successfully
        processed. We appreciate your support!
      </p>
    </div>
  )
}

export default PaymentModalFiatThankYou
