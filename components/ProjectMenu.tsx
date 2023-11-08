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
    const menuElement = menuRef.current

    const checkForOverflow = () => {
      if (menuElement) {
        const { scrollWidth, clientWidth, scrollLeft } = menuElement
        setShowLeftChevron(scrollLeft > 0)
        setShowRightChevron(scrollLeft < scrollWidth - clientWidth)
      }
    }

    // Initial check
    checkForOverflow()

    // Add event listener
    menuElement?.addEventListener('scroll', checkForOverflow)

    // Cleanup
    return () => menuElement?.removeEventListener('scroll', checkForOverflow)
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
          className="z-10 rounded-lg bg-white bg-opacity-50 p-1 text-blue-600"
          onClick={() => scrollMenu('left')}
        >
          <FontAwesomeIcon icon={faChevronLeft} size="2x" />
        </button>
      )}

      <ul
        ref={menuRef}
        className="overflow-x:overlay flex space-x-2 overflow-x-auto whitespace-nowrap py-4 dark:text-gray-100"
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
                {item === 'faq'
                  ? 'FAQ'
                  : item.charAt(0).toUpperCase() + item.slice(1)}{' '}
                {/* Display "FAQ" in uppercase */}
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
          className="z-10 rounded-lg bg-white bg-opacity-50 p-1 text-blue-600"
          onClick={() => scrollMenu('right')}
        >
          <FontAwesomeIcon icon={faChevronRight} size="2x" />
        </button>
      )}
    </nav>
  )
}

export default ProjectMenu
