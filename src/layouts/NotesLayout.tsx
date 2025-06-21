import { Outlet } from 'react-router-dom'
import Sidebar, { type SidebarItem } from '../components/Sidebar'
import { FiFolder } from 'react-icons/fi'

// dummy folder data—keep in sync with FolderList.tsx if you like
const dummyFolders = [
  { id: '1', name: 'Project Alpha' },
  { id: '2', name: 'Personal'      },
  { id: '3', name: 'Work'          },
]

export default function NotesLayout() {
  const items: SidebarItem[] = dummyFolders.map(f => ({
    label: f.name,
    to:    `/folder/${f.id}`,
    icon:  <FiFolder size={20}/>
  }))

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar items={items} />
      <main className="flex-1 overflow-y-auto bg-slate-100 dark:bg-gray-900 min-h-[calc(100vh-4rem)] p-6 pt-4">
        <Outlet />
      </main>
    </div>
  )
}
