import { useNavigate } from 'react-router-dom'
import { FiFileText } from 'react-icons/fi'
import CardDesign from '../components/CardDesign'
import Modal from '../components/Modal';
import { useModal } from '../hooks/useModal';
import { useEffect, useRef, useState } from 'react';
import RichTextEditor from '../components/RichTextEditor';
import CustomDropdown, {type DropdownOption} from '../components/CustomDropDown';
import type { FilterOption } from '../components/FilterBar';
import { useArchiveNote, useCreateNote, useDeleteNote, useAllNotes, usePinNote, useSearchAllNotes, useUnarchiveNote, useUnPinNote, useUpdateNote } from '../hooks/useNotes';
import { getNotes, type Note } from '../api/notes';
import SearchDropdown from '../components/SearchBox';
import FilterBar from '../components/FilterBar';
import { useQueryClient } from '@tanstack/react-query';

export default function AllNotesList() {

  const queryClient = useQueryClient();

  const navigate = useNavigate();

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
      const { data: searchResults = [] } = useSearchAllNotes(query)
      
  const limit = 4

  const {
      data,
      isLoading,
      isError,
      isFetchingNextPage,
      fetchNextPage,
      hasNextPage,
    } = useAllNotes(filter.value, sort.value, limit)
  
  const notes = data?.pages.flatMap(p => p.notes) ?? []

  const loadMoreRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (!loadMoreRef.current || !hasNextPage) return
      const obs = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && fetchNextPage(),
        { rootMargin: '20px' }
        // it has 200px
      )
      obs.observe(loadMoreRef.current)
      return () => obs.disconnect()
    }, [fetchNextPage, hasNextPage])


  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const archiveNote = useArchiveNote();
  const unarchiveNote = useUnarchiveNote();
  const pinNote = usePinNote();
  const unPinNote = useUnPinNote();
  const deleteNote = useDeleteNote();
  // const getNote = useGetNote();


  const { isOpen, open, close } = useModal()

  const [editing, setEditing] = useState<{
    id?: string
    name: string
    content: string
  }>({ name: '', content: '<p></p>' })
  const [errorName, setErrorName] = useState(false);

    const openEdit = async(note: Note) => {
      setErrorName(false)
      // setEditing({ id: f.noteId, name: f.name, content: f.content || '<p></p>' })
      // const data = await getNote.mutateAsync({id: note.noteId} )
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
    const handleSave = () => {
      if (editing.id) {
        if(!validateFolderForm()) {
          setErrorName(true); 
          return
        }
        setErrorName(false); 
        updateNote.mutate({ id: editing.id, data: { name: editing.name, content: editing.content } })
      } else {
        alert("You should not create note here")
      }
      setEditing({
        name: '',
        content:'<p></p>',
      })
      close()
    }
    const handlePinNote = async(id: string)=>{
      await pinNote.mutateAsync({id})
    }
    const handleUnPinNote = async(id: string)=>{
      await unPinNote.mutateAsync({id})
    }
    const handleArchiveNote = async(id: string)=>{
      await archiveNote.mutateAsync({id})
    }
    const handleUnarchiveNote = async(id: string)=>{
      await unarchiveNote.mutateAsync({id})
    }
    const handleDelete = (id: string) => {
      deleteNote.mutate(id)
    } 

  return (
    <div>
      <div className='flex flex-row justify-between items-center  mb-4 '>
                    <h2 className="text-xl sm:text-2xl text-black dark:text-gray-100 font-semibold p-[0.5rem]">All Notes</h2>
                     <div className="flex flex-wrap-reverse justify-items-end items-center gap-4">
                              <CustomDropdown
                                label="Sort"
                                options={sortOptions}
                                selected={sort}
                                onSelect={setSort}
                              />
                    {/* <div 
                      className='cursor-pointer text-gray-700 dark:text-gray-200 bg-slate-300 dark:bg-gray-700 p-[0.5rem] transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg rounded-lg hover:bg-blue-500 dark:hover:bg-blue-600'
                      onClick={()=>open()}
                      >
                        <FiFilePlus size={26}/>
                    </div> */}
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
       title={'Edit Note' }>
                <div className="space-y-4">
                  <input
                    type="text"
                    className={`input-base ${errorName ? 'border-red-600' : ''}`}
                    placeholder="Note name"
                    value={editing.name}
                    onChange={(e) => setEditing(ps => ({ ...ps, name: e.target.value }))}
                  />
                  {/* Add category list options in input focused */}
                  {/* <input 
                    type="text"
                    className='input-base'
                    placeholder="Enter your contents here...."
                    value={editing.content}
                    onChange={e => setEditing(ps => ({ ...ps, category: e.target.value }))}
                  /> */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          onClick={()=>{navigate(`/folder/${note.folderId}/note/${note.noteId}`)}}
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
        )) :
        (
          <div className="col-span-full text-center text-gray-500">
            No Notes found.
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
