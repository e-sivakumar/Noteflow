import { useNavigate, useParams } from 'react-router-dom'
import { FiFilePlus, FiFileText } from 'react-icons/fi'
import CardDesign from '../components/CardDesign'
import Modal from '../components/Modal';
import { useModal } from '../hooks/useModal';
import { useEffect, useRef, useState } from 'react';
import RichTextEditor from '../components/RichTextEditor';
import CustomDropdown, {type DropdownOption} from '../components/CustomDropDown';
import type { FilterOption } from '../components/FilterBar';
import { useArchiveNote, useCreateNote, useDeleteNote, useNotes, usePinNote, useSearchNotes, useUnarchiveNote, useUnPinNote, useUpdateNote } from '../hooks/useNotes';
import { getNotes, type Note } from '../api/notes';
import SearchDropdown from '../components/SearchBox';
import FilterBar from '../components/FilterBar';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '../components/ToastProvider';
import axios from 'axios';

export default function NotesInFolder() {
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId: string }>() || '';
  const queryClient = useQueryClient();

   const sortOptions: DropdownOption[] = [
      { label: 'Name (A–Z)',    value: 'atoz'  },
      { label: 'Name (Z–A)',    value: 'ztoa' },
      { label: 'Date (Newest)', value: 'newtoold' }, // default
      { label: 'Date (Oldest)', value: 'oldtonew'  },
    ]
    const [sort, setSort] = useState<DropdownOption>(sortOptions[2])
  const filterOptions: FilterOption[] = [
      { label: 'All', value: '' },
      {label: 'Archived', value: 'archived'},
      {label: 'Unarchived', value: 'active'}
    ]
    const [filter, setFilter] = useState<FilterOption>(filterOptions[0])
    
    
      const [query, setQuery] = useState('');
      // 3) Search state & suggestions
      const { data: searchResults = [] } = useSearchNotes(folderId as string, query)
      
  const limit = 4

  const {
      data,
      isLoading,
      isError,
      isFetchingNextPage,
      fetchNextPage,
      hasNextPage,
    } = useNotes(folderId as string,filter.value, sort.value, limit)
  
  const notes = data?.pages.flatMap(p => p.notes) ?? []

  const loadMoreRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (!loadMoreRef.current || !hasNextPage) return
      const obs = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && fetchNextPage(),
        { rootMargin: '200px' }
      )
      obs.observe(loadMoreRef.current)
      return () => obs.disconnect()
    }, [fetchNextPage, hasNextPage])

      const { addToast } = useToast();


  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const archiveNote = useArchiveNote();
  const unarchiveNote = useUnarchiveNote();
  const pinNote = usePinNote();
  const unPinNote = useUnPinNote();
  const deleteNote = useDeleteNote();


  const { isOpen, open, close } = useModal()
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<{
    id?: string
    name: string
    content: string
  }>({ name: '', content: '<p></p>' })
  const [errorName, setErrorName] = useState(false);

    const openEdit = async(note: Note) => {
      console.log("het")
      setErrorName(false)
      // setEditing({ id: f.noteId, name: f.name, content: f.content || '<p></p>' })
      // const {data} = await useGetNote(note.noteId)
      const data = await queryClient.fetchQuery({
    queryKey: ['getNotes', note.noteId],
    queryFn: () => getNotes(note.noteId),
  })
      if(data){
        setEditing({
          id: data.noteId,
          name: data.name,
          content: data.content || '<p></p>',
        })
        open()
      }
    }
    const validateFolderForm = ()=>{
      if(!editing.name || !editing.content) return false
      return true
    }
    const handleSave = async() => {
      if(!validateFolderForm()) {
        setErrorName(true); 
        return
      }
      try{
      if (editing.id) {
        await updateNote.mutateAsync({ id: editing.id, data: { name: editing.name, content: editing.content } })
        addToast('success', `Note ${editing.name} has been updated successfully.`);
      } else {
        setErrorName(false)
        await createNote.mutateAsync({folderId: folderId as string , data: { name: editing.name, content: editing.content}})
        addToast('success', `Note ${editing.name} has been created successfully.`);
      }
    }
    catch(err: unknown){
      if(axios.isAxiosError(err) && err.response?.data?.message){
        addToast('error', err.response.data.message);
      }
      else{
        addToast('error', `Note ${editing.id ? 'updation' : 'creatoin'} failed, try again later `);
      }
    }
      setEditing({
        name: '',
        content:'<p></p>',
      })
      close()
    }

    const handlePinNote = async (id: string) => {
      try {
        await pinNote.mutateAsync({ id });
        addToast('success', 'Note pinned successfully.');
      } catch (err: unknown) {
        addToast('error', 'Couldn’t pin the note. Please try again.');
      }
    };
    
    const handleUnPinNote = async (id: string) => {
      try {
        await unPinNote.mutateAsync({ id });
        addToast('success', 'Note un-pinned successfully.');
      } catch (err: unknown) {
        addToast('error', 'Couldn’t un-pin the note. Please try again.');
      }
    };

    const handleArchiveNote = async (id: string) => {
      try {
        await archiveNote.mutateAsync({ id });
        addToast('success', 'Note archived.', 'Archived');
      } catch (err: unknown) {
        addToast('error', 'Couldn’t archive the note.');
      }
    };

    const handleUnarchiveNote = async (id: string) => {
      try {
        await unarchiveNote.mutateAsync({ id });
        addToast('success', 'Note restored from archive.');
      } catch (err: unknown) {
        addToast('error', 'Couldn’t restore the note');
      }
    };

    const handleDelete = (id: string) => {
      setConfirmDeleteId(id); // show confirmation modal
    };
    

  return (
    <div>
      {/* <h2 className="text-2xl text-black dark:text-gray-100 font-semibold mb-4">Notes in Folder {folderId}</h2> */}
      <div className='flex flex-row justify-between items-center  mb-4 '>
                    <h2 className="text-xl sm:text-2xl text-black dark:text-gray-100 font-semibold p-[0.5rem]">{folderId}</h2>
                     <div className="flex flex-wrap-reverse justify-items-end items-center gap-4">
                              <CustomDropdown
                                label="Sort"
                                options={sortOptions}
                                selected={sort}
                                onSelect={setSort}
                              />
                    <div 
                      className='cursor-pointer text-gray-700 dark:text-gray-200 bg-slate-300 dark:bg-gray-700 p-[0.5rem] transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg rounded-lg hover:bg-blue-500 dark:hover:bg-blue-600'
                      onClick={()=>open()}
                      >
                        <FiFilePlus size={26}/>
                    </div>
                    </div>
                    </div>

       <Modal isOpen={isOpen} 
       onClose={()=>{
        setEditing({
          name: '',
          content: '<p></p>',
        })
        close()
      }} 
       title={editing.id ? 'Edit Note' : 'Create Note'}>
                <div className="space-y-4">
                  <input
                    type="text"
                    className={`input-base ${errorName ? 'border-red-600' : ''}`}
                    placeholder="Note name"
                    value={editing.name}
                    onChange={(e) => setEditing(ps => ({ ...ps, name: e.target.value }))}
                  />
                  <RichTextEditor
                    content={editing.content}
                    onUpdate={e => setEditing(ps => ({ ...ps, content: e }))}
                    className="border rounded"
                  />
                  <div className="flex justify-end gap-2">
                    <button 
                      // disabled={blockButton}
                disabled={createNote.isPending || updateNote.isPending}

                      onClick={()=>{
                        setEditing({
                          name: '',
                          content: '<p></p>',
                        })
                        close()
                      }} 
                      className={`btn-secondary cancel-btn ${(createNote.isPending || updateNote.isPending) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        Cancel
                    </button>
                    <button  
                    onClick={handleSave}
                    disabled={createNote.isPending || createNote.isPending}
                    className= {`btn-primary submit-btn ${(createNote.isPending || updateNote.isPending) ? 'opacity-50 cursor-not-allowed' : ''}`} >
                      {(createNote.isPending || updateNote.isPending)
                ? 'Saving…'
                : 'Save'}
                      </button>
                  </div>
                </div>
              </Modal>

              <Modal
                isOpen={!!confirmDeleteId}
                onClose={() => setConfirmDeleteId(null)}
                title="Delete Note"
              >
                <div className="space-y-4">
                  <p className="text-gray-800 dark:text-gray-200">
                    Are you sure you want to delete this note? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      className="btn-secondary cancel-btn"
                      onClick={() => setConfirmDeleteId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn-danger"
                      onClick={async () => {
                        if (confirmDeleteId) {
                          await deleteNote.mutateAsync(confirmDeleteId);
                          setConfirmDeleteId(null);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Modal>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                      {/* 1) Search on left */}
                      <SearchDropdown
                        // options={searchOpts}
                        options={searchResults}
                        onSearch={(q: string)=>setQuery(q)}
                        placeholder="Search notes..."
                        // onSelect={opt => navigate(`/folder/${opt.value}`)}
                        onSelect={opt => console.log("clicked", opt)}
                      />
                      </div>

<div className='my-5'>
            <FilterBar
          options={filterOptions}
          selected={filter}
          onSelect={setFilter}
          />
        </div>



      {
        isLoading 
        ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
            ))}
          </div>
        ) 
        : isError 
        ? (
          <div className="text-gray-900 dark:text-white">No notes available</div>
        ) 
        : (
          <>
          <div className={`${notes.length > 0 ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : ''} `}>
        {
          notes.length > 0 ?
        notes.map(note => (
          <CardDesign 
          key={note.noteId}
          id={note.noteId}
          title={note.name}
          updatedAt= {note.updatedAt}
          icon={<FiFileText size={24} className="text-green-500 mr-2" />}
          // description={note.snippet}
          onEdit={() => openEdit(note)}
          onDelete={() => handleDelete(note.noteId)}
          onClick={()=>{navigate(`/folder/${folderId}/note/${note.noteId}`)}}
          isNotes= {true}
          isPinned={note.isPinned}
          onPin={
            note.isPinned ? handleUnPinNote : handlePinNote
          }
          isArchived={note.isArchived}
          onArchive={
            note.isArchived ? handleUnarchiveNote : handleArchiveNote
          }
          />
        ))
        :
        (
          // <div className="col-span-full text-center text-gray-500">
          //   No Notes found.
          // </div>
          <div className='flex flex-col gap-3 items-center justify-center min-h-48'>
          <div 
                      className='cursor-pointer text-gray-700 dark:text-gray-200  p-[0.5rem] transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg rounded-lg '
                      onClick={()=>open()}
                      >
                        <FiFilePlus size={100}/>
                    </div>
                    <p className='text-black dark:text-white font-semibold text-lg'>Add Note</p>
                    </div>
        )
      }
        {/* {notes.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">No notes in this folder.</p>
        )} */}
              </div>

      
      <div ref={loadMoreRef} className="h-1" />

{isFetchingNextPage && (
  <div className="text-center py-4 text-gray-500">
    Loading more…
  </div>
)}

{(!hasNextPage && notes.length > 0) && (
  <div className="text-center py-4 text-gray-500">
    You’ve reached the end.
  </div>
)}
          </>
        )
      }
      
    </div>
  )
}
