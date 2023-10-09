import React from 'react'
import Typed from 'typed.js'

export default function Typing() {
  const el = React.useRef(null)

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        'Contributors',
        'Education',
        'Growth',
        'Developers',
        'Partnerships',
        'Collaboration',
        'Open-Source',
        'Community',
        'Research',
        'Knowledge',
        'Outreach',
      ],
      typeSpeed: 68,
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
