import React, { useState, useEffect } from 'react'
import { faExchange } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/legacy/image'
import { SiBitcoin, SiLitecoin, SiDogecoin } from 'react-icons/si'

type PaymentModalCryptoOptionProps = {
  onCurrencySelect: (
    currency: string,
    value: number,
    rates: { rate: number }
  ) => void // Include rates in prop type
}

// Mock Data
const mockedCurrencyRates = {
  data: {
    rate: 62.2,
  },
  requestId: 'd12c8a86-7719-443e-bf77-5e297859e3ff',
}

const ResponseListCurrenciesExample = {
  data: [
    {
      id: '1185632f-4b01-4c26-9743-d725ebf9acbb',
      name: 'Bitcoin',
      code: 'BTC',
      imageUrl:
        'https://static.tgb-preprod.com/currency_images%2Ff953733b-12dc-4f01-842d-afdf3a227e0e.png',
      isErc20: false,
      network: 'bitcoin',
      minDonation: 0.00001,
    },
    {
      id: '1185612f-4b01-4c26-9743-d725ebf9acbb',
      name: 'Litecoin',
      code: 'LTC',
      imageUrl:
        'https://static.tgbwidget.com/currency_images/4a2db833-c29b-4fe1-a7c7-e76c4d63fd2a.png',
      isErc20: false,
      network: 'litecoin',
      minDonation: 0.001,
    },
    {
      id: '11a3b5c8-67cd-4db8-937d-f8b5fdedb9c1',
      name: 'USD Coin',
      code: 'USDC',
      imageUrl:
        'https://static.tgb-preprod.com/currency_images%2Fbb6ccbe7-6da3-4f72-ad55-7a46d1efa4ea.png',
      isErc20: true,
      network: 'ethereum',
      minDonation: 0.1,
    },
    {
      id: '20f0ecc7-4b3e-4133-a440-0a4cb1e40015',
      name: 'Dogecoin',
      code: 'DOGE',
      imageUrl:
        'https://static.tgb-preprod.com/currency_images%2F8658d28d-140c-4468-963f-58d35af9af45.png',
      isErc20: false,
      network: 'dogecoin',
      minDonation: 0.1,
    },
    {
      id: '4fc399be-7ed7-41d8-9987-31d1a4dfc4d8',
      name: 'Ethereum',
      code: 'ETH',
      imageUrl:
        'https://static.tgb-preprod.com/currency_images%2Fc8fcd5a1-659f-4154-958e-f8eadeb6f4bb.png',
      isErc20: false,
      network: 'ethereum',
      minDonation: 0.001,
    },
    {
      id: '06760767-8b4b-4ba9-a764-9d88f96aa3d3',
      name: 'Polygon',
      code: 'MATIC',
      imageUrl:
        'https://static.tgb-preprod.com/currency_images%2Ff953733b-12dc-4f01-842d-afdf3a227e0e.png',
      minDonation: 0.1,
      network: 'polygon',
    },
  ],
  requestId: 'eafedeec-776f-4bbd-9cbd-f25489c01e94',
}

