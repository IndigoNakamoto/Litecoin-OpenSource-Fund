// components/PaymentModalFiatDonate.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { FaRegCreditCard } from 'react-icons/fa'
import { useDonation } from '../contexts/DonationContext'
import GradientButton from './GradientButton'
import Notification from './Notification' // Import your Notification component

function PaymentModalFiatDonate() {
  const { state, dispatch } = useDonation()
  const [cardToken, setCardToken] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const shift4Initialized = useRef(false)
  const [notification, setNotification] = useState<string | null>(null) // State for notification
  const [isLoading, setIsLoading] = useState(false) // State for loading

  // useCallback to memoize the function and prevent it from being a missing dependency
  const submitDonation = useCallback(
    async (token: string) => {
      setIsLoading(true) // Start loading state
      try {
        const response = await fetch('/api/chargeFiatDonationPledge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pledgeId: state.donationData.pledgeId,
            cardToken: token,
            // amount: state.formData.pledgeAmount,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          console.log('Donation successful')
          dispatch({ type: 'SET_STEP', payload: 'complete' })
        } else {
          const errorData = data.error || data
          console.error('Donation failed', errorData)
          if (errorData.errorMessage) {
            setNotification(errorData.errorMessage)
          } else {
            setNotification('An unexpected error occurred. Please try again.')
          }
        }
      } catch (error: any) {
        console.error('Error charging donation:', error)
        setNotification('Failed to process your donation. Please try again.')
      } finally {
        setIsLoading(false) // Stop loading state
      }
    },
    [state.donationData.pledgeId, state.formData.pledgeAmount, dispatch]
  )

  useEffect(() => {
    const initializeShift4 = () => {
      if (shift4Initialized.current) return

      const Shift4 = (window as any).Shift4
      if (Shift4) {
        console.log('Initializing Shift4...')
        // TODO: Replace with NEXT_PUBLIC_SHIFT4_PK_TEST
        // TODO: Figure out why process.env.NEXT_PUBLIC_SHIFT4_PK_TEST does not work
        // const shift4 = new Shift4('pk_test_jRGmbvC4Y1m54rNqCJ2JLBWU') // USE .ENV SHIFT_PK_TEST
        const shift4 = new Shift4('pk_live_sln6bKZqi6a0LzzhVZhK58HK')

        const components = shift4
          .createComponentGroup()
          .automount(formRef.current)

        shift4Initialized.current = true

        formRef.current?.addEventListener('submit', (e: Event) => {
          e.preventDefault()

          const submitButton = (e.target as HTMLFormElement).querySelector(
            'button[type="submit"]'
          )
          submitButton?.setAttribute('disabled', 'true')

          const amountInDollars = parseFloat(state.formData.pledgeAmount || '0')
          const amountInCents = Math.round(amountInDollars * 100)

          if (isNaN(amountInCents) || amountInCents <= 0) {
            console.error('Invalid amount:', amountInCents)
            setNotification('Invalid donation amount.')
            submitButton?.removeAttribute('disabled')
            return
          }

          shift4
            .createToken(components)
            .then((token: { id: string }) => {
              console.log('Token created:', token)
              return shift4.verifyThreeDSecure({
                amount: amountInCents,
                currency: 'USD',
                card: token.id,
                // merchantAccountId
              })
            })
            .then((secureToken: any) => {
              console.log('3D Secure verification successful:', secureToken)
              setCardToken(secureToken.id)
              submitButton?.removeAttribute('disabled')

              // Use the submitDonation function directly
              console.log('secureToken: ', secureToken)
              submitDonation(secureToken.id)
            })
            .catch(
              (error: { type: string; code?: string; message?: string }) => {
                console.error('Shift4 error:', error)
                displayShift4Error(error)
                submitButton?.removeAttribute('disabled')
              }
            )
        })
      } else {
        console.error('Shift4 is not available on window')
      }
    }

    const loadShift4Script = () => {
      if (!shift4Initialized.current) {
        const script = document.createElement('script')
        script.src = 'https://js.dev.shift4.com/shift4.js'
        script.async = true
        script.onload = initializeShift4
        script.onerror = () => console.error('Failed to load Shift4 script.')
        document.body.appendChild(script)

        return () => {
          document.body.removeChild(script)
        }
      }
    }

    loadShift4Script()

    // Proper cleanup with ref copied to a variable
    const formElement = formRef.current // Copy the ref to a local variable
    return () => {
      if (formElement) {
        formElement.removeEventListener('submit', initializeShift4)
      }
    }
  }, [state.formData.pledgeAmount, submitDonation]) // Add missing dependencies

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault() // Prevent the default form submission
    if (!cardToken) {
      console.error('Card token is missing.')
      setNotification('Payment information is incomplete.')
      return
    }
    // Call the submission function with the card token
    submitDonation(cardToken)
  }

  const displayShift4Error = (error: any) => {
    let errorMessage = 'An error occurred. Please try again later.'

    if (error.type === 'invalid_request') {
      errorMessage = 'Invalid request. Please check your card details.'
    } else if (error.type === 'card_error') {
      switch (error.code) {
        case 'invalid_number':
          errorMessage = 'Invalid card number.'
          break
        case 'invalid_expiry_month':
          errorMessage = 'Invalid expiry month.'
          break
        case 'invalid_expiry_year':
          errorMessage = 'Invalid expiry year.'
          break
        case 'invalid_cvc':
          errorMessage = 'Invalid CVC code.'
          break
        case 'incorrect_zip':
          errorMessage = 'Incorrect ZIP code.'
          break
        case 'expired_card':
          errorMessage = 'Your card has expired.'
          break
        case 'insufficient_funds':
          errorMessage = 'Insufficient funds.'
          break
        // ... handle other card_error codes ...
        default:
          errorMessage =
            error.message || 'An error occurred while processing your card.'
          break
      }
    } else if (error.type === 'gateway_error') {
      errorMessage = 'An error occurred on our end. Please try again later.'
    } else {
      errorMessage = error.message || 'An unknown error occurred.'
    }

    setNotification(errorMessage)
  }

  // Format the amount to display as currency
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(parseFloat(state.formData.pledgeAmount || '0'))

  return (
    <div className=" flex w-full flex-col space-y-4 rounded-lg p-0 md:p-8">
      <h2 className="mb-4 font-space-grotesk text-2xl font-bold text-[#222222]">
        Complete Your Donation
      </h2>
      {/* Display the amount at the top */}
      <div className="mb-4 text-lg font-semibold text-[#222222]">
        Amount to Donate: {formattedAmount}
      </div>
      {notification && (
        <Notification
          message={notification}
          delay={5000}
          onClose={() => setNotification(null)} // Hide notification after 5 seconds
        />
      )}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        id="payment-form"
        className="space-y-4"
      >
        <div className="relative mb-4 w-full">
          <FaRegCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 transform text-[#222222]" />
          <div
            data-shift4="number"
            className="w-full rounded-lg border-white bg-white p-3 font-space-grotesk text-[#222222]"
            style={{ minHeight: '40px' }}
          ></div>
        </div>
        <div className="mb-4 flex flex-row space-x-3">
          <div
            data-shift4="expiry"
            className="w-full rounded-lg border-white bg-white p-3 font-space-grotesk text-[#222222]"
            style={{ minHeight: '40px' }}
          ></div>
          <div
            data-shift4="cvc"
            className="w-full rounded-lg border-white bg-white p-3 font-space-grotesk text-[#222222]"
            style={{ minHeight: '40px' }}
          ></div>
        </div>

        <GradientButton
          isLoading={isLoading} // Implement the isLoading state
          disabled={isLoading} // Disable button while loading
          type="submit" // Ensure the button type is submit
          backgroundColor="#222222"
          textColor="#f0f0f0"
          loadingText="Processing..."
        >
          Donate
        </GradientButton>
      </form>
    </div>
  )
}

export default PaymentModalFiatDonate
