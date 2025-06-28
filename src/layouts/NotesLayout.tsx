import { Outlet } from 'react-router-dom'
import Sidebar, { type SidebarItem } from '../components/Sidebar'
import { FiFolder } from 'react-icons/fi'
import { useFolderList } from '../hooks/useFolders'


export default function NotesLayout() {
  const {
      data
    } = useFolderList();
  
  const items: SidebarItem[] = data ? data.map(f => ({
    label: f.name,
    to:    `/folder/${f.folderId}`,
    icon:  <FiFolder size={20}/>
  })) : []

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar items={items} />
      <main className="flex-1 overflow-y-auto thin-scrollbar bg-slate-100 dark:bg-gray-900 min-h-[calc(100vh-4rem)] p-6 pt-4">
        <Outlet />
      </main>
    </div>
  )
}