export default function PaymentModalCryptoOption({
  onCurrencySelect,
}: PaymentModalCryptoOptionProps) {
  const calculateCryptoValue = (usd: number) => (usd / cryptoRate).toFixed(8)

  const [selectedValue, setSelectedValue] = useState('Litecoin')
  const [cryptoRate, setCryptoRate] = useState(mockedCurrencyRates.data.rate)
  const [selectedCurrency, setSelectedCurrency] = useState('LTC')
  const [usdValue, setUsdValue] = useState(100)
  const [cryptoValue, setCryptoValue] = useState(calculateCryptoValue(100))
  const [minDonation, setMinDonation] = useState(0.001)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const initialCurrency = 'Litecoin'
    const initialRate = mockedCurrencyRates.data.rate
    const initialCryptoValue = calculateCryptoValue(100)

    onCurrencySelect('LTC', parseFloat(initialCryptoValue), {
      rate: initialRate,
    })
  }, [])

  const handleUsdChange = (usd: string) => {
    const numericUsd = parseFloat(usd) || 0
    setUsdValue(numericUsd)
    setCryptoValue(calculateCryptoValue(numericUsd))
  }

  const handleCryptoChange = (crypto: string) => {
    const validNumber = /^(\d+\.?\d*|\.\d+)$/
    if (crypto === '' || validNumber.test(crypto)) {
      setCryptoValue(crypto)
      const numericCrypto = parseFloat(crypto) || 0
      setUsdValue(parseFloat((numericCrypto * cryptoRate).toFixed(2)))
    }
  }

  const handleCurrencySelect = (coin: string) => {
    const currency = ResponseListCurrenciesExample.data.find(
      (c) => c.name === coin
    )
    if (currency) {
      const calculatedCryptoValue = calculateCryptoValue(usdValue)
      setSelectedValue(coin)
      setSelectedCurrency(currency.code)
      setMinDonation(
        Math.max(2.5 / mockedCurrencyRates.data.rate, currency.minDonation)
      )
      setCryptoRate(mockedCurrencyRates.data.rate)
      handleUsdChange(usdValue.toString())
      setSearchTerm('')
      setShowDropdown(false)
      onCurrencySelect(
        currency.code,
        parseFloat(calculatedCryptoValue),
        mockedCurrencyRates.data
      )
    }
  }

  const filteredOptions = ResponseListCurrenciesExample.data.filter(
    (currency) => currency.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isNonDefaultCoin =
    selectedValue !== 'Bitcoin' &&
    selectedValue !== 'Litecoin' &&
    selectedValue !== 'Dogecoin'

  const selectedCurrencyData = ResponseListCurrenciesExample.data.find(
    (currency) => currency.code === selectedCurrency
  )

  return (
    <div className="flex w-full flex-col gap-4 pt-5">
      <div className="flex h-full w-full justify-between space-x-3 pt-6 font-space-grotesk">
        {['Bitcoin', 'Litecoin', 'Dogecoin'].map((coin) => (
          <button
            key={coin}
            className={`flex w-44 items-center rounded-3xl border border-white text-lg font-semibold ${
              selectedValue === coin
                ? 'bg-white text-[#222222]'
                : 'bg-[#222222] text-white'
            }`}
            onClick={() => handleCurrencySelect(coin)}
          >
            {coin === 'Bitcoin' && (
              <SiBitcoin className="mr-2 h-[24px] w-[24px]" />
            )}
            {coin === 'Litecoin' && (
              <SiLitecoin className="mr-2 h-[24px] w-[24px]" />
            )}
            {coin === 'Dogecoin' && (
              <SiDogecoin className="mr-2 h-[24px] w-[24px]" />
            )}
            {coin}
          </button>
        ))}
      </div>
      <div>
        {/* Search, dropdown, and select */}
        <div className="relative flex w-full space-y-3">
          <input
            type="text"
            value={isNonDefaultCoin ? selectedValue : searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setShowDropdown(true)
            }}
            placeholder="Search for a coin"
            className={`flex w-full rounded-xl border-white ${
              isNonDefaultCoin
                ? 'bg-white text-[#222222]'
                : 'bg-[#222222] text-white'
            } text-indent-4 p-2 text-left font-space-grotesk text-lg font-bold`}
            onFocus={() => setShowDropdown(true)}
          />
          {showDropdown && filteredOptions.length > 0 && (
            <ul
              className="absolute top-12 max-h-56 w-full overflow-y-auto rounded-lg border border-white bg-[#222222] text-white"
              style={{ zIndex: 10 }}
            >
              {filteredOptions.map((option) => (
                <button
                  key={option.code}
                  onClick={() => handleCurrencySelect(option.name)}
                  className="flex w-full cursor-pointer items-center p-2 text-left hover:bg-[#333333]"
                >
                  <Image
                    src={option.imageUrl}
                    alt={option.name}
                    objectFit="contain"
                    width={24}
                    height={24}
                    className=""
                  />
                  <span className="pl-2">
                    {option.name} {option.isErc20 && <span>(ERC-20)</span>}
                  </span>
                </button>
              ))}
            </ul>
          )}
        </div>

        {/* Conversion Rate calculator */}
        <div className="flex flex-row justify-between pt-4 ">
          <div className="flex items-center overflow-hidden rounded-3xl border border-white pl-2">
            {selectedCurrencyData && (
              <Image
                src={selectedCurrencyData.imageUrl}
                alt={selectedCurrencyData.name}
                width={48}
                height={48}
                objectFit="contain"
                className=""
                style={{ zIndex: 5 }}
              />
            )}
            <div className="flex h-12 w-24 items-center justify-center bg-[#222222]">
              <h1 className="font-space-grotesk text-lg font-semibold text-white">
                {selectedCurrency}
              </h1>
            </div>
            <input
              type="text"
              className="h-full w-40 border-none bg-[#c6d3d6] text-center font-space-grotesk text-lg font-black"
              value={cryptoValue}
              onChange={(e) => handleCryptoChange(e.target.value)}
              min={minDonation}
              step={minDonation}
            />
            <div className="absolute right-0 top-0 h-full w-4 overflow-hidden">
              <div className="h-full w-0 border-b-[24px] border-l-[24px] border-t-[24px] border-b-transparent border-l-[#c6d3d6] border-t-transparent"></div>
            </div>
          </div>

          <FontAwesomeIcon
            icon={faExchange}
            className="m-auto h-10 px-3 text-[#c6d3d6]"
          />

          <div className="flex overflow-hidden rounded-3xl  border border-white">
            <div className="flex h-12 w-24 items-center justify-center bg-[#222222]">
              <h1 className="font-space-grotesk text-lg font-semibold text-white">
                USD
              </h1>
            </div>
            <input
              type="number"
              className="w-36 border-none bg-[#c6d3d6] text-center font-space-grotesk text-lg font-black"
              value={usdValue}
              onChange={(e) => handleUsdChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
