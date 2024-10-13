// components/PaymentForm.tsx

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { customImageLoader } from '../utils/customImageLoader'
import GradientButton from './GradientButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons'
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

type PaymentFormProps = {
  project: ProjectItem | undefined
  onRequestClose?: () => void // Make this prop optional
  modal: boolean // Corrected the type to boolean
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  project,
  onRequestClose,
  modal,
}) => {
  const { state, dispatch } = useDonation()
  const { projectSlug, projectTitle, image } = state
  const [widgetSnippet, setWidgetSnippet] = useState('')
  const [widgetError, setWidgetError] = useState('')

  useEffect(() => {
    // Fetch the widget snippet from the API
    const fetchWidgetSnippet = async () => {
      try {
        const res = await fetch('/api/getWidgetSnippet')
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(
            `HTTP error! status: ${res.status} - ${
              errorData.error || res.statusText
            }`
          )
        }
        const data = await res.json()

        // The response contains 'popup', 'script', and 'iframe' options
        // We'll use the 'popup' option
        setWidgetSnippet(data.popup)

        // Parse and execute the script manually
        const parser = new DOMParser()
        const doc = parser.parseFromString(data.popup, 'text/html')
        const script = doc.querySelector('script')

        if (script) {
          const newScript = document.createElement('script')
          newScript.id = script.id
          newScript.innerHTML = script.innerHTML
          document.body.appendChild(newScript)
        }
      } catch (error) {
        console.error('Failed to fetch widget snippet:', error)
        setWidgetError(error.message)
      }
    }

    fetchWidgetSnippet()
  }, [])

  useEffect(() => {
    if (project) {
      // Only dispatch if project details have changed
      if (
        projectSlug !== project.slug ||
        projectTitle !== project.title ||
        image !== project.coverImage
      ) {
        dispatch({
          type: 'SET_PROJECT_DETAILS',
          payload: {
            slug: project.slug,
            title: project.title,
            image: project.coverImage,
          },
        })
      }
    }
    // Removed 'dispatch' from dependencies since it's stable
  }, [project, projectSlug, projectTitle, image])

  if (!project) {
    return <div />
  }

  // Define a default onRequestClose if it's not provided
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleRequestClose = onRequestClose || (() => {})

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
      return <PaymentModalPersonalInfo onRequestClose={handleRequestClose} />
    }

    if (state.currentStep === 'cryptoDonate') {
      return <PaymentModalCryptoDonate onRequestClose={handleRequestClose} />
    }

    if (state.currentStep === 'fiatDonate') {
      return <PaymentModalFiatDonate />
    }

    if (state.currentStep === 'complete') {
      return <PaymentModalFiatThankYou onRequestClose={handleRequestClose} />
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
      return (
        <PaymentModalStockDonorThankYou onRequestClose={handleRequestClose} />
      )
    }

    return (
      <>
        {/* Conditionally render the div based on the 'modal' prop */}
        {modal && (
          <div className="z-30 flex flex-col space-y-4 py-4">
            <div className="flex items-center gap-4">
              <Image
                loader={customImageLoader} // Use the custom loader
                alt={project.title}
                src={project.coverImage}
                width={96}
                height={96}
                priority={true}
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="flex flex-col">
                <h3 className="font-sans text-[#222222]">Donate to</h3>
                <h2 className="font-space-grotesk text-4xl font-semibold text-[#222222]">
                  {project.title}
                </h2>
                {project.title === 'Projects Fund' ? null : (
                  <h3 className="font-sans text-[#222222]">Project</h3>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="flex w-full flex-col justify-between space-y-4  pb-5 pt-6 font-space-grotesk">
          <div className="flex justify-between space-x-3">
            <div
              className={`${
                project.slug === 'projects-fund' ? 'w-1/2' : 'w-full'
              }`}
            >
              <button
                className={`flex w-full flex-row items-center justify-center gap-2 rounded-3xl border border-[#222222] text-xl font-bold ${
                  state.selectedOption === 'crypto'
                    ? 'bg-[#222222] text-[#f0f0f0]'
                    : 'bg-[#f0f0f0] text-[#222222]'
                }`}
                onClick={() =>
                  dispatch({ type: 'SET_OPTION', payload: 'crypto' })
                }
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
            </div>

            {project.slug === 'projects-fund' && !widgetError ? (
              <div className="w-1/2">
                <div className="flex w-full flex-row items-center justify-center gap-2 rounded-3xl border border-[#222222] text-xl font-bold">
                  <div dangerouslySetInnerHTML={{ __html: widgetSnippet }} />
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex justify-between space-x-3">
            <button
              className={`flex w-full flex-row items-center justify-center gap-2 rounded-3xl border border-[#222222]  text-xl font-bold ${
                state.selectedOption === 'fiat'
                  ? 'bg-[#222222] text-[#f0f0f0]'
                  : 'bg-[#f0f0f0] text-[#222222]'
              }`}
              onClick={() => {
                dispatch({ type: 'SET_OPTION', payload: 'fiat' })
                dispatch({
                  type: 'SET_FORM_DATA',
                  payload: { pledgeAmount: '100', pledgeCurrency: 'USD' },
                })
                dispatch({ type: 'SET_DONATE_BUTTON_DISABLED', payload: false })
              }}
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

  return <div>{renderContent()}</div>
}

export default PaymentForm
