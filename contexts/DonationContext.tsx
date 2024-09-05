// contexts/DonationContext.tsx
import React, { createContext, useContext, useReducer } from 'react'

type DonationState = {
  selectedOption: 'crypto' | 'fiat' | 'stock'
  selectedCurrency: string | null
  selectedCurrencyPledged: string | null
  currentStep: 'payment' | 'personalInfo' | 'cryptoDonate' | 'fiatDonate'
  currencyRates: { rate: number } | null
  donationData: any
  projectSlug: string
  projectTitle: string
}

type Action =
  | { type: 'SET_OPTION'; payload: 'crypto' | 'fiat' | 'stock' }
  | { type: 'SET_CURRENCY'; payload: string }
  | { type: 'SET_PLEDGED_AMOUNT'; payload: string }
  | {
      type: 'SET_STEP'
      payload: 'payment' | 'personalInfo' | 'cryptoDonate' | 'fiatDonate'
    }
  | { type: 'SET_RATES'; payload: { rate: number } }
  | { type: 'SET_DONATION_DATA'; payload: any }
  | { type: 'SET_PROJECT_DETAILS'; payload: any }
  | { type: 'RESET_DONATION_STATE'; payload: any }

const initialState: DonationState = {
  selectedOption: 'crypto',
  selectedCurrency: null,
  selectedCurrencyPledged: null,
  currentStep: 'payment',
  projectSlug: '',
  projectTitle: '',
  currencyRates: null,
  donationData: null,
}

const DonationContext = createContext<{
  state: DonationState
  dispatch: React.Dispatch<Action>
} | null>(null)

const donationReducer = (
  state: DonationState,
  action: Action
): DonationState => {
  switch (action.type) {
    case 'SET_OPTION':
      return { ...state, selectedOption: action.payload }
    case 'SET_CURRENCY':
      return { ...state, selectedCurrency: action.payload }
    case 'SET_PLEDGED_AMOUNT':
      return { ...state, selectedCurrencyPledged: action.payload }
    case 'SET_STEP':
      return { ...state, currentStep: action.payload }
    case 'SET_RATES':
      return { ...state, currencyRates: action.payload }
    case 'SET_DONATION_DATA':
      return { ...state, donationData: action.payload }
    case 'SET_PROJECT_DETAILS':
      return {
        ...state,
        projectSlug: action.payload.slug,
        projectTitle: action.payload.title,
      }
    case 'RESET_DONATION_STATE':
      return initialState // Reset to the initial state
    default:
      return state
  }
}

interface DonationProviderProps {
  children: React.ReactNode
}

export const DonationProvider: React.FC<DonationProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(donationReducer, initialState)

  return (
    <DonationContext.Provider value={{ state, dispatch }}>
      {children}
    </DonationContext.Provider>
  )
}

export const useDonation = () => {
  const context = useContext(DonationContext)
  if (!context) {
    throw new Error('useDonation must be used within a DonationProvider')
  }
  return context
}
