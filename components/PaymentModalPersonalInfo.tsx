import React, { useState, useEffect } from 'react'
import { SiX, SiFacebook, SiLinkedin } from 'react-icons/si'
import { useDonation } from '../contexts/DonationContext'
import Image from 'next/image'
import { countries } from './countries'
import { signIn, signOut, useSession } from 'next-auth/react'

type PaymentModalPersonalInfoProps = {
  onRequestClose: () => void
  onBackClick: () => void
}

const PaymentModalPersonalInfo: React.FC<PaymentModalPersonalInfoProps> = ({
  onRequestClose,
  onBackClick,
}) => {
  const { state, dispatch } = useDonation()

  const [twitterError, setTwitterError] = useState('')
  const [twitter, setTwitter] = useState('')

  const [donateAnonymously, setDonateAnonymously] = useState(true)
  const [needsTaxReceipt, setNeedsTaxReceipt] = useState(true)
  const [joinMailingList, setJoinMailingList] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address1: '',
    address2: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
  })

  const [showDropdown, setShowDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCountrySelect = (country: string) => {
    setFormData({ ...formData, country })
    setSearchTerm(country)
    setShowDropdown(false)
  }

  const areRequiredFieldsFilled = () => {
    // For stock donations: all fields except photo are required
    if (state.selectedOption === 'stock') {
      return (
        formData.email.trim() !== '' &&
        formData.firstName.trim() !== '' &&
        formData.lastName.trim() !== '' &&
        formData.address1.trim() !== '' &&
        formData.city.trim() !== '' &&
        formData.state.trim() !== '' &&
        formData.country.trim() !== '' &&
        formData.postalCode.trim() !== ''
      )
    }

    // For card and crypto donations: check conditions based on donation type
    if (state.selectedOption === 'fiat' || state.selectedOption === 'crypto') {
      if (donateAnonymously) {
        // Anonymously: Name, Photo, and Email are optional, Address is disabled
        if (needsTaxReceipt || joinMailingList) {
          return formData.email.trim() !== ''
        }
        return true // No fields required if neither tax receipt nor mailing list is checked
      } else {
        // Identified: All fields except Photo are required
        return (
          formData.email.trim() !== '' &&
          formData.firstName.trim() !== '' &&
          formData.lastName.trim() !== '' &&
          formData.address1.trim() !== '' &&
          formData.city.trim() !== '' &&
          formData.state.trim() !== '' &&
          formData.country.trim() !== '' &&
          formData.postalCode.trim() !== ''
        )
      }
    }

    // When none of the checkboxes are selected, require email for donation confirmation
    if (!donateAnonymously && !needsTaxReceipt && !joinMailingList) {
      return formData.email.trim() !== ''
    }

    return true
  }

  const { data: session } = useSession()
  useEffect(() => {
    if (session) {
      setTwitter(session.user.username)
    }
  }, [session])

  // Ensure donateAnonymously is false if the donation type is "stock"
  useEffect(() => {
    if (state.selectedOption === 'stock') {
      setDonateAnonymously(false)
    }
  }, [state.selectedOption])

  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  useEffect(() => {
    setIsButtonDisabled(!areRequiredFieldsFilled())
  }, [
    formData,
    needsTaxReceipt,
    joinMailingList,
    donateAnonymously,
    state.selectedOption,
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Personal info form submitted')

    dispatch({
      type: 'SET_DONATION_DATA',
      payload: {
        ...formData,
        taxReceipt: needsTaxReceipt,
        isAnonymous: donateAnonymously,
      },
    })

    const { selectedOption, selectedCurrency, selectedCurrencyPledged } = state

    const apiEndpoint =
      selectedOption === 'fiat'
        ? '/api/createFiatDonationPledge'
        : '/api/createDepositAddress'

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: 12345678, // Replace with actual org ID
          isAnonymous: donateAnonymously,
          pledgeCurrency: selectedCurrency,
          pledgeAmount: selectedCurrencyPledged,
          firstName: formData.firstName,
          lastName: formData.lastName,
          receiptEmail: formData.email,
          addressLine1: formData.address1,
          addressLine2: formData.address2,
          country: formData.country,
          state: formData.state,
          city: formData.city,
          zipcode: formData.postalCode,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        if (
          (selectedOption === 'fiat' && data?.data?.pledgeId) ||
          (selectedOption === 'crypto' && data?.depositAddress)
        ) {
          dispatch({
            type: 'SET_DONATION_DATA',
            payload: {
              ...state.donationData,
              ...(selectedOption === 'fiat'
                ? { pledgeId: data.data.pledgeId }
                : { depositAddress: data.depositAddress }),
            },
          })

          const nextStep =
            selectedOption === 'fiat' ? 'fiatDonate' : 'cryptoDonate'
          dispatch({ type: 'SET_STEP', payload: nextStep })
        } else {
          console.error(
            'Expected data (pledgeId or depositAddress) missing in response',
            data
          )
        }
      } else {
        console.error(data.error)
      }
    } catch (error) {
      console.error('Error submitting pledge:', error)
    }
  }

  // Determine email input description based on selected checkboxes
  const emailDescription =
    donateAnonymously && !needsTaxReceipt && !joinMailingList
      ? 'Please enter your email to receive a confirmation of your donation. We will use this email solely to notify you that your donation has been received.'
      : needsTaxReceipt && joinMailingList
      ? 'Enter your email to receive a tax receipt and join the mailing list.'
      : needsTaxReceipt
      ? 'Enter your email to receive a tax receipt.'
      : joinMailingList
      ? 'Enter your email to join our mailing list for news and updates.'
      : 'Please enter your email to receive a confirmation of your donation. We will use this email solely to notify you that your donation has been received.'

  return (
    <div className="flex flex-col space-y-4 p-8">
      <h2 className="font-space-grotesk text-2xl font-bold text-[#222222]">
        Personal Information
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* DONATE ANONYMOUSLY CHECKBOX */}
        <span className="block w-full border-t border-gray-400"></span>
        {state.selectedOption === 'stock' ? (
          // Only show the mailing list checkbox when the donation type is stock
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={joinMailingList}
              onChange={() => setJoinMailingList(!joinMailingList)}
              className="h-4 w-4 border-[#222222] bg-[#f0f0f0]"
              id="mailing-list"
            />
            <label htmlFor="mailing-list" className="text-[#222222]">
              Join our mailing list for news and updates
            </label>
          </div>
        ) : (
          // Show other checkboxes when the donation type is not stock
          <>
            <div className="space-y-0">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={donateAnonymously}
                  onChange={() => setDonateAnonymously(!donateAnonymously)}
                  className="h-4 w-4 border-[#222222] bg-[#f0f0f0]"
                  id="donate-anonymously"
                />
                <label htmlFor="donate-anonymously" className="text-[#222222]">
                  Donate Anonymously
                </label>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={needsTaxReceipt}
                  onChange={() => setNeedsTaxReceipt(!needsTaxReceipt)}
                  className="h-4 w-4 border-[#222222] bg-[#f0f0f0]"
                  id="tax-receipt"
                />
                <label htmlFor="tax-receipt" className="text-[#222222]">
                  Request A Tax Receipt
                </label>
              </div>
              <p className="ml-10 text-sm text-gray-600">
                Provide your email to receive a confirmation of your donation
                and your tax receipt. This information will only be used to send
                you these documents.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={joinMailingList}
                onChange={() => setJoinMailingList(!joinMailingList)}
                className="h-4 w-4 border-[#222222] bg-[#f0f0f0]"
                id="mailing-list"
              />
              <label htmlFor="mailing-list" className="text-[#222222]">
                Join our mailing list for news and updates
              </label>
            </div>
          </>
        )}
        <span className="block w-full border-t border-gray-400"></span>
        {/* PROFILE PHOTO */}
        <div>
          <h2 className="font-space-grotesk text-lg text-[#222222]">
            Profile Photo <span className="text-sm">(Optional)</span>
          </h2>

          <div className="flex flex-col">
            <div className="flex flex-row">
              <div className="relative my-2 h-[64px] min-w-[64px] rounded-full bg-green-400">
                {!session ? (
                  <Image
                    src="/static/images/design/chickun.jpeg"
                    alt="profile"
                    width="120"
                    height="120"
                    className="rounded-full"
                  />
                ) : (
                  <Image
                    src={session.user.image}
                    alt="profile"
                    width="120"
                    height="120"
                    className="rounded-full"
                  />
                )}
              </div>
              <p className="my-auto ml-8 font-space-grotesk text-sm text-[#222222]">
                Upload a verified profile photo to show your support. Your photo
                and a link to your account will be featured in our community
                section.
              </p>
            </div>
            <div>
              <div className="flex flex-row justify-between space-x-2">
                {!session ? (
                  <button
                    className="flex w-full flex-row rounded-lg bg-white text-[#222222]"
                    onClick={() => signIn('twitter')}
                  >
                    Verify
                    <SiX className="ml-2 h-6 w-6" />
                  </button>
                ) : (
                  <button
                    className="flex w-full flex-row rounded-lg bg-white text-[#222222]"
                    onClick={() => signOut()}
                  >
                    Sign Out
                    <SiX className="ml-2 h-6 w-6" />
                  </button>
                )}

                <button className="flex w-full flex-row rounded-lg bg-white text-[#222222]">
                  Verify
                  <SiLinkedin className="ml-2 h-6 w-6" />
                </button>
                <button className="flex w-full flex-row rounded-lg bg-white text-[#222222]">
                  Verify
                  <SiFacebook className="ml-2 h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* EMAIL */}
        <div>
          <h2 className="font-space-grotesk text-lg text-[#222222]">
            Email
            {(needsTaxReceipt ||
              joinMailingList ||
              (!needsTaxReceipt && !joinMailingList && !donateAnonymously)) && (
              <span className="text-red-600">*</span>
            )}
            {!needsTaxReceipt && !joinMailingList && donateAnonymously && (
              <span className="text-sm">{` (Optional)`}</span>
            )}
          </h2>
          <p className="my-auto pb-1 font-space-grotesk text-sm text-gray-600">
            {emailDescription}
          </p>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required={
              needsTaxReceipt ||
              joinMailingList ||
              (!needsTaxReceipt && !joinMailingList && !donateAnonymously)
            }
            className="w-full rounded-lg border-[#222222] bg-[#f0f0f0] p-2 font-space-grotesk text-[#222222]"
          />
        </div>
        {/* NAME */}
        <div>
          <h2 className="font-space-grotesk text-lg text-[#222222]">
            Name
            {(!donateAnonymously || state.selectedOption === 'stock') && (
              <span className="text-red-600">*</span>
            )}
            {donateAnonymously && state.selectedOption !== 'stock' && (
              <span className="text-sm">{` (Optional)`}</span>
            )}
          </h2>
          <div className="flex flex-row gap-x-2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required={!donateAnonymously || state.selectedOption === 'stock'}
              className={`w-full rounded-lg border-[#222222] bg-[#f0f0f0] p-2 font-space-grotesk text-[#222222]`}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required={!donateAnonymously || state.selectedOption === 'stock'}
              className={`w-full rounded-lg border-[#222222] bg-[#f0f0f0] p-2 font-space-grotesk text-[#222222]`}
            />
          </div>
        </div>
        {/* ADDRESS */}
        <div>
          <h2
            className={`font-space-grotesk text-lg ${
              !donateAnonymously ? 'text-[#222222]' : 'text-gray-400'
            }`}
          >
            Address
            {state.selectedOption === 'stock' ? (
              <span className="text-red-600">*</span>
            ) : (
              <span className="text-sm">{` (Optional)`}</span>
            )}
          </h2>
          <div className="flex flex-col gap-y-2">
            <div className="relative flex w-full flex-col space-y-3">
              <input
                type="text"
                name="country"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowDropdown(true)
                }}
                placeholder="Search for a country"
                className={`flex w-full rounded-lg p-2 text-left font-space-grotesk text-[#222222] ${
                  !donateAnonymously
                    ? 'border-[#222222] bg-[#f0f0f0]'
                    : 'border-none bg-white'
                }`}
                onFocus={() => {
                  setSearchTerm('')
                  setShowDropdown(true)
                }}
                required={
                  !donateAnonymously || state.selectedOption === 'stock'
                }
                disabled={donateAnonymously && state.selectedOption !== 'stock'}
              />
              {showDropdown && filteredCountries.length > 0 && (
                <ul
                  className="absolute top-12 max-h-56 w-full overflow-y-auto rounded-lg border border-[#222222] bg-[#f0f0f0] text-[#222222]"
                  style={{ zIndex: 10 }}
                >
                  {filteredCountries.map((country) => (
                    <button
                      key={country}
                      onClick={() => handleCountrySelect(country)}
                      className="flex w-full cursor-pointer items-center p-2 text-left text-[#222222] hover:bg-gray-400"
                    >
                      {country}
                    </button>
                  ))}
                </ul>
              )}
            </div>
            <input
              type="text"
              name="address1"
              placeholder="Street Address 1"
              value={formData.address1}
              onChange={handleChange}
              required={!donateAnonymously || state.selectedOption === 'stock'}
              disabled={donateAnonymously && state.selectedOption !== 'stock'}
              className={`flex w-full rounded-lg p-2 text-left font-space-grotesk text-[#222222] ${
                !donateAnonymously
                  ? 'border-[#222222] bg-[#f0f0f0]'
                  : 'border-none bg-white'
              }`}
            />
            <input
              type="text"
              name="address2"
              placeholder="Street Address 2"
              value={formData.address2}
              onChange={handleChange}
              disabled={donateAnonymously && state.selectedOption !== 'stock'}
              className={`flex w-full rounded-lg p-2 text-left font-space-grotesk text-[#222222] ${
                !donateAnonymously
                  ? 'border-[#222222] bg-[#f0f0f0]'
                  : 'border-none bg-white'
              }`}
            />
            <div className="flex flex-row gap-x-2">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required={
                  !donateAnonymously || state.selectedOption === 'stock'
                }
                disabled={donateAnonymously && state.selectedOption !== 'stock'}
                className={`flex w-full rounded-lg p-2 text-left font-space-grotesk text-[#222222] ${
                  !donateAnonymously
                    ? 'border-[#222222] bg-[#f0f0f0]'
                    : 'border-none bg-white'
                }`}
              />
              <input
                type="text"
                name="state"
                placeholder="State/Province/Region"
                value={formData.state}
                onChange={handleChange}
                required={
                  !donateAnonymously || state.selectedOption === 'stock'
                }
                disabled={donateAnonymously && state.selectedOption !== 'stock'}
                className={`flex w-full rounded-lg p-2 text-left font-space-grotesk text-[#222222] ${
                  !donateAnonymously
                    ? 'border-[#222222] bg-[#f0f0f0]'
                    : 'border-none bg-white'
                }`}
              />
              <input
                type="text"
                name="postalCode"
                placeholder="ZIP/Postal Code"
                value={formData.postalCode}
                onChange={handleChange}
                required={
                  !donateAnonymously || state.selectedOption === 'stock'
                }
                disabled={donateAnonymously && state.selectedOption !== 'stock'}
                className={`flex w-full rounded-lg p-2 text-left font-space-grotesk text-[#222222] ${
                  !donateAnonymously
                    ? 'border-[#222222] bg-[#f0f0f0]'
                    : 'border-none bg-white'
                }`}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between space-x-2 pt-8">
          <button
            type="button"
            className="w-1/3 rounded-2xl border border-[#222222] text-xl font-semibold text-[#222222]"
            onClick={onBackClick}
          >
            Back
          </button>
          <button
            type="submit"
            className={`w-2/3 !rounded-2xl text-2xl font-semibold !text-[#f0f0f0] ${
              isButtonDisabled ? 'bg-gray-400' : 'bg-[#222222]'
            }`}
            disabled={isButtonDisabled}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}

export default PaymentModalPersonalInfo
