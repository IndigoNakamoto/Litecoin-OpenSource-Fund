import React, { useState } from 'react'
import ReactModal from 'react-modal'
import Image from 'next/legacy/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClose,
  faCreditCard,
  faArrowTrendUp,
} from '@fortawesome/free-solid-svg-icons'
import PaymentModalCryptoOption from './PaymentModalCryptoOption'
import PaymentModalFiatOption from './PaymentModalFiatOption'
import PaymentModalStockOption from './PaymentModalStockOption'
import PaymentModalPersonalInfo from './PaymentModalPersonalInfo'
import { ProjectItem } from '../utils/types'

type ModalProps = {
  isOpen: boolean
  onRequestClose: () => void
  project: ProjectItem | undefined
}

const PaymentModal: React.FC<ModalProps> = ({
  isOpen,
  onRequestClose,
  project,
}) => {
  const [selectedOption, setSelectedOption] = useState<
    'crypto' | 'fiat' | 'stock'
  >('crypto')
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null)
  const [selectedCurrencyPledged, setSelectedCurrencyPledged] = useState<
    string | null
  >(null)
  const [currentStep, setCurrentStep] = useState<'payment' | 'personalInfo'>(
    'payment'
  )
  const [currencyRates, setCurrencyRates] = useState<{ rate: number } | null>(
    null
  )

  if (!project) {
    return <div />
  }

  // Function to handle the donation button click to proceed to the personal info step
  const handleDonateClick = () => {
    setCurrentStep('personalInfo')
  }

  // Function to handle the back button click to go back to the payment options step
  const handleBackClick = () => {
    setCurrentStep('payment')
  }

  // Function to render the payment options based on the selected option
  const renderPaymentOption = () => {
    switch (selectedOption) {
      case 'crypto':
        return (
          <PaymentModalCryptoOption
            onCurrencySelect={(currency, value, rates) => {
              setSelectedCurrency(currency)
              setSelectedCurrencyPledged(value.toString())
              setCurrencyRates(rates)
            }}
          />
        )
      case 'fiat':
        return <PaymentModalFiatOption />
      case 'stock':
        return <PaymentModalStockOption />
      default:
        return null
    }
  }

  // Render content based on the current step
  const renderContent = () => {
    if (currentStep === 'personalInfo') {
      return (
        <PaymentModalPersonalInfo
          onRequestClose={onRequestClose}
          onBackClick={handleBackClick}
        />
      )
    }

    return (
      <>
        <div className="flex flex-col space-y-4 py-4">
          <div className="flex items-center gap-4">
            <Image
              alt={project.title}
              src={project.coverImage}
              width={96}
              height={96}
              objectFit="cover"
              className="rounded-xl"
            />
            <div className="flex flex-col">
              <h2 className="font-space-grotesk text-4xl font-semibold text-white ">
                {project.title}
              </h2>
              <h3 className="font-sans text-white">Make a donation</h3>
            </div>
          </div>
        </div>
        <div className="flex h-full w-full flex-col justify-between space-y-4 pb-5 pt-6 font-space-grotesk">
          <button
            className={`flex w-full flex-row items-center justify-center gap-2 rounded-3xl border border-white font-bold ${
              selectedOption === 'crypto'
                ? 'bg-white text-[#222222]'
                : 'bg-[#222222] text-white'
            }`}
            onClick={() => setSelectedOption('crypto')}
          >
            <p
              className={
                selectedOption === 'crypto' ? 'text-[#222222]' : 'text-white'
              }
            >
              Cryptocurrency
            </p>
          </button>

          <div className="flex justify-between space-x-3">
            <button
              className={`flex w-full flex-row items-center justify-center gap-2 rounded-3xl border border-white  font-bold ${
                selectedOption === 'fiat'
                  ? 'bg-white text-[#222222]'
                  : 'bg-[#222222] text-white'
              }`}
              onClick={() => setSelectedOption('fiat')}
            >
              <FontAwesomeIcon icon={faCreditCard} className="h-6" />
              <p>Card</p>
            </button>

            <button
              className={`flex w-full flex-row items-center justify-center gap-2 rounded-3xl border border-white  font-bold ${
                selectedOption === 'stock'
                  ? 'bg-white text-[#222222]'
                  : 'bg-[#222222] text-white'
              }`}
              onClick={() => setSelectedOption('stock')}
            >
              <FontAwesomeIcon icon={faArrowTrendUp} className="h-6" />
              <p>Stock</p>
            </button>
          </div>
        </div>
        <div>{renderPaymentOption()}</div>
        <button
          className="mt-16 w-full rounded-2xl bg-[white] text-2xl font-semibold text-[#222222]"
          onClick={handleDonateClick}
          disabled={!selectedCurrency || !selectedCurrencyPledged} // Button is enabled when these states are set
        >
          Donate
        </button>
      </>
    )
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="max-h-full min-h-[75vh] w-[40rem] max-w-3xl overflow-y-auto border border-black bg-[#222222] p-8 shadow-xl sm:m-8 md:p-16"
      overlayClassName="inset-0 fixed bg-[#222222] bg-opacity-70 flex items-center justify-center transform duration-400 ease-in"
      appElement={
        typeof window === 'undefined'
          ? undefined
          : document?.getElementById('root') || undefined
      }
    >
      <div className="relative flex justify-end text-[#f46748]">
        <FontAwesomeIcon
          icon={faClose}
          className="hover:text-primary h-[2rem] w-[2rem] cursor-pointer"
          onClick={onRequestClose}
        />
      </div>
      {renderContent()}
    </ReactModal>
  )
}

export default PaymentModal
