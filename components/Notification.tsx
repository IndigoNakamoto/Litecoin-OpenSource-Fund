// components/Notification.js
import { useEffect } from 'react'

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000) // 3 seconds

    return () => clearTimeout(timer) // Cleanup timer on unmount
  }, [onClose])

  return (
    <div className="animate-slide-up fixed bottom-4 left-1/2 -translate-x-1/2 translate-y-full transform rounded bg-[#f3ccc4] px-8 py-4 font-semibold text-[#222222] shadow-lg transition-transform">
      {message}
    </div>
  )
}

export default Notification
