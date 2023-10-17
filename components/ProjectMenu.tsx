// components/ProjectMenu.tsx
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
    <nav className="mt-6 border-b border-t border-gray-300 dark:border-gray-700">
      <ul
        className="scroll-snap-type flex space-x-4 overflow-x-auto whitespace-nowrap py-4  dark:text-gray-100"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <li>
          <button
            onClick={() => handleMenuItemClick('mission')}
            className={`${
              activeItem === 'mission'
                ? 'font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400'
                : 'text-gray-700 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400 '
            }   md:inline-block`}
          >
            Mission
          </button>
        </li>
        <li className="relative">
          <button
            onClick={() => handleMenuItemClick('comments')}
            className={`${
              activeItem === 'comments'
                ? 'relative font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400'
                : 'relative text-gray-700 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400'
            }   md:inline-block`}
          >
            Comments
            <span className="absolute top-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
              {commentCount}
            </span>
          </button>
        </li>

        <li className="relative">
          <button
            onClick={() => handleMenuItemClick('faq')}
            className={`${
              activeItem === 'faq'
                ? 'relative font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400'
                : 'relative text-gray-700 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400'
            }    md:inline-block `}
          >
            FAQ
            <span className="absolute top-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
              {faqCount}
            </span>
          </button>
        </li>

        <li className="relative">
          <button
            onClick={() => handleMenuItemClick('updates')}
            className={`${
              activeItem === 'updates'
                ? 'relative font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400'
                : 'relative text-gray-700 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400'
            }   md:inline-block`}
          >
            Updates
            <span className="absolute top-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
              {updatesCount}
            </span>
          </button>
        </li>
        <li>
          <button
            onClick={() => handleMenuItemClick('community')}
            className={`${
              activeItem === 'community'
                ? 'font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400'
                : 'text-gray-700 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400 '
            }   md:inline-block`}
          >
            Community
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default ProjectMenu
