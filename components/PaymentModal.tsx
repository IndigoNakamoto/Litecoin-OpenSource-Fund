// components/PaymentModal.tsx

import React, { useEffect, useCallback } from 'react'
import ReactModal from 'react-modal'
import Image from 'next/legacy/image'
import GradientButton from './GradientButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClose,
  faCreditCard,
  faArrowTrendUp,
} from '@fortawesome/free-solid-svg-icons'
import PaymentModalCryptoDonate from './PaymentModalCryptoDonate'
import PaymentModalCryptoOption from './PaymentModalCryptoOption'
import PaymentModalFiatOption from './PaymentModalFiatOption'
import PaymentModalFiatDonate from './PaymentModalFiatDonate'
import PaymentModalFiatThankYou from './PaymentModalFiatThankYou'
import PaymentModalStockOption from './PaymentModalStockOption'
import PaymentModalPersonalInfo from './PaymentModalPersonalInfo'
import PaymentModalStockBrokerInfo from './PaymentModalStockBrokerInfo'
import PaymentModalStockDonorSignature from './PaymentModalStockDonorSignature'
import PaymentModalStockDonorThankYou from './PaymentModalStockDonorThankYou'

import { ProjectItem } from '../utils/types'
import { useDonation } from '../contexts/DonationContext'
import { signOut } from 'next-auth/react' // Import signOut

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
  const { state, dispatch } = useDonation()

  useEffect(() => {
    if (project) {
      dispatch({
        type: 'SET_PROJECT_DETAILS',
        payload: {
          slug: project.slug,
          title: project.title,
          image: project.coverImage,
        },
      })
    }
  }, [project, dispatch])

  const handleClose = () => {
    dispatch({ type: 'RESET_DONATION_STATE' })
    onRequestClose()
    if (
      state.formData.socialX ||
      state.formData.socialFacebook ||
      state.formData.socialLinkedIn
    ) {
      const currentUrl = window.location.href
      const url = new URL(currentUrl)
      url.searchParams.set('modal', 'false')
      signOut({ callbackUrl: url.toString() }) // Redirect back to current URL after sign-out
    }
  }

  const handleFiatOptionSelect = () => {
    dispatch({ type: 'SET_OPTION', payload: 'fiat' })
    dispatch({
      type: 'SET_FORM_DATA',
      payload: { pledgeAmount: '100', pledgeCurrency: 'USD' },
    })
    dispatch({ type: 'SET_DONATE_BUTTON_DISABLED', payload: false })
  }

  // Handle currency selection is managed within PaymentModalCryptoOption

  if (!project) {
    return <div />
  }

  // Function to render the payment options based on the selected option
  const renderPaymentOption = () => {
    switch (state.selectedOption) {
      case 'crypto':
        return (
          <PaymentModalCryptoOption
            onCurrencySelect={(currency, value, rates) => {
              dispatch({ type: 'SET_CURRENCY', payload: currency })
              dispatch({
                type: 'SET_PLEDGED_AMOUNT',
                payload: value.toString(),
              })
              dispatch({ type: 'SET_RATES', payload: rates })
              dispatch({
                type: 'SET_FORM_DATA',
                payload: {
                  assetSymbol: currency,
                  pledgeCurrency: currency,
                  pledgeAmount: value.toString(),
                },
              })
              dispatch({ type: 'SET_DONATE_BUTTON_DISABLED', payload: false })
              // Since PaymentModalCryptoOption now initializes and enables the Donate button,
              // no additional dispatch is needed here for the Donate button
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
    if (state.currentStep === 'personalInfo') {
      return (
        <PaymentModalPersonalInfo
          onRequestClose={onRequestClose}
          onBackClick={() => dispatch({ type: 'SET_STEP', payload: 'payment' })}
        />
      )
    }

    if (state.currentStep === 'cryptoDonate') {
      return <PaymentModalCryptoDonate onRequestClose={onRequestClose} />
    }

    if (state.currentStep === 'fiatDonate') {
      return <PaymentModalFiatDonate />
    }

    if (state.currentStep === 'complete') {
      return (
        <PaymentModalFiatThankYou
          onRequestClose={() => {
            handleClose()
          }}
        />
      )
    }
    if (state.currentStep === 'stockBrokerInfo') {
      return <PaymentModalStockBrokerInfo />
    }

    if (state.currentStep === 'sign') {
      return (
        <PaymentModalStockDonorSignature
          onContinue={() => dispatch({ type: 'SET_STEP', payload: 'thankYou' })}
        />
      )
    }

    if (state.currentStep === 'thankYou') {
      return <PaymentModalStockDonorThankYou onRequestClose={handleClose} />
    }

    return (
      <>
        <div className="z-30 flex flex-col space-y-4 py-4">
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
              <h2 className="font-space-grotesk text-4xl font-semibold text-[#222222] ">
                {project.title}
              </h2>
              <h3 className="font-sans text-[#222222]">Make a donation</h3>
            </div>
          </div>
        </div>
        <div className="flex h-full w-full flex-col justify-between space-y-4 pb-5 pt-6 font-space-grotesk">
          <button
            className={`flex w-full flex-row items-center justify-center gap-2 rounded-3xl border border-[#222222] text-xl font-bold ${
              state.selectedOption === 'crypto'
                ? 'bg-[#222222] text-[#f0f0f0]'
                : 'bg-[#f0f0f0] text-[#222222]'
            }`}
            onClick={() => dispatch({ type: 'SET_OPTION', payload: 'crypto' })}
          >
            <p
              className={
                state.selectedOption === 'crypto'
                  ? 'text-[#f0f0f0]'
                  : 'text-[#222222]'
              }
            >
              Cryptocurrency
            </p>
          </button>

          <div className="flex justify-between space-x-3">
            <button
              className={`flex w-full flex-row items-center justify-center gap-2 rounded-3xl border border-[#222222]  text-xl font-bold ${
                state.selectedOption === 'fiat'
                  ? 'bg-[#222222] text-[#f0f0f0]'
                  : 'bg-[#f0f0f0] text-[#222222]'
              }`}
              onClick={handleFiatOptionSelect}
            >
              <FontAwesomeIcon icon={faCreditCard} className="h-6" />
              <p>Card</p>
            </button>

            <button
              className={`flex w-full flex-row items-center justify-center gap-2 rounded-3xl border border-[#222222]  text-xl font-bold ${
                state.selectedOption === 'stock'
                  ? 'bg-[#222222] text-[#f0f0f0]'
                  : 'bg-[#f0f0f0] text-[#222222]'
              }`}
              onClick={() => {
                dispatch({ type: 'SET_OPTION', payload: 'stock' })
                dispatch({
                  type: 'SET_FORM_DATA',
                  payload: {
                    assetSymbol: '',
                    assetName: '',
                    pledgeAmount: '',
                  },
                })
                dispatch({
                  type: 'SET_DONATE_BUTTON_DISABLED',
                  payload: true,
                })
              }}
            >
              <FontAwesomeIcon icon={faArrowTrendUp} className="h-6" />
              <p>Stock</p>
            </button>
          </div>
        </div>
        <div className="pb-10">{renderPaymentOption()}</div>
        <GradientButton
          onClick={() =>
            dispatch({ type: 'SET_STEP', payload: 'personalInfo' })
          }
          isLoading={false} // Adjust based on your loading state
          disabled={state.isDonateButtonDisabled}
          backgroundColor={state.isDonateButtonDisabled ? '#d1d5db' : '#222222'}
          textColor={state.isDonateButtonDisabled ? '#gray-600' : '#f0f0f0'}
        >
          Donate
        </GradientButton>
      </>
    )
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={handleClose}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      className="max-h-full min-h-[50vh] max-w-[44rem] overflow-y-auto border border-black bg-[#f0f0f0] p-8 shadow-xl sm:m-8 sm:w-full md:p-16"
      overlayClassName="fixed inset-0 bg-[#222222] bg-opacity-80 z-[40] flex items-center justify-center transform duration-400 ease-in"
      // Remove appElement if set globally
    >
      <div className="relative flex justify-end text-[#f46748]">
        <FontAwesomeIcon
          icon={faClose}
          className="hover:text-primary h-[2rem] w-[2rem] cursor-pointer"
          onClick={handleClose}
        />
      </div>
      {renderContent()}
    </ReactModal>
  )
}

export default PaymentModal
