import { useEffect, useRef, useState } from 'react'
import { fetchPostJSON } from '../utils/api-helpers'
import Spinner from './Spinner'
import { signIn, signOut, useSession } from 'next-auth/react'

// Font Awesome
import { config } from '@fortawesome/fontawesome-svg-core'
import Image from 'next/legacy/image'

import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
const EMAIL_REGEX = /^$|^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
const TWITTER_USERNAME_REGEX = /^(?:[a-zA-Z0-9_]+)?$/

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

  // States for input validation
  const [emailError, setEmailError] = useState('')
  const [twitterError, setTwitterError] = useState('')

  // Email validation
  const validateEmail = (value: string): boolean => {
    if (!EMAIL_REGEX.test(value)) {
      setEmailError('Invalid email address')
      return false
    }
    setEmailError('')
    return true
  }

  // Twitter validation
  const validateTwitter = (value: string): boolean => {
    if (!TWITTER_USERNAME_REGEX.test(value)) {
      setTwitterError('Invalid username. Only a-z, 0-9 and _ are allowed.')
      return false
    }
    setTwitterError('')
    return true
  }

  // Form validation
  const validateForm = (): boolean => {
    const isEmailValid = validateEmail(email)
    const isTwitterValid = validateTwitter(twitter)
    const isNameOrDeductibleValid = true
    return isEmailValid && isTwitterValid && isNameOrDeductibleValid
  }

  useEffect(() => {
    return setReadyToPayBTC(validateForm())
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
        Object.assign(payload, { twitter: `www.twitter.com/${twitter}` })
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
  const { data: session } = useSession()

  return (
    <form
      ref={formRef}
      className="flex flex-col gap-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <section className="flex flex-col gap-1">
        <div className="mb-4">
          <h3>
            Name <span className="font-light text-gray-400">(Optional)</span>
          </h3>
          <input
            type="text"
            placeholder={'Satoshi Nakamoto'}
            required={deductable === 'yes'}
            onChange={(e) => setName(e.target.value)}
            className=" mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          ></input>
        </div>
        <div className="mb-4">
          <h3>
            Twitter
            <span className="font-light text-gray-400">
              (Optional: Your profile picture and Twitter account will be
              publicly shared)
            </span>
          </h3>
          {!session ? (
            <button className="font-black" onClick={() => signIn('twitter')}>
              Sign in with Twitter
            </button>
          ) : (
            <div>
              Signed in as {session.user.name}
              <button onClick={() => signOut()}>Sign out</button>
            </div>
          )}
        </div>
        <div className="mb-4">
          <h3>
            Email <span className="font-light text-gray-400">(Optional)</span>
          </h3>
          <input
            type="email"
            placeholder={`support@ltcfoundation.com`}
            className={`mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
              emailError ? 'border-red-500' : ''
            }`}
            required={deductable === 'yes'}
            onChange={(e) => {
              setEmail(e.target.value.trim())
            }}
            onBlur={(e) => {
              validateEmail(e.target.value)
            }}
          ></input>
          {emailError && (
            <div className="mt-0">
              <small className="text-red-500">{emailError}</small>
            </div>
          )}
        </div>
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
