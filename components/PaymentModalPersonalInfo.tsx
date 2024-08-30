import React, { useState } from 'react'
import { SiX, SiFacebook, SiLinkedin } from 'react-icons/si'

type PaymentModalPersonalInfoProps = {
  onRequestClose: () => void
  onBackClick: () => void
}

const PaymentModalPersonalInfo: React.FC<PaymentModalPersonalInfoProps> = ({
  onRequestClose,
  onBackClick,
}) => {
  const [anonymous, setAnonymous] = useState(false)
  const [taxReceipt, setTaxReceipt] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <div className="flex flex-col space-y-4 p-8">
      <h2 className="font-space-grotesk text-2xl font-bold text-white">
        Personal Information
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <span className="block w-full border-t border-gray-400"></span>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={() => setAnonymous(!anonymous)}
            className="h-4 w-4 border-white bg-[#222222]"
            id="donate-anonymously"
          />
          <label htmlFor="donate-anonymously" className="text-white">
            Donate anonymously
          </label>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={taxReceipt}
            onChange={() => setTaxReceipt(!taxReceipt)}
            className="h-4 w-4 border-white bg-[#222222]"
            id="tax-receipt"
          />
          <label htmlFor="tax-receipt" className="text-white">
            Tax Receipt
          </label>
        </div>
        <span className="block w-full border-t border-gray-400"></span>

        <div>
          <h2 className="font-space-grotesk text-lg text-white">
            Name<span className="text-red-600">*</span>
          </h2>
          <div className="flex flex-row gap-x-2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full rounded-lg border-white bg-[#222222] p-2  font-space-grotesk text-white "
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full rounded-lg border-white bg-[#222222] p-2  font-space-grotesk text-white"
            />
          </div>
        </div>
        <div>
          <h2 className="font-space-grotesk text-lg text-white">
            Profile Photo
          </h2>

          <div className="flex flex-col">
            <div className="flex flex-row">
              <div className="my-2 h-[64px]  min-w-[64px] rounded-full bg-green-400"></div>
              <p className="my-auto ml-8 font-space-grotesk text-sm text-gray-400">
                Upload a verified profile photo to show your support. Your photo
                and a link to your account will be featured in our community
                section.
              </p>
            </div>
            <div>
              <div className="flex flex-row justify-between space-x-2">
                <button className="flex w-full flex-row rounded-lg bg-white text-[#222222]">
                  Verify
                  <SiX className="ml-2 h-6 w-6" />
                </button>
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
        <div>
          <h2 className="font-space-grotesk text-lg text-white">
            Email<span className="text-red-600">*</span>
          </h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border-white bg-[#222222] p-2  font-space-grotesk text-white"
          />
        </div>

        <div>
          <h2 className="font-space-grotesk text-lg text-white">
            Address<span className="text-red-600">*</span>
          </h2>
          <div className="flex flex-col gap-y-2">
            <input
              type="text"
              name="address"
              placeholder="Street Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-lg border-white bg-[#222222] p-2  font-space-grotesk text-white"
            />
            <div className="flex flex-row gap-x-2">
              <input
                type="text"
                name="postalCode"
                placeholder="ZIP Code"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-24 rounded-lg  border-white bg-[#222222] p-2 font-space-grotesk text-white"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="w-full rounded-lg border-white bg-[#222222] p-2  font-space-grotesk text-white"
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                className="w-full rounded-lg  border-white bg-[#222222] p-2  font-space-grotesk text-white"
              />
            </div>
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              className="w-60 rounded-lg  border-white bg-[#222222] p-2 font-space-grotesk text-white"
            />
          </div>
        </div>
        <div className="flex justify-between space-x-2 pt-8">
          <button
            type="button"
            className="w-1/3 rounded-2xl border border-white text-xl font-semibold text-white"
            onClick={onBackClick}
          >
            Back
          </button>
          <button
            type="submit"
            className="w-2/3 !rounded-2xl bg-white text-2xl  font-semibold !text-[#222222]"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}

export default PaymentModalPersonalInfo
