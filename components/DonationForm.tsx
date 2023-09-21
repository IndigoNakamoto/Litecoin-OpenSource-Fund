//components/DonationForm.tsx
import { useEffect, useRef, useState } from 'react'
import { fetchPostJSON } from '../utils/api-helpers'
import Spinner from './Spinner'

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { config } from '@fortawesome/fontawesome-svg-core'
import { faBitcoin } from '@fortawesome/free-brands-svg-icons'
// TODO: Get SVG to render in component
import coinLitecoin from '../public/litecoin-svg/Coin full colour.svg'
import { faCreditCard } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

type DonationStepsProps = {
  projectNamePretty: string
  projectSlug: string
}
const DonationSteps: React.FC<DonationStepsProps> = ({
  projectNamePretty,
  projectSlug,
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [twitter, setTwitter] = useState('')

  const [deductable, setDeductable] = useState('no')
  const [amount, setAmount] = useState('')

  const [readyToPayBTC, setReadyToPayBTC] = useState(false)

  const [btcPayLoading, setBtcpayLoading] = useState(false)

  const formRef = useRef<HTMLFormElement | null>(null)

  function handleFiatAmountClick(e: React.MouseEvent, value: string) {
    e.preventDefault()
    setAmount(value)
  }

  useEffect(() => {
    let btcValid: boolean
    if (deductable === 'no' || (name && email)) {
      btcValid = true
    } else {
      btcValid = false
    }
    setReadyToPayBTC(btcValid)
  }, [deductable, amount, twitter, email, name])

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

      if (amount) {
        Object.assign(payload, { amount })
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
        console.log({ data })
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
          Name{' '}
          <span className="text-subtle">
            {deductable === 'yes' ? '(required)' : '(optional)'}
          </span>
        </h3>
        <input
          type="text"
          placeholder={'Satoshi Nakamoto'}
          required={deductable === 'yes'}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        ></input>
        <h3>
          Twitter{' '}
          <span className="text-subtle">
            {deductable === 'yes' ? '(required)' : '(optional)'}
          </span>
        </h3>
        <input
          type="text"
          placeholder={'twitter.com/ltcfoundation'}
          required={deductable === 'yes'}
          onChange={(e) => setTwitter(e.target.value)}
          className="mb-4 mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        ></input>
        <h3>
          Email{' '}
          <span className="text-subtle">
            {deductable === 'yes' ? '(required)' : '(optional)'}
          </span>
        </h3>
        <input
          type="email"
          placeholder={`support@ltcfoundation.com`}
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required={deductable === 'yes'}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h3>How much would you like to donate?</h3>
        </div>
        <div className="flex flex-col gap-2 py-2 sm:flex-row" role="group">
          {[0.25, 0.5, 1.0, 2.5].map((value, index) => (
            <button
              key={index}
              className="w-30 group"
              onClick={(e) => handleFiatAmountClick(e, value?.toString() ?? '')}
            >
              {value ? `${value} LTC` : 'Any'}
            </button>
          ))}
          <div className="relative flex w-full">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
              }}
              className="mt-1 block w-full w-full rounded-md border-gray-300 !pl-10 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Or enter custom amount"
            />
          </div>
        </div>
      </section>
      <div className="flex flex-wrap items-center gap-4">
        <button
          name="btcpay"
          onClick={handleBtcPay}
          className="pay"
          disabled={!readyToPayBTC || btcPayLoading}
        >
          {btcPayLoading ? (
            <Spinner />
          ) : (
            <FontAwesomeIcon
              icon={coinLitecoin}
              className="text-primary h-8 w-8"
            />
          )}
          <span className="whitespace-nowrap">Donate with Litecoin</span>
        </button>
      </div>
    </form>
  )
}

export default DonationSteps
