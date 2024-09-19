// components/PaymentModalPersonalInfo.tsx

import React, { useState, useEffect } from 'react'
import { SiX, SiFacebook, SiLinkedin } from 'react-icons/si'
import { useDonation } from '../contexts/DonationContext'
import Image from 'next/image'
import { countries } from './countries'
import { signIn, signOut, useSession } from 'next-auth/react'
import ProjectSocialLinks from './ProjectSocialLinks'

type PaymentModalPersonalInfoProps = {
  onRequestClose: () => void
  onBackClick: () => void
}

const PaymentModalPersonalInfo: React.FC<PaymentModalPersonalInfoProps> = ({
  onRequestClose,
  onBackClick,
}) => {
  const { state, dispatch } = useDonation()
  const { formData, projectSlug } = state // Access formData from context

  // Initialize local states based on formData
  const [donateAnonymously, setDonateAnonymously] = useState(
    formData.isAnonymous ?? true
  )
  const [needsTaxReceipt, setNeedsTaxReceipt] = useState(
    formData.taxReceipt ?? true
  )
  const [joinMailingList, setJoinMailingList] = useState(
    formData.joinMailingList ?? false
  )

  const [showDropdown, setShowDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState(formData.country || '')
  const [focusedCountryIndex, setFocusedCountryIndex] = useState(-1)

  const [emailError, setEmailError] = useState('') // Added email error state

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    dispatch({ type: 'SET_FORM_DATA', payload: { [name]: value } })

    // Clear email error if user starts typing again
    if (name === 'receiptEmail') {
      if (emailError) {
        setEmailError('')
      }
    }
  }

  const handleCountrySelect = (country: string) => {
    dispatch({ type: 'SET_FORM_DATA', payload: { country } })
    setSearchTerm(country)
    setShowDropdown(false)
    setFocusedCountryIndex(-1)
  }

  const handleCountryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedCountryIndex((prevIndex) =>
          prevIndex < filteredCountries.length - 1 ? prevIndex + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedCountryIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredCountries.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (
          focusedCountryIndex >= 0 &&
          focusedCountryIndex < filteredCountries.length
        ) {
          handleCountrySelect(filteredCountries[focusedCountryIndex])
        }
        break
      case 'Escape':
        setShowDropdown(false)
        break
      default:
        break
    }
  }

  const handleEmailBlur = () => {
    const isEmailRequired =
      needsTaxReceipt ||
      joinMailingList ||
      (!needsTaxReceipt && !joinMailingList && !donateAnonymously)

    if (isEmailRequired) {
      if (!formData.receiptEmail.trim()) {
        setEmailError('Email is required.')
      } else if (!/^\S+@\S+\.\S+$/.test(formData.receiptEmail.trim())) {
        setEmailError('Please enter a valid email address.')
      } else {
        setEmailError('')
      }
    } else {
      setEmailError('')
    }
  }

  // Update formData when preferences change
  const handleDonateAnonymouslyChange = () => {
    const newValue = !donateAnonymously
    setDonateAnonymously(newValue)
    dispatch({ type: 'SET_FORM_DATA', payload: { isAnonymous: newValue } })
  }

  const handleNeedsTaxReceiptChange = () => {
    const newValue = !needsTaxReceipt
    setNeedsTaxReceipt(newValue)
    dispatch({ type: 'SET_FORM_DATA', payload: { taxReceipt: newValue } })
  }

  const handleJoinMailingListChange = () => {
    const newValue = !joinMailingList
    setJoinMailingList(newValue)
    dispatch({ type: 'SET_FORM_DATA', payload: { joinMailingList: newValue } })
  }

  // Initialize local states based on formData changes
  useEffect(() => {
    setDonateAnonymously(formData.isAnonymous ?? true)
    setNeedsTaxReceipt(formData.taxReceipt ?? true)
    setJoinMailingList(formData.joinMailingList ?? false)
  }, [formData.isAnonymous, formData.taxReceipt, formData.joinMailingList])

  // Reset focusedCountryIndex when the dropdown is opened or searchTerm changes
  useEffect(() => {
    setFocusedCountryIndex(-1)
  }, [showDropdown, searchTerm])

  const areRequiredFieldsFilled = () => {
    // Existing validation logic
    if (state.selectedOption === 'stock') {
      return (
        formData.phoneNumber.trim() !== '' &&
        formData.receiptEmail.trim() !== '' &&
        formData.firstName.trim() !== '' &&
        formData.lastName.trim() !== '' &&
        formData.addressLine1.trim() !== '' &&
        formData.city.trim() !== '' &&
        formData.state.trim() !== '' &&
        formData.country.trim() !== '' &&
        formData.zipcode.trim() !== ''
      )
    }

    if (state.selectedOption === 'fiat' || state.selectedOption === 'crypto') {
      if (donateAnonymously) {
        if (needsTaxReceipt || joinMailingList) {
          return formData.receiptEmail.trim() !== ''
        }
        return true
      } else {
        return (
          formData.receiptEmail.trim() !== '' &&
          formData.firstName.trim() !== '' &&
          formData.lastName.trim() !== '' &&
          formData.addressLine1.trim() !== '' &&
          formData.city.trim() !== '' &&
          formData.state.trim() !== '' &&
          formData.country.trim() !== '' &&
          formData.zipcode.trim() !== ''
        )
      }
    }

    if (!donateAnonymously && !needsTaxReceipt && !joinMailingList) {
      return formData.receiptEmail.trim() !== ''
    }

    return true
  }

  const { data: session } = useSession()
  useEffect(() => {
    if (session) {
      // Assuming 'twitter' state exists, though it's not defined in the latest code
      // setTwitter(session.user.username)
      // Commented out as 'twitter' state is not defined
    }
  }, [session])

  // Ensure donateAnonymously is false if the donation type is "stock"
  useEffect(() => {
    if (state.selectedOption === 'stock') {
      setDonateAnonymously(false)
      dispatch({ type: 'SET_FORM_DATA', payload: { isAnonymous: false } })
    }
  }, [state.selectedOption, dispatch])

  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  useEffect(() => {
    setIsButtonDisabled(!areRequiredFieldsFilled() || emailError !== '')
  }, [
    formData,
    needsTaxReceipt,
    joinMailingList,
    donateAnonymously,
    state.selectedOption,
    emailError, // Include emailError in dependencies
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset previous errors
    setEmailError('')

    // Perform validation
    let isValid = true

    // Determine if email is required
    const isEmailRequired =
      needsTaxReceipt ||
      joinMailingList ||
      (!needsTaxReceipt && !joinMailingList && !donateAnonymously)

    if (isEmailRequired) {
      if (!formData.receiptEmail.trim()) {
        setEmailError('Email is required.')
        isValid = false
      } else if (!/^\S+@\S+\.\S+$/.test(formData.receiptEmail.trim())) {
        setEmailError('Please enter a valid email address.')
        isValid = false
      } else {
        setEmailError('')
      }
    }

    if (!isValid) {
      // Prevent submission if validation fails
      return
    }

    // Proceed with form submission
    dispatch({
      type: 'SET_DONATION_DATA',
      payload: {
        ...state.donationData,
        ...formData,
      },
    })

    const { selectedOption, selectedCurrency, selectedCurrencyPledged } = state

    let apiEndpoint = ''
    let apiBody = {}

    if (selectedOption === 'fiat') {
      apiEndpoint = '/api/createFiatDonationPledge'
      apiBody = {
        organizationId: 1189134331,
        isAnonymous: donateAnonymously,
        pledgeCurrency: selectedCurrency,
        pledgeAmount: selectedCurrencyPledged,
        firstName: formData.firstName,
        lastName: formData.lastName,
        receiptEmail: formData.receiptEmail,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        zipcode: formData.zipcode,
        taxReceipt: formData.taxReceipt,
        joinMailingList: formData.joinMailingList,
      }
    } else if (selectedOption === 'crypto') {
      apiEndpoint = '/api/createDepositAddress'
      apiBody = {
        // project
        projectSlug: projectSlug,
        organizationId: 1189134331,
        // Donation
        pledgeCurrency: formData.assetSymbol,
        pledgeAmount: formData.pledgeAmount,
        // Donor Info
        receiptEmail: formData.receiptEmail,
        firstName: formData.firstName,
        lastName: formData.lastName,
        /// Donor Personal Info
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        zipcode: formData.zipcode,
        // Donor Settings
        taxReceipt: formData.taxReceipt,
        isAnonymous: formData.isAnonymous,
        joinMailingList: formData.joinMailingList,
        // Donor Social Profiles
        socialX: formData.socialX,
        socialFacebook: formData.socialFacebook,
        socialLinkedIn: formData.socialLinkedIn,
      }
    } else if (selectedOption === 'stock') {
      apiEndpoint = '/api/createStockDonationPledge'
      apiBody = {
        organizationId: 1189134331,
        // project
        projectSlug: projectSlug,
        // Donation
        assetSymbol: formData.assetSymbol,
        assetDescription: formData.assetName,
        pledgeAmount: formData.pledgeAmount,
        // Donor Info
        receiptEmail: formData.receiptEmail,
        firstName: formData.firstName,
        lastName: formData.lastName,
        // Donor Personal Info
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        zipcode: formData.zipcode,
        phoneNumber: formData.phoneNumber,
        // Donor Settings
        taxReceipt: formData.taxReceipt,
        isAnonymous: formData.isAnonymous,
        joinMailingList: formData.joinMailingList,
        // Donor Social Profiles
        socialX: formData.socialX,
        socialFacebook: formData.socialFacebook,
        socialLinkedIn: formData.socialLinkedIn,
      }
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiBody),
      })

      const data = await response.json()

      if (response.ok) {
        if (selectedOption === 'fiat' && data?.data?.pledgeId) {
          dispatch({
            type: 'SET_DONATION_DATA',
            payload: {
              ...state.donationData,
              pledgeId: data.data.pledgeId,
            },
          })
          dispatch({ type: 'SET_STEP', payload: 'fiatDonate' })
        } else if (selectedOption === 'crypto' && data?.depositAddress) {
          dispatch({
            type: 'SET_DONATION_DATA',
            payload: {
              ...state.donationData,
              depositAddress: data.depositAddress,
              qrCode: data.qrCode,
              ...state.formData,
            },
          })
          dispatch({ type: 'SET_STEP', payload: 'cryptoDonate' })
        } else if (selectedOption === 'stock' && data?.donationUuid) {
          console.log('Donation UUID received:', data.donationUuid)
          dispatch({
            type: 'SET_DONATION_DATA',
            payload: {
              ...state.donationData,
              donationUuid: data.donationUuid,
            },
          })
          // Move to the stock broker info step
          dispatch({ type: 'SET_STEP', payload: 'stockBrokerInfo' })
        } else {
          console.error(
            'Expected data (psledgeId, depositAddress, or donationUuid) missing in response',
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

  const shouldShowAddressFields =
    (!donateAnonymously && state.selectedOption !== 'stock') ||
    state.selectedOption === 'stock'

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
              onChange={handleJoinMailingListChange}
              className="h-4 w-4 border-[#222222] bg-[#f0f0f0]"
              id="mailing-list"
            />
            <label
              htmlFor="mailing-list"
              className="font-space-grotesk text-[#222222]"
            >
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
                  onChange={handleDonateAnonymouslyChange}
                  className="h-4 w-4 border-[#222222] bg-[#f0f0f0]"
                  id="donate-anonymously"
                />
                <label
                  htmlFor="donate-anonymously"
                  className="font-space-grotesk  text-[#222222]"
                >
                  Donate Anonymously
                </label>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={needsTaxReceipt}
                  onChange={handleNeedsTaxReceiptChange}
                  className="h-4 w-4 border-[#222222] bg-[#f0f0f0]"
                  id="tax-receipt"
                />
                <label
                  htmlFor="tax-receipt"
                  className="font-space-grotesk  text-[#222222]"
                >
                  Request A Tax Receipt
                </label>
              </div>
              <p className="ml-10 font-space-grotesk text-sm text-gray-600 ">
                Provide your email to receive a confirmation of your donation
                and your tax receipt. This information will only be used to send
                you these documents.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={joinMailingList}
                onChange={handleJoinMailingListChange}
                className="h-4 w-4 border-[#222222] bg-[#f0f0f0]"
                id="mailing-list"
              />
              <label
                htmlFor="mailing-list"
                className="font-space-grotesk  text-[#222222]"
              >
                Join our mailing list for news and updates
              </label>
            </div>
          </>
        )}
        <span className="block w-full border-t border-gray-400"></span>
        {/* PROFILE PHOTO */}
        <div>
          <h2 className="font-space-grotesk text-lg  text-[#222222]">
            Profile Photo <span className="text-sm">(Optional)</span>
          </h2>

          <div className="flex flex-col">
            <div className="flex flex-row">
              <div className="relative my-2 h-[64px] min-w-[64px] rounded-full bg-blue-400">
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
                    type="button" // Ensure type is button
                    className="flex w-full flex-row rounded-lg bg-white text-[#222222]"
                    onClick={() => {
                      const currentUrl = window.location.href
                      const url = new URL(currentUrl)
                      url.searchParams.set('modal', 'true')
                      signIn('twitter', { callbackUrl: url.toString() })
                    }}
                  >
                    Verify
                    <SiX className="ml-2 h-6 w-6" />
                  </button>
                ) : (
                  <button
                    type="button" // Ensure type is button
                    className="flex w-full flex-row rounded-lg bg-white text-[#222222]"
                    onClick={() => signOut()}
                  >
                    Sign Out
                    <SiX className="ml-2 h-6 w-6" />
                  </button>
                )}

                <button
                  type="button" // Ensure type is button
                  className="flex w-full flex-row rounded-lg bg-white text-[#222222]"
                >
                  Verify
                  <SiLinkedin className="ml-2 h-6 w-6" />
                </button>
                <button
                  type="button" // Ensure type is button
                  className="flex w-full flex-row rounded-lg bg-white text-[#222222]"
                >
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
            name="receiptEmail"
            placeholder="Email"
            value={formData.receiptEmail}
            onChange={handleChange}
            onBlur={handleEmailBlur} // Added onBlur handler
            required={
              needsTaxReceipt ||
              joinMailingList ||
              (!needsTaxReceipt && !joinMailingList && !donateAnonymously)
            }
            className={`w-full rounded-lg p-2 font-space-grotesk font-semibold text-[#222222] ${
              emailError
                ? 'border-1 border-red-600 '
                : 'border-[#222222] bg-[#f0f0f0]'
            }`}
            aria-invalid={emailError ? 'true' : 'false'}
            aria-describedby={emailError ? 'email-error' : undefined}
          />
          {emailError && (
            <p id="email-error" className="mt-1 text-sm text-red-600">
              {emailError}
            </p>
          )}
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
              className={`w-full rounded-lg border-[#222222] bg-[#f0f0f0] p-2 font-space-grotesk font-semibold text-[#222222]`}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required={!donateAnonymously || state.selectedOption === 'stock'}
              className={`w-full rounded-lg border-[#222222] bg-[#f0f0f0] p-2 font-space-grotesk font-semibold text-[#222222]`}
            />
          </div>
        </div>
        {/* ADDRESS */}
        <div>
          {/* Show address fields based on conditions */}
          {shouldShowAddressFields && (
            <div className="flex flex-col gap-y-2">
              <h2 className="font-space-grotesk text-lg text-[#222222]">
                Address <span className="text-red-600">*</span>
              </h2>
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
                  className={`flex w-full rounded-lg border-[#222222] bg-[#f0f0f0] p-2 text-left font-space-grotesk font-semibold text-[#222222]`}
                  onFocus={() => {
                    setSearchTerm(formData.country)
                    setShowDropdown(true)
                  }}
                  onKeyDown={handleCountryKeyDown}
                  required
                  aria-haspopup="listbox"
                  aria-expanded={showDropdown}
                  aria-controls="country-listbox"
                />
                {showDropdown && filteredCountries.length > 0 && (
                  <ul
                    id="country-listbox"
                    role="listbox"
                    className="absolute top-12 max-h-56 w-full overflow-y-auto rounded-lg border border-[#222222] bg-[#f0f0f0] text-[#222222]"
                    style={{ zIndex: 10 }}
                  >
                    {filteredCountries.map((country, index) => (
                      <button
                        key={country}
                        onClick={() => handleCountrySelect(country)}
                        role="option"
                        aria-selected={index === focusedCountryIndex}
                        className={`flex w-full cursor-pointer items-center p-2 text-left font-semibold text-[#222222] ${
                          index === focusedCountryIndex
                            ? 'bg-gray-400'
                            : 'hover:bg-gray-200'
                        }`}
                        onMouseEnter={() => setFocusedCountryIndex(index)}
                      >
                        {country}
                      </button>
                    ))}
                  </ul>
                )}
              </div>
              <input
                type="text"
                name="addressLine1"
                placeholder="Street Address 1"
                value={formData.addressLine1}
                onChange={handleChange}
                required
                className={`flex w-full rounded-lg border-[#222222] bg-[#f0f0f0] p-2 text-left font-space-grotesk font-semibold text-[#222222]`}
              />
              <input
                type="text"
                name="addressLine2"
                placeholder="Street Address 2"
                value={formData.addressLine2}
                onChange={handleChange}
                className={`flex w-full rounded-lg border-[#222222] bg-[#f0f0f0] p-2 text-left font-space-grotesk font-semibold text-[#222222]`}
              />
              <div className="flex flex-row gap-x-2">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className={`flex w-full rounded-lg border-[#222222] bg-[#f0f0f0] p-2 text-left font-space-grotesk font-semibold text-[#222222]`}
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State/Province/Region"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className={`flex w-full rounded-lg border-[#222222] bg-[#f0f0f0] p-2 text-left font-space-grotesk font-semibold text-[#222222]`}
                />
                <input
                  type="text"
                  name="zipcode"
                  placeholder="ZIP/Postal Code"
                  value={formData.zipcode}
                  onChange={handleChange}
                  required
                  className={`flex w-full rounded-lg border-[#222222] bg-[#f0f0f0] p-2 text-left font-space-grotesk font-semibold text-[#222222]`}
                />
              </div>
            </div>
          )}
        </div>
        {/* PHONE NUMBER */}
        {state.selectedOption === 'stock' && (
          <div>
            <h2 className="font-space-grotesk text-lg text-[#222222]">
              Phone Number <span className="text-red-600">*</span>
            </h2>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className={`w-full rounded-lg border-[#222222] bg-[#f0f0f0] p-2 font-space-grotesk font-semibold text-[#222222]`}
            />
          </div>
        )}
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
