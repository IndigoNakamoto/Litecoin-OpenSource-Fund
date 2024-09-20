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
  const projectTitle = state.projectTitle || 'your selected project'

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center space-y-6 rounded-lg p-8 font-space-grotesk">
      <h2 className="font-space-grotesk text-2xl font-bold text-[#222222]">
        Thank You for Your Donation!
      </h2>
      <hr className="border-t-1 w-full border-gray-400" />
      <p className="mt-4 text-center text-lg text-[#222222]">
        Your generous donation to {projectTitle} has been successfully
        processed. We appreciate your support!
      </p>
      <div className="my-4 text-lg">
        <p className="text-center text-gray-800">
          <span className="font-semibold">Project:</span> {projectTitle}
        </p>
        <p className="text-center text-gray-800"></p>
        <p className="text-center text-gray-800">
          <span className="font-semibold">Amount:</span> $
          {state.formData.pledgeAmount}
        </p>
      </div>
      <p className="text-center text-lg text-gray-700">
        You will receive a confirmation email with your tax receipt once your
        donation is processed.
      </p>
    </div>
  )
}

export default PaymentModalFiatThankYou
