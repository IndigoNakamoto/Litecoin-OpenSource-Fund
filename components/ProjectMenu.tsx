// components/ProjectMenu.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'

type ProjectMenuProps = {
  onMenuItemChange: (menuItem: string) => void
  activeMenu: string | null
}

const ProjectMenu: React.FC<ProjectMenuProps> = ({
  onMenuItemChange,
  activeMenu,
}) => {
  const [activeItem, setActiveItem] = useState(activeMenu)

  const handleMenuItemClick = (menuItem: string) => {
    setActiveItem(menuItem)
    onMenuItemChange(menuItem)
  }

  return (
    <nav className="mt-6 border-b border-t border-gray-300 dark:border-gray-700">
      <ul className="flex space-x-4  dark:text-gray-100">
        <li>
          <button
            onClick={() => handleMenuItemClick('mission')}
            className={`${
              activeItem === 'mission'
                ? 'font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400'
                : 'text-gray-700 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400 '
            }   sm:p-4 md:inline-block lg:p-2`}
          >
            Mission
          </button>
        </li>
        <li>
          <button
            onClick={() => handleMenuItemClick('updates')}
            className={`${
              activeItem === 'updates'
                ? 'font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400'
                : 'text-gray-700 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400 '
            }   sm:p-4 md:inline-block lg:p-2`}
          >
            Updates
          </button>
        </li>
        <li>
          <button
            onClick={() => handleMenuItemClick('FAQ')}
            className={`${
              activeItem === 'FAQ'
                ? 'font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400'
                : 'text-gray-700 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400 '
            }   sm:p-4 md:inline-block lg:p-2`}
          >
            FAQ
          </button>
        </li>
        <li>
          <button
            onClick={() => handleMenuItemClick('comments')}
            className={`${
              activeItem === 'comments'
                ? 'font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400'
                : 'text-gray-700 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400 '
            }   sm:p-4 md:inline-block lg:p-2`}
          >
            #Comments
          </button>
        </li>
        <li>
          <button
            onClick={() => handleMenuItemClick('community')}
            className={`${
              activeItem === 'community'
                ? 'font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400'
                : 'text-gray-700 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400 '
            }   sm:p-4 md:inline-block lg:p-2`}
          >
            Community
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default ProjectMenu
