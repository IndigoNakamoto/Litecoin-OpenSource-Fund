import React, { useState } from 'react'

const StockSymbols = [
  'Stock Ticker Symbol',
  'AAPL',
  'AMZN',
  'COST',
  'NVDA',
  'TSLA',
  'GOOG',
]

const StockName = [
  'Stock Name',
  'Apple',
  'Amazon',
  'Costco',
  'Nvidia',
  'Tesla',
  'Alphabet',
]

// Replace StockSymbols and StockName with TickerResponse
// When user selects a ticker the stock name will populate in the select stock name value and vice versa
const TickerResponse = {
  data: {
    tickers: [
      {
        name: 'Agilent Technologies Inc.',
        ticker: 'A',
      },
      {
        name: 'Alcoa Corporation',
        ticker: 'AA',
      },
      {
        name: 'AXS First Priority CLO Bond ETF',
        ticker: 'AAA',
      },
      {
        name: 'Goldman Sachs Physical Gold ETF Shares',
        ticker: 'AAAU',
      },
      {
        name: 'Ares Acquisition Corporation',
        ticker: 'AAC',
      },
    ],
    pagination: {
      itemsPerPage: 5,
      page: 1,
      count: 10002,
    },
  },
  requestId: 'e50360a5-13c9-4f07-95fc-3bb455f352ea',
}

export default function PaymentModalStockOption() {
  const [selectedStockSymbolValue, setSelectedStockSymbolValue] = useState(
    'Stock Ticker Symbol'
  )
  const [selectedStockNameValue, setSelectedStockNameValue] =
    useState('Stock Name')

  return (
    <div className="flex w-full flex-col gap-4 pt-5">
      <div>
        <div className="flex w-full flex-col gap-3">
          <select
            value={selectedStockSymbolValue}
            onChange={(e) => setSelectedStockSymbolValue(e.target.value)}
            className="flex w-full rounded-3xl border-white bg-[#222222] text-left font-space-grotesk text-lg font-bold text-white"
          >
            {StockSymbols.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={selectedStockNameValue}
            onChange={(e) => setSelectedStockNameValue(e.target.value)}
            className="flex w-full rounded-3xl border-white bg-[#222222] text-left font-space-grotesk text-lg font-bold text-white"
          >
            {StockName.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
