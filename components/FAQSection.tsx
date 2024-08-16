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

const ChevronRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
)

const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
)

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
      setOpenIndex({ catIndex, qIndex })
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
          <h4 className="mb-4 text-2xl font-medium text-gray-700 ">
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
                className="flex w-full cursor-pointer items-center justify-between rounded-none border border-[#222222] bg-[#222222] p-4 text-left font-space-grotesk text-xl font-semibold text-[#c6d3d6]  focus:border-[#222222]  focus:outline-none "
              >
                <span>{faq.question}</span>
                {openIndex &&
                openIndex.catIndex === catIndex &&
                openIndex.qIndex === qIndex ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </button>

              <div
                className={`overflow-hidden border border-[#222222] border-b-black bg-white transition-all duration-700  ${getMaxHeight(
                  catIndex,
                  qIndex
                )}`}
              >
                <div
                  className="p-6 text-gray-700"
                  style={{
                    fontFamily:
                      'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
                  }}
                >
                  <ReactMarkdown className="markdown">
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
