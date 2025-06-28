import { Outlet } from 'react-router-dom'
import Sidebar, {type SidebarItem} from '../components/Sidebar'
import { FiFolder, FiList } from 'react-icons/fi'

export default function DashboardLayout() {
  const items: SidebarItem[] = [
    { label: 'Folders',   to: '/dashboard',     icon: <FiFolder size={20}/> },
    { label: 'All Notes', to: '/dashboard/all', icon: <FiList   size={20}/> },
  ]

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar items={items} />
      <main className="flex-1 thin-scrollbar overflow-y-auto bg-slate-100 dark:bg-gray-900 min-h-[calc(100vh-4rem)] p-6 pt-4">
        <Outlet />
      </main>
    </div>
  )
}
