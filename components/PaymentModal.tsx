// components/PaymentModal.tsx
import React, { useEffect } from 'react'
import ReactModal from 'react-modal'
import Image from 'next/legacy/image'
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
import PaymentModalStockOption from './PaymentModalStockOption'
import PaymentModalPersonalInfo from './PaymentModalPersonalInfo'
import { ProjectItem } from '../utils/types'
import { useDonation } from '../contexts/DonationContext'

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
        payload: { slug: project.slug, title: project.title },
      })
    }
  }, [project])

  const handleClose = () => {
    dispatch({ type: 'RESET_DONATION_STATE', payload: {} }) // Reset state on close
    onRequestClose() // Call the original close handler
  }

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
      return (
        <PaymentModalCryptoDonate
          depositAddress={state.donationData.depositAddress}
          pledgeAmount={state.selectedCurrencyPledged || ''}
          pledgeCurrency={state.selectedCurrency || ''}
          onRequestClose={onRequestClose}
        />
      )
    }

    if (state.currentStep === 'fiatDonate') {
      return <PaymentModalFiatDonate /> // Ensure this renders correctly
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
              state.selectedOption === 'crypto'
                ? 'bg-white text-[#222222]'
                : 'bg-[#222222] text-white'
            }`}
            onClick={() => dispatch({ type: 'SET_OPTION', payload: 'crypto' })}
          >
            <p
              className={
                state.selectedOption === 'crypto'
                  ? 'text-[#222222]'
                  : 'text-white'
              }
            >
              Cryptocurrency
            </p>
          </button>

          <div className="flex justify-between space-x-3">
            <button
              className={`flex w-full flex-row items-center justify-center gap-2 rounded-3xl border border-white  font-bold ${
                state.selectedOption === 'fiat'
                  ? 'bg-white text-[#222222]'
                  : 'bg-[#222222] text-white'
              }`}
              onClick={() => dispatch({ type: 'SET_OPTION', payload: 'fiat' })}
            >
              <FontAwesomeIcon icon={faCreditCard} className="h-6" />
              <p>Card</p>
            </button>

            <button
              className={`flex w-full flex-row items-center justify-center gap-2 rounded-3xl border border-white  font-bold ${
                state.selectedOption === 'stock'
                  ? 'bg-white text-[#222222]'
                  : 'bg-[#222222] text-white'
              }`}
              onClick={() => dispatch({ type: 'SET_OPTION', payload: 'stock' })}
            >
              <FontAwesomeIcon icon={faArrowTrendUp} className="h-6" />
              <p>Stock</p>
            </button>
          </div>
        </div>
        <div>{renderPaymentOption()}</div>
        <button
          className="mt-16 w-full rounded-2xl bg-[white] text-2xl font-semibold text-[#222222]"
          onClick={() =>
            dispatch({ type: 'SET_STEP', payload: 'personalInfo' })
          }
          disabled={!state.selectedCurrency || !state.selectedCurrencyPledged}
        >
          Donate
        </button>
      </>
    )
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="max-h-full min-h-[75vh] w-[40rem] max-w-3xl overflow-y-auto border border-black bg-[#222222] p-8 shadow-xl sm:m-8 md:p-16"
      overlayClassName="fixed inset-0 bg-[#222222] bg-opacity-70 z-[40] flex items-center justify-center transform duration-400 ease-in"
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
          onClick={handleClose}
        />
      </div>
      {renderContent()}
    </ReactModal>
  )
}

export default PaymentModal
