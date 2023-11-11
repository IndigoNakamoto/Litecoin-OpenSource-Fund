import React, { useState, useEffect } from 'react'

export default function TypingScroll() {
  const words = [
    'Growth',
    'Research',
    'Contributors',
    'Hard Money',
    'Partnerships',
    'Open-Source',
    'Developers',
    'Decentralization',
    'Collaboration',
    'Knowledge',
    'Education',
    'Community',
    'Outreach',
  ]

  // Duplicate the words array
  const doubledWords = [...words, ...words]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // Reset to 0 when reaching the end of the first list
        if (prevIndex === words.length - 1) {
          return 0
        }
        return prevIndex + 1
      })
    }, 2000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div style={{ overflow: 'hidden', height: '50px' }}>
      <div
        className="mx-auto flex flex-col items-center"
        style={{
          transform: `translateY(${-50 * currentIndex}px)`,
          transition: currentIndex === 0 ? 'none' : 'transform 0.4s ease',
        }}
      >
        {doubledWords.map((word, index) => (
          <div key={index} style={{ lineHeight: '50px' }}>
            {word}
          </div>
        ))}
      </div>
    </div>
  )
}
