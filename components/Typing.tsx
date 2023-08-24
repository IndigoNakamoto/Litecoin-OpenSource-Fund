import React from 'react'
import Typed from 'typed.js'

export default function Typing() {
  const el = React.useRef(null)

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        'Litecoin',
        'Contributors',
        'FOSS',
        'Developers',
        'Open-Source',
      ],
      typeSpeed: 50,
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
