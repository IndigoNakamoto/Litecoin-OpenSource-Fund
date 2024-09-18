//components/PaymentModalStockDonorThankYou

import React from 'react'
import { useDonation } from '../contexts/DonationContext'

export default function PaymentModalStockDonorThankYou({ onRequestClose }) {
  const { state } = useDonation()

  // Extract necessary details from the state
  const projectTitle = state.projectTitle || 'your selected project'
  const donatedStock = state.formData.assetSymbol || 'N/A'
  const stockQuantity = state.formData.pledgeAmount || '0'
  const donorName = state.formData.isAnonymous
    ? 'Anonymous Donor'
    : `${state.formData.firstName} ${state.formData.lastName}`
  const brokerName = state.formData.brokerContactName || 'N/A'
  const brokerageAccountNumber = state.formData.brokerageAccountNumber || 'N/A'
  const signatureDate = state.formData.signatureDate || 'Pending'

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center space-y-6 rounded-lg bg-white p-8 shadow-lg">
      <h2 className="font-space-grotesk text-3xl font-bold text-[#222222]">
        Thank You, {donorName}!
      </h2>
      <p className="text-center text-gray-700">
        Your generous donation has been sent to your broker, {brokerName}.
      </p>
      <p className="text-center text-gray-700">
        You will receive a confirmation email with your tax receipt once your
        donation is processed.
      </p>
      <div className="flex w-full flex-col items-center space-y-2">
        <p className="text-center text-gray-800">
          <span className="font-semibold">Project:</span> {projectTitle}
        </p>
        <p className="text-center text-gray-800">
          <span className="font-semibold">Donated Stock:</span> {donatedStock}
        </p>
        <p className="text-center text-gray-800">
          <span className="font-semibold">Amount:</span> {stockQuantity} shares
        </p>
        <p className="text-center text-gray-800">
          <span className="font-semibold">Broker Account:</span>{' '}
          {brokerageAccountNumber}
        </p>
        <p className="text-center text-gray-800">
          <span className="font-semibold">Signature Date:</span> {signatureDate}
        </p>
      </div>
      <button
        onClick={onRequestClose}
        className="mt-4 w-full transform rounded-lg bg-[#222222] py-2 text-xl font-semibold text-[#f0f0f0] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#222222] focus:ring-offset-2"
        aria-label="Close thank you message"
      >
        Close
      </button>
    </div>
  )
}
