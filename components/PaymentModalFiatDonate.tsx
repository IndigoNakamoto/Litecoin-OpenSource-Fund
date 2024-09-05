import React, { useState } from 'react'
import { FaRegCreditCard } from 'react-icons/fa'

// Define the type for card details
interface CardDetails {
  cardNumber: string
  expiryDate: string
  cvv: string
  nameOnCard: string
  zipcode: string
}

function PaymentModalFiatDonate() {
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    zipcode: '',
  })

  const [errors, setErrors] = useState<
    Partial<Record<keyof CardDetails, boolean>>
  >({})

  // Validation functions
  const validators: Record<keyof CardDetails, (value: string) => boolean> = {
    cardNumber: (value) => /^\d{16}$/.test(value.replace(/\s+/g, '')),
    expiryDate: (value) => {
      const match = value.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)
      if (!match) return false
      const expMonth = parseInt(match[1], 10)
      const expYear = parseInt(`20${match[2]}`, 10)
      const today = new Date()
      const expiryDate = new Date(expYear, expMonth - 1, 1)
      return expiryDate > today
    },
    cvv: (value) => /^[0-9]{3,4}$/.test(value),
    zipcode: (value) => /^[0-9]{5}(?:-[0-9]{4})?$/.test(value),
    nameOnCard: (value) =>
      /^[a-zA-Z\s]+$/.test(value) && value.trim().length > 0,
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'cardNumber') {
      // Allow only numeric input and format with spaces (#### #### #### ####)
      const formattedValue = value
        .replace(/\D/g, '') // Remove non-numeric characters
        .replace(/(.{4})/g, '$1 ') // Insert a space every 4 characters
        .trim() // Remove trailing spaces

      setCardDetails({ ...cardDetails, [name]: formattedValue })

      // Validate the card number based on the formatted value (16 digits without spaces)
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: !validators[name as keyof CardDetails](
          formattedValue.replace(/\s+/g, '')
        ),
      }))
      return
    }

    // Prevent wrong input for expiry date
    if (name === 'expiryDate') {
      if (!/^\d{0,2}(\/\d{0,2})?$/.test(value)) return // Allow only MM/YY format
      if (value.length === 2 && !value.includes('/')) {
        setCardDetails({ ...cardDetails, [name]: `${value}/` }) // Automatically add slash
        return
      }
    }

    setCardDetails({ ...cardDetails, [name]: value })

    // Validate the field using the validators map
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: !validators[name as keyof CardDetails](value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Check for any errors before submitting
    if (
      Object.values(errors).every((error) => !error) &&
      Object.values(cardDetails).every((value) => value !== '')
    ) {
      console.log('Processing fiat donation with details:', cardDetails)
    } else {
      console.log('Please correct the errors in the form')
    }
  }

  const getInputClass = (field: keyof CardDetails) => {
    return `w-full rounded-lg ${
      errors[field] ? 'border-red-500' : 'border-white'
    } bg-[#222222] p-2 font-space-grotesk text-white`
  }

  return (
    <div className="flex flex-col space-y-4 p-8">
      <h2 className="font-space-grotesk text-2xl font-bold text-white">
        Complete Your Fiat Donation
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative w-full">
          <FaRegCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 transform text-white" />
          <input
            type="text"
            name="cardNumber"
            placeholder="0000 0000 0000 0000"
            value={cardDetails.cardNumber}
            onChange={handleChange}
            className={`${getInputClass('cardNumber')} pl-10`}
          />
        </div>
        <div className="flex flex-row space-x-3">
          <input
            type="text"
            name="expiryDate"
            placeholder="MM/YY"
            value={cardDetails.expiryDate}
            onChange={handleChange}
            className={getInputClass('expiryDate')}
            maxLength={5} // Prevents input longer than MM/YY
          />
          <input
            type="text"
            name="cvv"
            placeholder="CVV"
            value={cardDetails.cvv}
            onChange={handleChange}
            className={getInputClass('cvv')}
            maxLength={4} // Limits CVV to 3 or 4 digits
          />
          <input
            type="text"
            name="zipcode"
            placeholder="ZIP Code"
            value={cardDetails.zipcode}
            onChange={handleChange}
            className={getInputClass('zipcode')}
          />
        </div>
        <input
          type="text"
          name="nameOnCard"
          placeholder="Cardholder Name"
          value={cardDetails.nameOnCard}
          onChange={handleChange}
          className={getInputClass('nameOnCard')}
        />
        <button
          type="submit"
          className="rounded-4xl w-full border border-white text-2xl font-semibold text-[#222222]"
        >
          Donate
        </button>
      </form>
    </div>
  )
}

export default PaymentModalFiatDonate
