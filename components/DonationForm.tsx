//components/DonationForm.tsx
import { useEffect, useRef, useState } from 'react'
import { fetchPostJSON } from '../utils/api-helpers'
import Spinner from './Spinner'

// Font Awesome
import { config } from '@fortawesome/fontawesome-svg-core'
import Image from 'next/legacy/image'

import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

type DonationStepsProps = {
  projectNamePretty: string
  projectSlug: string
}
const DonationSteps: React.FC<DonationStepsProps> = ({
  // projectNamePretty,
  projectSlug,
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [twitter, setTwitter] = useState('')

  const [deductable, setDeductable] = useState('no')

  const [isHovered, setIsHovered] = useState(false)

  const [readyToPayBTC, setReadyToPayBTC] = useState(false)

  const [btcPayLoading, setBtcpayLoading] = useState(false)

  const formRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    let btcValid: boolean
    if (deductable === 'no' || (name && email)) {
      btcValid = true
    } else {
      btcValid = false
    }
    setReadyToPayBTC(btcValid)
  }, [deductable, twitter, email, name])

  async function handleBtcPay() {
    const validity = formRef.current?.checkValidity()
    if (!validity) {
      return
    }
    setBtcpayLoading(true)
    try {
      const payload = {
        project_slug: projectSlug,
      }

      if (name) {
        Object.assign(payload, { name })
      }

      if (email) {
        Object.assign(payload, { email })
      }

      if (twitter) {
        Object.assign(payload, { twitter })
      }

      const data = await fetchPostJSON(`/api/btcpay`, payload)
      if (data.checkoutLink) {
        window.location.assign(data.checkoutLink)
      } else if (data.message) {
        throw new Error(data.message)
      } else {
        throw new Error('Something went wrong with BtcPay Server checkout.')
      }
    } catch (e) {
      console.error(e)
    }
    setBtcpayLoading(false)
  }

  return (
    <form
      ref={formRef}
      className="flex flex-col gap-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <section className="flex flex-col gap-1">
        <h3>
          Name <span className="text-subtle">(optional)</span>
        </h3>
        <input
          type="text"
          placeholder={'Satoshi Nakamoto'}
          required={deductable === 'yes'}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        ></input>
        <h3>
          Twitter <span className="text-subtle">(optional)</span>
        </h3>
        <input
          type="text"
          placeholder={'twitter.com/ltcfoundation'}
          required={deductable === 'yes'}
          onChange={(e) => setTwitter(e.target.value)}
          className="mb-4 mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        ></input>
        <h3>
          Email <span className="text-subtle">(optional)</span>
        </h3>
        <input
          type="email"
          placeholder={`support@ltcfoundation.com`}
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required={deductable === 'yes'}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </section>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          name="btcpay"
          onClick={handleBtcPay}
          className="pay"
          disabled={!readyToPayBTC || btcPayLoading}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {btcPayLoading ? (
            <Spinner />
          ) : (
            <Image
              src={
                isHovered
                  ? '/litecoin-svg/coin-white.svg'
                  : '/litecoin-svg/coin-blue.svg'
              }
              alt="Litecoin"
              width={32}
              height={32}
            />
          )}
          <span className="whitespace-nowrap">Donate with Litecoin</span>
        </button>
      </div>
    </form>
  )
}

export default DonationSteps
