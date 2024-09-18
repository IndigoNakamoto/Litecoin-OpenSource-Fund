// components/PaymentModalCryptoOption.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { faExchange } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/legacy/image'
import { SiBitcoin, SiLitecoin, SiDogecoin } from 'react-icons/si'
import { useDonation } from '../contexts/DonationContext' // Import the context
import axios from 'axios'

type Currency = {
  code: string
  name: string
  minDonation: number
  imageUrl: string
  isErc20?: boolean
}

const excludedCoins = ['XRP'] // Add more names or codes as needed

interface PaymentModalCryptoOptionProps {
  onCurrencySelect: (
    currencyCode: string,
    amount: number,
    rateInfo: { rate: number }
  ) => void
}

export default function PaymentModalCryptoOption({
  onCurrencySelect,
}: PaymentModalCryptoOptionProps) {
  const { state, dispatch } = useDonation()
  const {
    currencyList,
    selectedCurrencyCode,
    selectedCurrencyName,
    usdInput,
    cryptoInput,
  } = state

  // Local State Variables
  const [cryptoRate, setCryptoRate] = useState<number | null>(null)
  const [usdValue, setUsdValue] = useState<string>(usdInput || '100') // Calculated USD value
  const [cryptoValue, setCryptoValue] = useState<string>(cryptoInput || '') // Calculated crypto value
  const [minDonation, setMinDonation] = useState<number>(0.001)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const [isLoadingRate, setIsLoadingRate] = useState<boolean>(false) // Loading state for fetching rate
  const [error, setError] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Utility functions to calculate values
  const calculateCryptoValue = useCallback((usd: number, rate: number) => {
    return (usd / rate).toFixed(8).replace(/\.?0+$/, '') || '0'
  }, [])

  const calculateUsdValue = useCallback((crypto: number, rate: number) => {
    return (crypto * rate).toFixed(2).replace(/\.?0+$/, '') || '0'
  }, [])

  // Fetch Crypto Rate when selectedCurrencyCode changes
  useEffect(() => {
    const fetchCryptoRate = async (currencyCode: string) => {
      try {
        setIsLoadingRate(true)
        setError(null)
        const response = await axios.get(
          `/api/getCryptoRate?currency=${currencyCode}`
        )
        const rate = response.data.data.rate
        if (rate) {
          setCryptoRate(rate)
          setMinDonation(2.5 / rate) // Update min donation based on rate

          // Update values based on existing inputs
          if (usdInput) {
            const numericUsd = parseFloat(usdInput)
            if (!isNaN(numericUsd)) {
              const newCryptoValue = calculateCryptoValue(numericUsd, rate)
              setCryptoValue(newCryptoValue)
              dispatch({
                type: 'SET_FORM_DATA',
                payload: {
                  pledgeAmount: newCryptoValue,
                  pledgeCurrency: selectedCurrencyCode || '',
                  assetName: selectedCurrencyName || '',
                },
              })
              onCurrencySelect(
                selectedCurrencyCode || '',
                parseFloat(newCryptoValue),
                {
                  rate,
                }
              )
            }
          } else if (cryptoInput) {
            const numericCrypto = parseFloat(cryptoInput)
            if (!isNaN(numericCrypto)) {
              const newUsdValue = calculateUsdValue(numericCrypto, rate)
              setUsdValue(newUsdValue)
              dispatch({
                type: 'SET_FORM_DATA',
                payload: {
                  pledgeAmount: cryptoInput,
                  pledgeCurrency: selectedCurrencyCode || '',
                  assetName: selectedCurrencyName || '',
                },
              })
              onCurrencySelect(selectedCurrencyCode!, numericCrypto, {
                rate,
              })
            }
          }
        } else {
          throw new Error('Invalid rate data')
        }
      } catch (error) {
        console.error('Error fetching crypto rate:', error)
        setError('Failed to load the cryptocurrency rate.')
        setCryptoRate(null)
      } finally {
        setIsLoadingRate(false)
      }
    }

    if (selectedCurrencyCode) {
      fetchCryptoRate(selectedCurrencyCode.toLowerCase())
    }
    // Only depend on selectedCurrencyCode
  }, [selectedCurrencyCode, selectedCurrencyName])

  // Update cryptoValue when usdInput changes
  useEffect(() => {
    if (usdInput && cryptoRate) {
      const numericUsd = parseFloat(usdInput)
      if (!isNaN(numericUsd)) {
        const newCryptoValue = calculateCryptoValue(numericUsd, cryptoRate)
        setCryptoValue(newCryptoValue)
        dispatch({
          type: 'SET_FORM_DATA',
          payload: {
            pledgeAmount: newCryptoValue,
            pledgeCurrency: selectedCurrencyCode || undefined,
            assetName: selectedCurrencyName || '',
          },
        })
      } else {
        setCryptoValue('')
      }
    } else if (usdInput === '') {
      setCryptoValue('')
    }
  }, [
    usdInput,
    cryptoRate,
    calculateCryptoValue,
    dispatch,
    selectedCurrencyCode,
  ])

  // Update usdValue when cryptoInput changes
  useEffect(() => {
    if (cryptoInput && cryptoRate) {
      const numericCrypto = parseFloat(cryptoInput)
      if (!isNaN(numericCrypto)) {
        const newUsdValue = calculateUsdValue(numericCrypto, cryptoRate)
        setUsdValue(newUsdValue)
        dispatch({
          type: 'SET_FORM_DATA',
          payload: {
            pledgeAmount: cryptoInput,
            pledgeCurrency: selectedCurrencyCode || '',
            assetName: selectedCurrencyName || '',
          },
        })
      } else {
        setUsdValue('')
      }
    } else if (cryptoInput === '') {
      setUsdValue('')
    }
  }, [
    cryptoInput,
    cryptoRate,
    calculateUsdValue,
    dispatch,
    selectedCurrencyCode,
  ])

  // Handle USD input changes
  const handleUsdChange = (usd: string) => {
    // Validation regex for up to 2 decimal places and max 10,000,000
    const regex = /^\d{0,10}(\.\d{0,2})?$/
    if (regex.test(usd) || usd === '') {
      dispatch({ type: 'SET_USD_INPUT', payload: usd })
      dispatch({ type: 'SET_CRYPTO_INPUT', payload: '' }) // Clear crypto input when user is typing in USD
      setCryptoValue('') // Clear local cryptoValue to allow manual input
    }
  }

  // Handle Crypto input changes
  const handleCryptoChange = (crypto: string) => {
    // Validation regex for up to 8 decimal places and between 0.00000001 and 10,000,000
    const regex = /^\d{0,8}(\.\d{0,8})?$/
    const numericCrypto = parseFloat(crypto)

    if (
      (regex.test(crypto) &&
        numericCrypto >= 0.00000001 &&
        numericCrypto <= 10000000) ||
      crypto === ''
    ) {
      dispatch({ type: 'SET_CRYPTO_INPUT', payload: crypto })
      dispatch({ type: 'SET_USD_INPUT', payload: '' }) // Clear USD input when user is typing in crypto
      setUsdValue('') // Clear local usdValue to allow manual input
    }
  }

  // Handle Currency Selection
  const handleCurrencySelect = (coin: string) => {
    const currency = currencyList.find((c) => c.name === coin)
    if (currency) {
      dispatch({
        type: 'SET_SELECTED_CURRENCY',
        payload: { code: currency.code, name: currency.name },
      })
      setSearchTerm(coin)
      setShowDropdown(false)

      // Ensure the donate button is enabled after valid selection
      dispatch({ type: 'SET_DONATE_BUTTON_DISABLED', payload: false })
    }
  }

  // Handle Key Down Events for Dropdown Navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        break
      case 'Enter':
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length
        ) {
          handleCurrencySelect(filteredOptions[highlightedIndex].name)
        }
        break
      case 'Tab':
        if (filteredOptions.length > 0) {
          e.preventDefault()
          setHighlightedIndex(0)
          setShowDropdown(true)
        }
        break
      default:
        break
    }
  }

  // Filter currency options based on search term and exclusion list
  const filteredOptions: Currency[] = currencyList.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !excludedCoins.includes(currency.name)
  )

  // Find selected currency data for display
  const selectedCurrencyData = currencyList.find(
    (currency) => currency.code === selectedCurrencyCode
  )

  return (
    <div ref={dropdownRef} className="flex w-full flex-col gap-4 pt-5">
      {/* Currency Selection Buttons */}
      <div className="flex h-full w-full justify-between space-x-3 pt-6 font-space-grotesk">
        {['Bitcoin', 'Litecoin', 'Dogecoin'].map((coin) => (
          <button
            key={coin}
            className={`flex w-44 items-center rounded-3xl border border-[#222222] text-lg font-semibold ${
              selectedCurrencyName === coin
                ? 'bg-[#222222] text-[#f0f0f0]'
                : 'bg-[#f0f0f0] text-[#222222]'
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

      {/* Search and Dropdown */}
      <div className="relative flex w-full space-y-3">
        <input
          type="text"
          value={
            isFocused
              ? searchTerm
              : ['Bitcoin', 'Litecoin', 'Dogecoin'].includes(
                  selectedCurrencyName || ''
                ) // Use optional chaining and fallback
              ? ''
              : selectedCurrencyName || '' // Use fallback value to ensure it's never null
          }
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setShowDropdown(true)
          }}
          placeholder="Search for a coin"
          className={`flex w-full rounded-xl border-[#222222] ${
            !['Bitcoin', 'Litecoin', 'Dogecoin'].includes(
              selectedCurrencyName || ''
            ) // Use optional chaining and fallback
              ? 'bg-[#222222] text-[#f0f0f0]'
              : 'bg-[#f0f0f0] text-[#222222]'
          } p-2 text-left font-space-grotesk text-lg font-bold`}
          onFocus={() => {
            setIsFocused(true)
            setShowDropdown(true)
            if (
              ['Bitcoin', 'Litecoin', 'Dogecoin'].includes(
                selectedCurrencyName || ''
              )
            ) {
              // Use optional chaining and fallback
              setSearchTerm('')
            }
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
        />

        {showDropdown && filteredOptions.length > 0 && (
          <ul
            className="absolute top-12 max-h-56 w-full overflow-y-auto rounded-lg border border-[#222222] bg-[#222222] text-white"
            style={{ zIndex: 10 }}
          >
            {filteredOptions.map((option, index) => (
              <button
                key={option.code}
                onClick={() => handleCurrencySelect(option.name)}
                className={`flex w-full cursor-pointer items-center p-2 text-left hover:bg-[#333333] ${
                  highlightedIndex === index ? 'bg-gray-300' : ''
                }`}
              >
                <Image
                  src={option.imageUrl}
                  alt={option.name}
                  objectFit="contain"
                  width={24}
                  height={24}
                />
                <span className="pl-2">
                  {option.name} {option.isErc20 && <span>(ERC-20)</span>}
                </span>
              </button>
            ))}
          </ul>
        )}

        {/* Display error if any */}
      </div>

      {/* Conversion Rate Calculator */}
      <div className="flex flex-row justify-between pt-4">
        {/* Crypto Input */}
        <div className="flex items-center overflow-hidden rounded-3xl border border-[#222222] bg-[#222222] pl-2">
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
              {selectedCurrencyCode}
            </h1>
          </div>
          <input
            type="text"
            name="cryptoInput"
            className={`h-full w-40 border-none text-center font-space-grotesk text-lg font-black ${
              isLoadingRate ? 'loading-gradient' : 'bg-[#c6d3d6]'
            }`}
            value={cryptoInput !== '' ? cryptoInput : cryptoValue}
            onChange={(e) => handleCryptoChange(e.target.value)}
            min={minDonation}
            step={minDonation}
            disabled={isLoadingRate}
          />
          {/* Styles for Gradient Animation */}
        </div>

        {/* Exchange Icon */}
        <FontAwesomeIcon
          icon={faExchange}
          className="m-auto h-10 px-3 text-[#c6d3d6]"
        />

        {/* USD Input */}
        <div className="flex overflow-hidden rounded-3xl border border-[#222222]">
          <div className="flex h-12 w-24 items-center justify-center bg-[#222222]">
            <h1 className="font-space-grotesk text-lg font-semibold text-[#f2f2f2]">
              USD
            </h1>
          </div>
          <input
            type="text"
            name="usdInput"
            className="w-36 border-none bg-[#c6d3d6] text-center font-space-grotesk text-lg font-black"
            value={usdInput !== '' ? usdInput : usdValue}
            onChange={(e) => handleUsdChange(e.target.value)}
            disabled={isLoadingRate}
          />
        </div>
      </div>
      {error && (
        <p className="mt-0 font-space-grotesk font-semibold text-red-500">
          {error}
        </p>
      )}

      {/* Styles for Gradient Animation */}
      <style jsx>{`
        @keyframes gradient-animation {
          0% {
            background-position: 200% 0%;
          }
          100% {
            background-position: -200% 0%;
          }
        }
      `}</style>

      <style jsx>{`
        .loading-gradient {
          background: linear-gradient(
            90deg,
            #c6d3d6,
            #c6d3d6,
            #ffffff,
            #ffffff,
            #ffffff,
            #ffffff,
            #c6d3d6,
            #c6d3d6,
            #c6d3d6
          );
          background-size: 200% 100%;
          animation: gradient-animation 4s infinite linear;
        }
      `}</style>
    </div>
  )
}
