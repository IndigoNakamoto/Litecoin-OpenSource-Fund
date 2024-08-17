import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown' // Import the ReactMarkdown component

type FAQItem = {
  question: string
  answer: string
}

type FAQCategory = {
  category: string
  items: FAQItem[]
}

const PlusIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  return (
    <div
      className={`transform transition-transform duration-700 ${
        isOpen ? 'rotate-[315deg]' : 'rotate-0'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </div>
  )
}

export const FAQSection: React.FC<{ faqCategories: FAQCategory[] }> = ({
  faqCategories,
}) => {
  const [openIndex, setOpenIndex] = useState<{
    catIndex: number
    qIndex: number
  } | null>(null)

  const handleToggle = (catIndex: number, qIndex: number) => {
    if (
      openIndex &&
      openIndex.catIndex === catIndex &&
      openIndex.qIndex === qIndex
    ) {
      setOpenIndex(null)
    } else {
      // Close the currently open FAQ first
      setOpenIndex(null)
      // Open the new FAQ after a short delay to allow the close animation to complete
      setTimeout(() => {
        setOpenIndex({ catIndex, qIndex })
      }, 300) // Adjust this timing to match the duration of your close animation
    }
  }

  const getMaxHeight = (catIndex: number, qIndex: number) => {
    return openIndex &&
      openIndex.catIndex === catIndex &&
      openIndex.qIndex === qIndex
      ? 'max-h-[1000px]' // Adjust this value as needed
      : 'max-h-0'
  }

  if (!faqCategories || faqCategories.length === 0) {
    return (
      <div className="">
        <h3 className="">Frequently Asked Questions</h3>
      </div>
    )
  }

  return (
    <div>
      {faqCategories.map((category, catIndex) => (
        <div key={catIndex} className="">
          <h4 className="mb-4 pt-4 font-space-grotesk text-3xl font-semibold text-[#222222] ">
            {category.category.trim()}
          </h4>
          {category.items.map((faq, qIndex) => (
            <div key={qIndex} className="mb-4">
              <button
                onClick={() => handleToggle(catIndex, qIndex)}
                onKeyPress={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    handleToggle(catIndex, qIndex)
                  }
                }}
                className="flex w-full cursor-pointer items-center justify-between rounded-none border border-[#222222] bg-[#222222] p-6 text-left font-space-grotesk text-xl font-semibold text-[#c6d3d6]  focus:border-[#222222]  focus:outline-none "
              >
                <span>{faq.question}</span>
                <PlusIcon
                  isOpen={
                    openIndex !== null &&
                    openIndex.catIndex === catIndex &&
                    openIndex.qIndex === qIndex
                  }
                />
              </button>

              <div
                className={`overflow-hidden border border-[#222222] border-b-black bg-white transition-all duration-700 ${getMaxHeight(
                  catIndex,
                  qIndex
                )}`}
              >
                <div
                  className="text-md p-6 text-gray-700"
                  style={{
                    fontFamily:
                      'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
                  }}
                >
                  <ReactMarkdown className="text-md">
                    {faq.answer}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
