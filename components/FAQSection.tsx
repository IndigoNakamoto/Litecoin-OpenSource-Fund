import React, { useState } from 'react'
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
  // Changing the state to hold both category and question indices
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
  if (!faqCategories || faqCategories.length === 0) {
    return (
      <div className="">
        <h3 className="">Frequently Asked Questions</h3>
      </div>
    )
  }

  return (
    <div>
      <h6 className="py-8 text-4xl text-gray-700 dark:text-gray-300">
        Frequently Asked Questions
      </h6>
      {faqCategories.map((category, catIndex) => (
        <div
          key={catIndex}
          className="mb-8 border-t border-gray-400 dark:border-gray-700"
        >
          <h4 className="mb-4 mt-4 text-2xl font-medium text-gray-700 dark:text-gray-300">
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
                className="flex w-full cursor-pointer items-center justify-between border border-gray-300 bg-gray-100 p-4 text-left text-gray-700 transition duration-300 hover:bg-white focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:bg-gray-700"
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
                className={`pb-8 pl-4 pt-6 text-gray-700 dark:text-gray-300 ${
                  openIndex &&
                  openIndex.catIndex === catIndex &&
                  openIndex.qIndex === qIndex
                    ? 'block'
                    : 'hidden'
                }`}
              >
                {/* TODO: faq.answer is a string, but needs to be handled like it's markdown */}
                {/* Use the ReactMarkdown component to render the markdown content */}
                <ReactMarkdown className="markdown">{faq.answer}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
