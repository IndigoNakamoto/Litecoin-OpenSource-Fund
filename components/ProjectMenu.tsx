import { useState } from 'react'

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

  const handleMenuItemClick = (menuItem: string) => {
    setActiveItem(menuItem)
    onMenuItemChange(menuItem)
  }

  return (
    <nav className="mt-6 border-b border-t border-blue-500 dark:border-blue-400">
      <ul
        className="scroll-snap-type flex space-x-1 overflow-x-auto whitespace-nowrap py-2 dark:text-gray-100"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <li className="group flex h-10 items-center justify-center rounded-lg">
          <button
            onClick={() => handleMenuItemClick('mission')}
            className={`text-lg ${
              activeItem === 'mission'
                ? 'font-semibold text-blue-500 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-100'
            } transform-gpu transition-transform hover:scale-105`}
          >
            Mission
          </button>
        </li>

        <li className="group relative flex h-10 items-center justify-center rounded-lg pr-1">
          <button
            onClick={() => handleMenuItemClick('faq')}
            className={`text-lg ${
              activeItem === 'faq'
                ? 'relative font-semibold text-blue-500 dark:text-blue-300'
                : 'relative text-gray-700 dark:text-gray-100'
            } transform-gpu transition-transform hover:scale-105`}
          >
            FAQ
            <span
              className={`${
                activeItem === 'faq'
                  ? 'absolute right-1 text-xs font-bold text-blue-600 dark:text-blue-400'
                  : 'absolute right-1 text-xs font-semibold text-blue-600 dark:text-blue-400'
              }`}
            >
              {faqCount}
            </span>
          </button>
        </li>

        <li className="group relative flex h-10 items-center justify-center rounded-lg pr-1">
          <button
            onClick={() => handleMenuItemClick('updates')}
            className={`text-lg  ${
              activeItem === 'updates'
                ? 'relative font-semibold text-blue-500 dark:text-blue-300'
                : 'relative text-gray-700 dark:text-gray-100'
            } transform-gpu transition-transform hover:scale-105`}
          >
            Updates
            <span
              className={`${
                activeItem === 'updates'
                  ? 'absolute right-1 text-xs font-bold text-blue-600 dark:text-blue-400'
                  : 'absolute right-1 text-xs font-semibold text-blue-600 dark:text-blue-400'
              }`}
            >
              {updatesCount}
            </span>
          </button>
        </li>
        <li className="group relative flex h-10 items-center justify-center rounded-lg pr-1">
          <button
            onClick={() => handleMenuItemClick('comments')}
            className={`text-lg  ${
              activeItem === 'comments'
                ? 'relative font-semibold text-blue-500 dark:text-blue-300'
                : 'relative text-gray-700 dark:text-gray-100'
            } transform-gpu transition-transform hover:scale-105`}
          >
            Comments
            <span
              className={`${
                activeItem === 'comments'
                  ? 'absolute right-1 text-xs font-bold text-blue-600 dark:text-blue-400'
                  : 'absolute right-1 text-xs font-semibold text-blue-600 dark:text-blue-400'
              }`}
            >
              {commentCount}
            </span>
          </button>
        </li>
        <li className="group flex h-10 items-center justify-center rounded-lg">
          <button
            onClick={() => handleMenuItemClick('community')}
            className={`text-lg  ${
              activeItem === 'community'
                ? 'font-semibold text-blue-500 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-100'
            } transform-gpu transition-transform hover:scale-105`}
          >
            Community
          </button>
        </li>
        {/* <li>
          <button
            onClick={() => handleMenuItemClick('resources')}
            className={`text-lg  ${
              activeItem === 'resources'
                ? 'font-semibold text-blue-500 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-100'
            } transition-transform transform-gpu hover:scale-105`}
          >
            Resources
          </button>
        </li> */}
      </ul>
    </nav>
  )
}

export default ProjectMenu
