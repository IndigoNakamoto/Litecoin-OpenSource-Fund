// components/ProjectMenu.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'

type ProjectMenuProps = {
  onMenuItemChange: (menuItem: string) => void
}

const ProjectMenu: React.FC<ProjectMenuProps> = ({ onMenuItemChange }) => {
  const router = useRouter()
  const { slug } = router.query

  const [activeItem, setActiveItem] = useState('project')

  const handleMenuItemClick = (menuItem: string) => {
    setActiveItem(menuItem)
    onMenuItemChange(menuItem)
  }

  return (
    <nav className="mt-6 border-b border-t border-gray-300 dark:border-gray-700">
      <ul className="flex space-x-4 text-gray-900 dark:text-gray-100">
        <li>
          <button
            onClick={() => handleMenuItemClick('project')}
            className={`${
              activeItem === 'project' ? 'font-bold' : ''
            } text-gray-700 text-gray-900 hover:text-black dark:text-gray-100 sm:p-4 md:inline-block`}
          >
            Project
          </button>
        </li>
        <li>
          <button
            onClick={() => handleMenuItemClick('comments')}
            className={`${
              activeItem === 'comments' ? 'font-bold' : ''
            } text-gray-700 text-gray-900 hover:text-black dark:text-gray-100 sm:p-4 md:inline-block`}
          >
            Comments
          </button>
        </li>
        <li>
          <button
            onClick={() => handleMenuItemClick('community')}
            className={`${
              activeItem === 'community' ? 'font-bold' : ''
            } text-gray-700 text-gray-900 hover:text-black dark:text-gray-100 sm:p-4 md:inline-block`}
          >
            Community
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default ProjectMenu
