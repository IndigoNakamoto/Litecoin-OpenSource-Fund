import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'

type ProjectMenuProps = {
  onMenuItemChange: (menuItem: string) => void
  activeMenu: string | null
  commentCount: number | 0
  faqCount: number | 0
  updatesCount: number | 0
}

const ProjectMenu: React.FC<ProjectMenuProps> = ({
  onMenuItemChange,
  activeMenu,
  commentCount,
  faqCount,
  updatesCount,
}) => {
  const [activeItem, setActiveItem] = useState(activeMenu)
  const [showLeftChevron, setShowLeftChevron] = useState(false)
  const [showRightChevron, setShowRightChevron] = useState(true) // Assuming there's overflow initially
  const menuRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const checkForOverflow = () => {
      if (menuRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = menuRef.current
        setShowLeftChevron(scrollLeft > 0)
        setShowRightChevron(scrollLeft < scrollWidth - clientWidth)
      }
    }

    // Initial check
    checkForOverflow()

    // Add event listener
    menuRef.current?.addEventListener('scroll', checkForOverflow)

    // Cleanup
    return () =>
      menuRef.current?.removeEventListener('scroll', checkForOverflow)
  }, [])

  const scrollMenu = (direction: 'left' | 'right') => {
    if (menuRef.current) {
      const { clientWidth } = menuRef.current
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth
      menuRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handleMenuItemClick = (menuItem: string) => {
    setActiveItem(menuItem)
    onMenuItemChange(menuItem)
  }

  return (
    <nav className="relative mt-6 flex h-16 items-center justify-between border-b border-t border-blue-500 dark:border-blue-500">
      {showLeftChevron && (
        <button
          className="z-10 p-2 text-blue-600"
          onClick={() => scrollMenu('left')}
        >
          <FontAwesomeIcon icon={faChevronLeft} size="2x" />
        </button>
      )}

      <ul
        ref={menuRef}
        className="flex space-x-1 overflow-x-auto whitespace-nowrap py-2 dark:text-gray-100"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {/* Wrap the button in a div for each li */}
        {['mission', 'faq', 'updates', 'comments', 'community'].map((item) => (
          <li
            className="group flex h-16 items-center justify-center rounded-lg"
            key={item}
          >
            <div className="transform-gpu overflow-hidden rounded-xl transition duration-200 hover:bg-white dark:hover:bg-gray-800">
              <button
                onClick={() => handleMenuItemClick(item)}
                className={`text-lg ${
                  activeItem === item
                    ? 'font-semibold text-blue-500 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-100'
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}{' '}
                {/* Capitalize the first letter */}
                {item === 'faq' && (
                  <span
                    className={`absolute right-1 text-xs ${
                      activeItem === 'faq'
                        ? 'font-bold text-blue-600 dark:text-blue-400'
                        : 'font-semibold text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {faqCount}
                  </span>
                )}
                {item === 'updates' && (
                  <span
                    className={`absolute right-1 text-xs ${
                      activeItem === 'updates'
                        ? 'font-bold text-blue-600 dark:text-blue-400'
                        : 'font-semibold text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {updatesCount}
                  </span>
                )}
                {item === 'comments' && (
                  <span
                    className={`absolute right-1 text-xs ${
                      activeItem === 'comments'
                        ? 'font-bold text-blue-600 dark:text-blue-400'
                        : 'font-semibold text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {commentCount}
                  </span>
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showRightChevron && (
        <button
          className="absolute right-0 z-10 p-2 text-blue-600"
          onClick={() => scrollMenu('right')}
        >
          <FontAwesomeIcon icon={faChevronRight} size="2x" />
        </button>
      )}
    </nav>
  )
}

export default ProjectMenu
