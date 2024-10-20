import React, { useState, useEffect, useRef, useCallback } from 'react'
import { FaRegCreditCard } from 'react-icons/fa'
import { useDonation } from '../contexts/DonationContext'
import GradientButton from './GradientButton'
import Notification from './Notification'

function PaymentModalFiatDonate() {
  const { state, dispatch } = useDonation()
  const [notification, setNotification] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const shift4Ref = useRef<any>(null)
  const componentsRef = useRef<any>(null)
  const shift4Initialized = useRef(false)

  const submitDonation = useCallback(
    async (token: string) => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/chargeFiatDonationPledge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pledgeId: state.donationData.pledgeId,
            cardToken: token,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          // console.log('Donation successful')
          dispatch({ type: 'SET_STEP', payload: 'complete' })
        } else {
          const errorData = data.error || data
          console.error('Donation failed', errorData)
          setNotification(
            errorData || 'An unexpected error occurred. Please try again.'
          )
        }
      } catch (error: any) {
        console.error('Error charging donation:', error)
        setNotification('Failed to process your donation. Please try again.')
      } finally {
        setIsLoading(false)
      }
    },
    [state.donationData.pledgeId, dispatch]
  )

  useEffect(() => {
    const initializeShift4 = () => {
      if (shift4Initialized.current) return

      const Shift4 = (window as any).Shift4
      if (Shift4) {
        // console.log('Initializing Shift4...')
        // TODO: Replace with NEXT_PUBLIC_SHIFT4_PK_TEST
        // TODO: Figure out why process.env.NEXT_PUBLIC_SHIFT4_PK_TEST does not work

        // const shift4 = new Shift4('pk_test_jRGmbvC4Y1m54rNqCJ2JLBWU') // USE .ENV SHIFT_PK_TEST
        const shift4 = new Shift4('pk_live_sln6bKZqi6a0LzzhVZhK58HK')

        const components = shift4
          .createComponentGroup()
          .automount(formRef.current)

        shift4Ref.current = shift4
        componentsRef.current = components
        shift4Initialized.current = true
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
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const shift4 = shift4Ref.current
    const components = componentsRef.current

    if (!shift4 || !components) {
      console.error('Shift4 or components not initialized.')
      setNotification('Payment system not initialized. Please try again later.')
      return
    }

    setIsLoading(true)

    const amountInDollars = parseFloat(state.formData.pledgeAmount || '0')
    const amountInCents = Math.round(amountInDollars * 100)

    if (isNaN(amountInCents) || amountInCents <= 0) {
      console.error('Invalid amount:', amountInCents)
      setNotification('Invalid donation amount.')
      setIsLoading(false)
      return
    }

    try {
      const token = await shift4.createToken(components)
      // console.log('Token created:', token)

      const secureToken = await shift4.verifyThreeDSecure({
        amount: amountInCents,
        currency: 'USD',
        card: token.id,
      })

      // console.log('3D Secure verification successful:', secureToken)

      await submitDonation(secureToken.id)
    } catch (error: any) {
      console.error('Shift4 error:', error)
      displayShift4Error(error)
    } finally {
      setIsLoading(false)
    }
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
        // Handle other error codes...
        default:
          errorMessage =
            error.message || 'An error occurred while processing your card.'
          break
      }
    } else {
      errorMessage = error.message || 'An unknown error occurred.'
    }

    setNotification(errorMessage)
  }

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(parseFloat(state.formData.pledgeAmount || '0'))

  return (
    <div className="flex w-full flex-col space-y-4 rounded-lg p-0 md:p-8">
      <h2 className="mb-4 font-space-grotesk text-2xl font-bold text-[#222222]">
        Complete Your Donation
      </h2>
      <div className="mb-4 text-lg font-semibold text-[#222222]">
        Amount to Donate: {formattedAmount}
      </div>
      {notification && (
        <Notification
          message={notification}
          delay={5000}
          onClose={() => setNotification(null)}
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
        <div className="flex justify-between space-x-2 pt-8">
          <button
            type="button"
            onClick={() =>
              dispatch({ type: 'SET_STEP', payload: 'personalInfo' })
            }
            className="w-1/3 rounded-2xl border border-[#222222] text-xl font-semibold text-[#222222]"
          >
            Back
          </button>
          <GradientButton
            isLoading={isLoading}
            disabled={isLoading}
            type="submit"
            backgroundColor="#222222"
            textColor="#f0f0f0"
            loadingText="Processing..."
          >
            Donate
          </GradientButton>
        </div>
      </form>
    </div>
  )
}

export default PaymentModalFiatDonate
