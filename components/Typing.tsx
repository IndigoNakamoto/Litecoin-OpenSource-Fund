import React from 'react'
import Typed from 'typed.js'

export default function Typing() {
  const el = React.useRef(null)

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        'Growth',
        'Research',
        'Contributors',
        'Hard Money',
        'Partnerships',
        'Open-Source',
        'Developers',
        'Decentralization',
        'Collaboration',
        'Open-Source',
        'Knowledge',
        'Education',
        'Community',
        'Outreach',
      ],
      typeSpeed: 84,
      loop: true,
      cursorChar: '▍',
    })

    return () => {
      typed.destroy()
    }
  }, [])

  return (
    <>
      <span ref={el} />
    </>
  )
}
