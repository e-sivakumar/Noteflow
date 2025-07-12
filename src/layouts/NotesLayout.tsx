import { Outlet, useParams } from 'react-router-dom'
import Sidebar, { type SidebarItem } from '../components/Sidebar'
import { FiFile, FiFolder } from 'react-icons/fi'
import { useFolderList } from '../hooks/useFolders'
import { useNoteList } from '../hooks/useNotes';


export default function NotesLayout() {
  const {folderId, noteId} = useParams<{folderId:string, noteId?: string}>();

  let items: SidebarItem[] ; 
  const { data: folders = [] } = useFolderList({
    enabled: !noteId, 
  });
  const { data: notes = [] } = useNoteList(folderId ?? '', {
    enabled: Boolean(folderId && noteId),
  });
  console.log("fol", folderId)

  if(noteId && folderId){
    items = (notes && notes?.length > 0) ?  notes.map(f => ({
      label: f.name,
      to:    `/folder/${f.folderId}/note/${f.noteId}`,
      icon:  <FiFile size={20}/>
    })) : []
  }
  else{
    items = (folders && folders?.length > 0) ?  folders.map(f => ({
      label: f.name,
      to:    `/folder/${f.folderId}`,
      icon:  <FiFolder size={20}/>
    })) : []
  }
 

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar items={items} />
      <main className="flex-1 overflow-y-auto thin-scrollbar bg-slate-100 dark:bg-gray-900 min-h-[calc(100vh-4rem)] p-6 pt-4">
        <Outlet />
      </main>
    </div>
  )
}
