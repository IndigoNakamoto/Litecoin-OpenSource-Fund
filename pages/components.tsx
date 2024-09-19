// pages/components.js
import React from 'react'
// Import your components
import PaymentModalStockDonorSignature from '../components/PaymentModalStockDonorSignature'
import GradientButton from '../components/GradientButton'
import PaymentModalStockBrokerInfo from '../components/PaymentModalStockBrokerInfo'
import PaymentModalStockDonorThankYou from '../components/PaymentModalStockDonorThankYou'
import PaymentModalPersonalInfo from '../components/PaymentModalPersonalInfo'

const ComponentsShowcase = () => {
  const handleContinue = () => {
    alert('Continue action triggered')
  }

  return (
    <div className="mt-32 flex min-h-screen items-center justify-center p-8">
      <div className="flex w-full max-w-2xl flex-col items-center space-y-8">
        <h1 className="mb-6 text-4xl font-bold text-white">
          Component Showcase
        </h1>

        {/* Showcase Gradient Button Component */}
        <h2 className="mb-2 text-2xl font-semibold text-white">
          Gradient Button Component
        </h2>
        <section className="mb-8 max-w-lg space-y-2 rounded-3xl bg-[#f0f0f0] p-4">
          <GradientButton
            isLoading={false}
            onClick={() => alert('Button clicked!')}
          >
            Click Me
          </GradientButton>
          <GradientButton
            isLoading={false}
            disabled={true}
            onClick={() => alert('Button clicked!')}
          >
            Disabled
          </GradientButton>
          <GradientButton
            isLoading={true}
            onClick={() => alert('Button clicked!')}
            loadingText="Processing.."
          >
            Click Me
          </GradientButton>
        </section>

        {/* Showcase PaymentModalStockDonorSignature */}
        <h2 className="mb-2 text-2xl font-semibold text-white">
          Payment Modal Stock Donor Signature
        </h2>
        <section className="mb-8 max-w-lg rounded-3xl bg-[#f0f0f0] p-4">
          <PaymentModalStockDonorSignature onContinue={() => null} />
        </section>

        {/* Showcase PaymentModalStockBrokerInfo */}
        <h2 className="mb-2 text-2xl font-semibold text-white">
          Payment Modal Stock Broker Info
        </h2>
        <section className="mb-8 max-w-lg rounded-3xl bg-[#f0f0f0] p-4">
          <PaymentModalStockBrokerInfo />
        </section>

        {/* Showcase PaymentModalStockDonorThankYou */}
        <section className="mb-8 max-w-lg rounded-3xl bg-[#f0f0f0] p-4">
          <h2 className="mb-2 text-2xl font-semibold">
            Payment Modal Stock Donor Thank You
          </h2>
          <PaymentModalStockDonorThankYou onRequestClose={() => null} />
        </section>

        {/* Showcase PaymentModalPersonalInfo */}
        <h2 className="mb-2 text-2xl font-semibold text-white">
          Payment Modal Personal Info
        </h2>
        <section className="mb-8 max-w-lg rounded-3xl bg-[#f0f0f0] p-4">
          <PaymentModalPersonalInfo
            onRequestClose={() => null}
            onBackClick={() => null}
          />
        </section>

        {/* Add more sections as needed for each component */}
      </div>
    </div>
  )
}

export default ComponentsShowcase
