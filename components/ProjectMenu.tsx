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
      <ul className="flex space-x-4 p-1 font-medium text-gray-900 dark:text-gray-100">
        <li>
          <button
            onClick={() => handleMenuItemClick('project')}
            className={`${
              activeItem === 'project' ? 'font-bold' : ''
            } text-gray-700 hover:text-black`}
          >
            Project
          </button>
        </li>
        <li>
          <button
            onClick={() => handleMenuItemClick('comments')}
            className={`${
              activeItem === 'comments' ? 'font-bold' : ''
            } text-gray-700 hover:text-black`}
          >
            Comments
          </button>
        </li>
        <li>
          <button
            onClick={() => handleMenuItemClick('community')}
            className={`${
              activeItem === 'community' ? 'font-bold' : ''
            } text-gray-700 hover:text-black`}
          >
            Community
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default ProjectMenu
