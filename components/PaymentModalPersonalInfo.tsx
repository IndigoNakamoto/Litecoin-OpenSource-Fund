// components/PaymentModalPersonalInfo.tsx

import React, { useState, useEffect, useRef } from 'react'
import { SiX } from 'react-icons/si'
import { useDonation } from '../contexts/DonationContext'
import Image from 'next/legacy/image'
import { countries } from './countries'
import { signIn, useSession } from 'next-auth/react'
import GradientButton from './GradientButton'

type PaymentModalPersonalInfoProps = {
  onRequestClose: () => void
}

const PaymentModalPersonalInfo: React.FC<
  PaymentModalPersonalInfoProps
> = () => {
  const { state, dispatch } = useDonation()
  const { formData, projectSlug } = state
  const [isLoading, setIsLoading] = useState(false)

  // Initialize local states based on formData
  const [donateAnonymously, setDonateAnonymously] = useState(
    formData.isAnonymous ?? false
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

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const [errors, setErrors] = useState<{
    receiptEmail?: string
    firstName?: string
    lastName?: string
    country?: string
    addressLine1?: string
    city?: string
    state?: string
    zipcode?: string
    phoneNumber?: string
  }>({})

  const validateField = (name: string, value: string | boolean): string => {
    const stringValue = typeof value === 'boolean' ? value.toString() : value

    switch (name) {
      case 'receiptEmail':
        if (
          needsTaxReceipt ||
          joinMailingList ||
          (!needsTaxReceipt && !joinMailingList && !donateAnonymously)
        ) {
          if (!stringValue.trim()) return 'Email is required.'
          if (!/^\S+@\S+\.\S+$/.test(stringValue.trim()))
            return 'Please enter a valid email address.'
        }
        return ''
      case 'firstName':
        if (!donateAnonymously || state.selectedOption === 'stock') {
          if (!stringValue.trim()) return 'First name is required.'
        }
        return ''
      case 'lastName':
        if (!donateAnonymously || state.selectedOption === 'stock') {
          if (!stringValue.trim()) return 'Last name is required.'
        }
        return ''
      case 'country':
        if (shouldShowAddressFields && !stringValue.trim())
          return 'Country is required.'
        return ''
      case 'addressLine1':
        if (shouldShowAddressFields && !stringValue.trim())
          return 'Street Address is required.'
        return ''
      case 'city':
        if (shouldShowAddressFields && !stringValue.trim())
          return 'City is required.'
        return ''
      case 'state':
        if (shouldShowAddressFields && !stringValue.trim())
          return 'State is required.'
        return ''
      case 'zipcode':
        if (shouldShowAddressFields && !stringValue.trim())
          return 'ZIP Code is required.'
        return ''
      case 'phoneNumber':
        if (state.selectedOption === 'stock' && !stringValue.trim())
          return 'Phone Number is required.'
        return ''
      default:
        return ''
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    dispatch({ type: 'SET_FORM_DATA', payload: { [name]: value } })

    // Clear error when user modifies the field
    if (errors[name as keyof typeof errors]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }))
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

  // Initialize local states based on formData changes
  useEffect(() => {
    setDonateAnonymously(formData.isAnonymous ?? false)
    setNeedsTaxReceipt(formData.taxReceipt ?? true)
    setJoinMailingList(formData.joinMailingList ?? false)
  }, [formData.isAnonymous, formData.taxReceipt, formData.joinMailingList])

  // Reset focusedCountryIndex when the dropdown is opened or searchTerm changes
  useEffect(() => {
    setFocusedCountryIndex(-1)
  }, [showDropdown, searchTerm])

  const areRequiredFieldsFilled = () => {
    if (state.selectedOption === 'stock') {
      return (
        formData.phoneNumber?.trim() !== '' &&
        formData.receiptEmail?.trim() !== '' &&
        formData.firstName?.trim() !== '' &&
        formData.lastName?.trim() !== '' &&
        formData.addressLine1?.trim() !== '' &&
        formData.city?.trim() !== '' &&
        formData.state?.trim() !== '' &&
        formData.country?.trim() !== '' &&
        formData.zipcode?.trim() !== ''
      )
    }

    if (state.selectedOption === 'fiat' || state.selectedOption === 'crypto') {
      if (donateAnonymously) {
        if (needsTaxReceipt || joinMailingList) {
          return formData.receiptEmail?.trim() !== ''
        }
        return true
      } else {
        return (
          formData.receiptEmail?.trim() !== '' &&
          formData.firstName?.trim() !== '' &&
          formData.lastName?.trim() !== '' &&
          formData.addressLine1?.trim() !== '' &&
          formData.city?.trim() !== '' &&
          formData.state?.trim() !== '' &&
          formData.country?.trim() !== '' &&
          formData.zipcode?.trim() !== ''
        )
      }
    }

    if (!donateAnonymously && !needsTaxReceipt && !joinMailingList) {
      return formData.receiptEmail?.trim() !== ''
    }

    return true
  }

  const { data: session } = useSession()
  // const hasSetSocialX = useRef(false)

  useEffect(() => {
    if (session && formData.socialXUseSession) {
      // Update formData with Twitter username and image
      dispatch({
        type: 'SET_FORM_DATA',
        payload: {
          socialX: session.user.username,
          socialXimageSrc: session.user.image,
        },
      })
    }
  }, [session, formData.socialXUseSession, dispatch])

  // Ensure donateAnonymously is false if the donation type is "stock"
  useEffect(() => {
    if (state.selectedOption === 'stock') {
      setDonateAnonymously(false)
      dispatch({ type: 'SET_FORM_DATA', payload: { isAnonymous: false } })
    }
  }, [state.selectedOption, dispatch])

  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  useEffect(() => {
    const requiredFieldsFilled = areRequiredFieldsFilled()
    const noErrors = Object.values(errors).every((error) => error === '')
    setIsButtonDisabled(!(requiredFieldsFilled && noErrors))
  }, [
    formData,
    needsTaxReceipt,
    joinMailingList,
    donateAnonymously,
    state.selectedOption,
    errors,
  ])

  // Function to handle form submission
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Perform validation
    const newErrors: typeof errors = {}

    // List of fields to validate based on conditions
    const fieldsToValidate = ['receiptEmail']

    if (!donateAnonymously || state.selectedOption === 'stock') {
      fieldsToValidate.push('firstName', 'lastName')
    }

    if (shouldShowAddressFields) {
      fieldsToValidate.push(
        'country',
        'addressLine1',
        'city',
        'state',
        'zipcode'
      )
    }

    if (state.selectedOption === 'stock') {
      fieldsToValidate.push('phoneNumber')
    }

    // Validate each field
    fieldsToValidate.forEach((field) => {
      const value = formData[field as keyof typeof formData]
      const error = validateField(field, value)
      if (error) {
        newErrors[field as keyof typeof newErrors] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
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

    const { selectedOption } = state

    let apiEndpoint = ''
    let apiBody = {}

    const anonInfo = {
      firstName: formData.firstName || 'Anonymous',
      lastName: formData.lastName || 'Donor',
      receiptEmail: formData.receiptEmail || 'anon@anon.com',
      addressLine1: 'N/A',
      addressLine2: 'N/A',
      country: 'N/A', // Adjust the country code as needed
      state: 'N/A', // Adjust the state code as needed
      city: 'N/A',
      zipcode: 'N/A',
    }

    if (selectedOption === 'fiat') {
      apiEndpoint = '/api/createFiatDonationPledge'
      apiBody = {
        projectSlug: projectSlug,
        organizationId: 1189134331,
        isAnonymous: donateAnonymously,
        pledgeCurrency: formData.pledgeCurrency,
        assetDescription: formData.assetName,
        pledgeAmount: formData.pledgeAmount,
        firstName: donateAnonymously ? anonInfo.firstName : formData.firstName,
        lastName: donateAnonymously ? anonInfo.lastName : formData.lastName,
        receiptEmail: donateAnonymously
          ? anonInfo.receiptEmail
          : formData.receiptEmail,
        addressLine1: donateAnonymously
          ? anonInfo.addressLine1
          : formData.addressLine1,
        addressLine2: formData.addressLine2,
        country: donateAnonymously ? anonInfo.country : formData.country,
        state: donateAnonymously ? anonInfo.state : formData.state,
        city: donateAnonymously ? anonInfo.city : formData.city,
        zipcode: donateAnonymously ? anonInfo.zipcode : formData.zipcode,
        taxReceipt: formData.taxReceipt,
        joinMailingList: formData.joinMailingList,
      }
    } else if (selectedOption === 'crypto') {
      apiEndpoint = '/api/createDepositAddress'
      apiBody = {
        projectSlug: projectSlug,
        organizationId: 1189134331,
        pledgeCurrency: formData.assetSymbol,
        pledgeAmount: formData.pledgeAmount,
        receiptEmail: donateAnonymously
          ? anonInfo.receiptEmail
          : formData.receiptEmail,
        firstName: donateAnonymously ? anonInfo.firstName : formData.firstName,
        lastName: donateAnonymously ? anonInfo.lastName : formData.lastName,
        addressLine1: donateAnonymously
          ? anonInfo.addressLine1
          : formData.addressLine1,
        addressLine2: donateAnonymously
          ? anonInfo.addressLine2
          : formData.addressLine2,
        country: donateAnonymously ? anonInfo.country : formData.country,
        state: donateAnonymously ? anonInfo.state : formData.state,
        city: donateAnonymously ? anonInfo.city : formData.city,
        zipcode: donateAnonymously ? anonInfo.zipcode : formData.zipcode,
        taxReceipt: formData.taxReceipt,
        isAnonymous: formData.isAnonymous,
        joinMailingList: formData.joinMailingList,
        socialX: formData.socialX,
        socialFacebook: formData.socialFacebook,
        socialLinkedIn: formData.socialLinkedIn,
      }
    } else if (selectedOption === 'stock') {
      apiEndpoint = '/api/createStockDonationPledge'
      apiBody = {
        organizationId: 1189134331,
        projectSlug: projectSlug,
        assetSymbol: formData.assetSymbol,
        assetDescription: formData.assetName,
        pledgeAmount: formData.pledgeAmount,
        receiptEmail: formData.receiptEmail,
        firstName: formData.firstName,
        lastName: formData.lastName,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        zipcode: formData.zipcode,
        phoneNumber: formData.phoneNumber,
        taxReceipt: formData.taxReceipt,
        isAnonymous: formData.isAnonymous,
        joinMailingList: formData.joinMailingList,
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
        if (selectedOption === 'fiat' && data?.pledgeId) {
          dispatch({
            type: 'SET_DONATION_DATA',
            payload: {
              ...state.donationData,
              pledgeId: data.pledgeId,
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
          dispatch({
            type: 'SET_DONATION_DATA',
            payload: {
              ...state.donationData,
              donationUuid: data.donationUuid,
            },
          })
          dispatch({ type: 'SET_STEP', payload: 'stockBrokerInfo' })
        } else {
          console.error(
            'Expected data (pledgeId, depositAddress, or donationUuid) missing in response',
            data
          )
        }
      } else {
        console.error(data.error)
      }
    } catch (error: any) {
      console.error('Error submitting pledge:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Determine email input description based on selected checkboxes
  const emailDescription =
    donateAnonymously && !needsTaxReceipt
      ? 'Please enter your email to receive a confirmation of your donation. We will use this email solely to notify you that your donation has been received.'
      : needsTaxReceipt
      ? 'Enter your email to receive a tax receipt.'
      : ''

  const shouldShowAddressFields =
    (!donateAnonymously && state.selectedOption !== 'stock') ||
    state.selectedOption === 'stock'

  return (
    <div className="flex flex-col space-y-4 p-0 md:p-8">
      <h2 className="font-space-grotesk text-2xl font-bold text-[#222222]">
        Personal Information
      </h2>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* DONATE ANONYMOUSLY CHECKBOX */}

        {state.selectedOption === 'stock' ? null : (
          // Show other checkboxes when the donation type is not stock
          <>
            <span className="block w-full border-t border-gray-400"></span>
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
          </>
        )}
        <span className="block w-full border-t border-gray-400"></span>
        {/* PROFILE PHOTO */}
        <div className="pb-2">
          <h2 className="font-space-grotesk text-lg  text-[#222222]">
            Profile Photo <span className="text-sm">(Optional)</span>
          </h2>

          <div className="flex flex-col">
            <div className="flex flex-row">
              <div className="relative my-2 h-[64px] min-w-[64px] rounded-full bg-blue-400">
                {!state.formData.socialXimageSrc ? (
                  <Image
                    src="/static/images/design/chickun.jpeg"
                    alt="profile"
                    width="120"
                    height="120"
                    className="rounded-full"
                  />
                ) : (
                  <Image
                    src={state.formData.socialXimageSrc}
                    alt="profile"
                    width="120"
                    height="120"
                    className="rounded-full"
                  />
                )}
              </div>
              <p className="my-auto ml-8 font-space-grotesk text-sm text-gray-600">
                Verify an account to show your support. Your photo and a link to
                your account will be featured in our community section.
              </p>
            </div>
            <div>
              <div className="flex flex-row justify-between space-x-2">
                {!state.formData.socialXimageSrc ? (
                  <button
                    type="button"
                    className={`flex w-1/2 items-center justify-center rounded-lg border border-[#222222] font-space-grotesk font-semibold text-gray-500`}
                    onClick={() => {
                      dispatch({
                        type: 'SET_FORM_DATA',
                        payload: {
                          socialXUseSession: true, // Allow useEffect to update from session
                        },
                      })
                      const currentUrl = window.location.href
                      const url = new URL(currentUrl)
                      console.log('URL for twitter callback', url)
                      url.searchParams.set('modal', 'true')
                      signIn('twitter', { callbackUrl: url.toString() })
                    }}
                  >
                    <span className="flex items-center">
                      Verify
                      <SiX className="ml-2 h-6 w-6" />
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="flex w-1/2 items-center justify-center rounded-lg border border-[#222222] font-space-grotesk font-semibold text-[#222222]"
                    onClick={() => {
                      dispatch({
                        type: 'SET_FORM_DATA',
                        payload: {
                          socialX: '',
                          socialXimageSrc: '',
                          socialXUseSession: false,
                        },
                      })
                    }}
                  >
                    <SiX className="mr-2 h-6 w-6" />
                    Verified
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <span className="block w-full border-t border-gray-400 "></span>
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
            onBlur={handleBlur}
            required={
              needsTaxReceipt ||
              joinMailingList ||
              (!needsTaxReceipt && !joinMailingList && !donateAnonymously)
            }
            className={`w-full rounded-lg p-2 font-space-grotesk font-semibold text-[#222222] ${
              errors.receiptEmail
                ? 'border-1 border-red-600 '
                : 'border-[#222222] bg-[#f0f0f0]'
            }`}
            aria-invalid={errors.receiptEmail ? 'true' : 'false'}
            aria-describedby={errors.receiptEmail ? 'email-error' : undefined}
          />
          {errors.receiptEmail && (
            <p id="email-error" className="mt-1 text-sm text-red-600">
              {errors.receiptEmail}
            </p>
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
              onBlur={handleBlur}
              required
              className={`w-full rounded-lg p-2 font-space-grotesk font-semibold text-[#222222] ${
                errors.phoneNumber
                  ? 'border-1 border-red-600'
                  : 'border-[#222222] bg-[#f0f0f0]'
              }`}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
            <div className=" mt-4 block w-full border-t border-gray-400 "></div>
          </div>
        )}
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
            <div className="w-full">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                required={
                  !donateAnonymously || state.selectedOption === 'stock'
                }
                className={`w-full rounded-lg p-2 font-space-grotesk font-semibold text-[#222222] ${
                  errors.firstName
                    ? 'border-1 border-red-600'
                    : 'border-[#222222] bg-[#f0f0f0]'
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div className="w-full">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                required={
                  !donateAnonymously || state.selectedOption === 'stock'
                }
                className={`w-full rounded-lg p-2 font-space-grotesk font-semibold text-[#222222] ${
                  errors.lastName
                    ? 'border-1 border-red-600'
                    : 'border-[#222222] bg-[#f0f0f0]'
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>
        </div>
        {/* ADDRESS */}
        {shouldShowAddressFields && (
          <div>
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
                  onBlur={handleBlur}
                  placeholder="Search for a country"
                  className={`flex w-full rounded-lg p-2 font-space-grotesk font-semibold text-[#222222] ${
                    errors.country
                      ? 'border-1 border-red-600'
                      : 'border-[#222222] bg-[#f0f0f0]'
                  }`}
                  onFocus={() => {
                    setSearchTerm(formData.country || '')
                    setShowDropdown(true)
                  }}
                  onKeyDown={handleCountryKeyDown}
                  required
                  aria-haspopup="listbox"
                  aria-expanded={showDropdown}
                  aria-controls="country-listbox"
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                )}
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
              <div className="w-full">
                <input
                  type="text"
                  name="addressLine1"
                  placeholder="Street Address 1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full rounded-lg p-2 font-space-grotesk font-semibold text-[#222222] ${
                    errors.addressLine1
                      ? 'border-1 border-red-600'
                      : 'border-[#222222] bg-[#f0f0f0]'
                  }`}
                />
                {errors.addressLine1 && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.addressLine1}
                  </p>
                )}
              </div>
              <input
                type="text"
                name="addressLine2"
                placeholder="Street Address 2"
                value={formData.addressLine2}
                onChange={handleChange}
                className="w-full rounded-lg border-[#222222] bg-[#f0f0f0] p-2 font-space-grotesk font-semibold text-[#222222]"
              />
              <div className="flex flex-row gap-x-2">
                <div className="w-full">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full rounded-lg p-2 font-space-grotesk font-semibold text-[#222222] ${
                      errors.city
                        ? 'border-1 border-red-600'
                        : 'border-[#222222] bg-[#f0f0f0]'
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>
                <div className="w-full">
                  <input
                    type="text"
                    name="state"
                    placeholder="State/Province/Region"
                    value={formData.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full rounded-lg p-2 font-space-grotesk font-semibold text-[#222222] ${
                      errors.state
                        ? 'border-1 border-red-600'
                        : 'border-[#222222] bg-[#f0f0f0]'
                    }`}
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>
                <div className="w-full">
                  <input
                    type="text"
                    name="zipcode"
                    placeholder="ZIP/Postal Code"
                    value={formData.zipcode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full rounded-lg p-2 font-space-grotesk font-semibold text-[#222222] ${
                      errors.zipcode
                        ? 'border-1 border-red-600'
                        : 'border-[#222222] bg-[#f0f0f0]'
                    }`}
                  />
                  {errors.zipcode && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.zipcode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between space-x-2 pt-8">
          <button
            type="button"
            className="w-1/3 rounded-2xl border border-[#222222] text-xl font-semibold text-[#222222]"
            onClick={() => dispatch({ type: 'SET_STEP', payload: 'payment' })}
          >
            Back
          </button>
          <GradientButton
            isLoading={isLoading}
            disabled={isButtonDisabled}
            type="submit"
            loadingText="Processing.."
          >
            Continue
          </GradientButton>
        </div>
      </form>
    </div>
  )
}

export default PaymentModalPersonalInfo
