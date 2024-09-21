// components/GradientButton.tsx
import React from 'react'

type GradientButtonProps = {
  onClick?: (
    e?: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLButtonElement>
  ) => void
  isLoading: boolean
  disabled?: boolean
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  backgroundColor?: string // User-defined background color
  textColor?: string // User-defined text gradient color
  textColor2?: string
  loadingText?: string // Customizable loading text
}

const GradientButton: React.FC<GradientButtonProps> = ({
  onClick,
  isLoading,
  disabled,
  children,
  type = 'button',
  backgroundColor = '#222222',
  textColor = '#f0f0f0',
  textColor2 = '#444444',
  loadingText = 'Submitting...',
}) => {
  const isDisabled = disabled || isLoading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`relative w-full overflow-hidden !rounded-2xl py-3 font-space-grotesk text-xl font-semibold transition-colors duration-200 ${
        isDisabled
          ? '!bg-[#222222] !text-gray-600' // Force disabled state styles
          : '!text-[#f0f0f0] hover:bg-opacity-80'
      } focus:outline-none`}
      style={{
        backgroundColor: isDisabled ? '#d1d5db' : backgroundColor,
        color: textColor,
      }} // Apply styles inline to override any external styles
    >
      <span className={`${isLoading ? 'text-gradient-animation ' : ''}`}>
        {isLoading ? loadingText : children}
      </span>
      <style jsx>{`
        .text-gradient-animation {
          background: linear-gradient(
            70deg,
            ${textColor},
            ${textColor},
            ${textColor},
            ${textColor2},
            ${textColor2},
            ${textColor2},
            ${textColor2},
            ${textColor2},
            ${textColor}
          );
          background-size: 200%;
          background-clip: text;
          -webkit-background-clip: text;
          animation: gradient-move 7s infinite;
        }

        @keyframes gradient-move {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </button>
  )
}

export default GradientButton
