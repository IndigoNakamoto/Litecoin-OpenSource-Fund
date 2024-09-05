import React, { useState } from 'react'
import { SiX, SiFacebook, SiLinkedin } from 'react-icons/si'
import { useDonation } from '../contexts/DonationContext' // Import the context

type PaymentModalPersonalInfoProps = {
  onRequestClose: () => void
  onBackClick: () => void
}

const PaymentModalPersonalInfo: React.FC<PaymentModalPersonalInfoProps> = ({
  onRequestClose,
  onBackClick,
}) => {
  const { state, dispatch } = useDonation() // Use the donation context

  const [anonymous, setAnonymous] = useState(false)
  const [taxReceipt, setTaxReceipt] = useState(false)
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
  const countries = [
    'United States',
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo (Congo-Brazzaville)',
    'Costa Rica',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czechia (Czech Republic)',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Eswatini',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Holy See',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar (Burma)',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'North Korea',
    'North Macedonia',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Palestine State',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Korea',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Sweden',
    'Switzerland',
    'Syria',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Timor-Leste',
    'Togo',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Zambia',
    'Zimbabwe',
  ]

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { selectedOption, selectedCurrency, selectedCurrencyPledged } = state

    // Determine which API endpoint to call based on the selected option
    const apiEndpoint =
      selectedOption === 'fiat'
        ? '/api/createFiatDonationPledge'
        : '/api/createDepositAddress'

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        organizationId: 12345678, // Replace with actual org ID
        isAnonymous: anonymous,
        pledgeCurrency: selectedCurrency, // Access from context state
        pledgeAmount: selectedCurrencyPledged, // Access from context state
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
      dispatch({ type: 'SET_DONATION_DATA', payload: data })
      // Navigate to the appropriate donation component based on selected option
      const nextStep = selectedOption === 'fiat' ? 'fiatDonate' : 'cryptoDonate'
      dispatch({ type: 'SET_STEP', payload: nextStep })
    } else {
      // Handle errors
      console.error(data.error)
    }
  }

  const isRequired = (field: string) => {
    if (anonymous) return false
    if (taxReceipt && field === 'email') return true
    return !anonymous
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
            Email Tax Receipt & Confirmation of Donation
          </label>
        </div>
        <span className="block w-full border-t border-gray-400"></span>

        <div>
          <h2 className="font-space-grotesk text-lg text-white">
            Name
            {!anonymous && <span className="text-red-600">*</span>}
          </h2>
          <div className="flex flex-row gap-x-2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required={!anonymous} // Make first name required when not anonymous
              className={`w-full rounded-lg border-white bg-[#222222] p-2 font-space-grotesk text-white ${
                !anonymous ? 'required' : ''
              }`}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required={!anonymous} // Make last name required when not anonymous
              className={`w-full rounded-lg border-white bg-[#222222] p-2 font-space-grotesk text-white ${
                !anonymous ? 'required' : ''
              }`}
            />
          </div>
        </div>

        <div>
          <h2 className="font-space-grotesk text-lg text-white">
            Profile Photo
          </h2>

          <div className="flex flex-col">
            <div className="flex flex-row">
              <div className="my-2 h-[64px] min-w-[64px] rounded-full bg-green-400"></div>
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
            Email
            {(!anonymous || taxReceipt) && (
              <span className="text-red-600">*</span>
            )}
          </h2>
          <p className="my-auto pb-1 font-space-grotesk text-sm text-gray-400">
            Enter email for tax receipt & confirmation of donation
          </p>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required={isRequired('email')}
            className="w-full rounded-lg border-white bg-[#222222] p-2 font-space-grotesk text-white"
          />
        </div>

        <div>
          <h2 className="font-space-grotesk text-lg text-white">
            Address
            {!anonymous && <span className="text-red-600">*</span>}
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
                className="flex w-full rounded-lg border-white bg-[#222222] p-2 text-left font-space-grotesk  text-white"
                onFocus={() => {
                  setSearchTerm('') // Clears the current value when clicked
                  setShowDropdown(true)
                }}
              />
              {showDropdown && filteredCountries.length > 0 && (
                <ul
                  className="absolute top-12 max-h-56 w-full overflow-y-auto rounded-lg border border-white bg-[#222222] text-white"
                  style={{ zIndex: 10 }}
                >
                  {filteredCountries.map((country) => (
                    <button
                      key={country}
                      onClick={() => handleCountrySelect(country)}
                      className="flex w-full cursor-pointer items-center p-2 text-left hover:bg-[#333333]"
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
              required={isRequired('address')}
              className="w-full rounded-lg border-white bg-[#222222] p-2 font-space-grotesk text-white"
            />
            <input
              type="text"
              name="address2"
              placeholder="Street Address 2"
              value={formData.address2}
              onChange={handleChange}
              className="w-full rounded-lg border-white bg-[#222222] p-2 font-space-grotesk text-white"
            />
            <div className="flex flex-row gap-x-2">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="w-full rounded-lg border-white bg-[#222222] p-2 font-space-grotesk text-white"
              />
              <input
                type="text"
                name="state"
                placeholder="State/Province/Region"
                value={formData.state}
                onChange={handleChange}
                className="w-full rounded-lg border-white bg-[#222222] p-2 font-space-grotesk text-white"
              />
              <input
                type="text"
                name="postalCode"
                placeholder="ZIP/Postal Code"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full rounded-lg border-white bg-[#222222] p-2 font-space-grotesk text-white"
              />
            </div>
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
            className="w-2/3 !rounded-2xl bg-white text-2xl font-semibold !text-[#222222]"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}

export default PaymentModalPersonalInfo
