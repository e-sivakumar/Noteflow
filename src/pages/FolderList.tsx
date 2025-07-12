import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFolder, FiFolderPlus } from 'react-icons/fi';
import CardDesign from '../components/CardDesign';
import CustomDropdown, {type DropdownOption} from '../components/CustomDropDown';
import FilterBar, { type FilterOption } from '../components/FilterBar';
import SearchDropdown from '../components/SearchBox';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Modal';
import { useToast } from '../components/ToastProvider';

import {
  useFolders,
  useFolderFilters,
  useSearchFolders,
  useCreateFolder,
  useUpdateFolder,
  useDeleteFolder,
} from '../hooks/useFolders';
import type { Folder } from '../api/folders';

export default function FolderList() {
  const navigate = useNavigate();
  const { addToast } = useToast();

   // 1) Sort options (fixed)
   const sortOptions: DropdownOption[] = [
    { label: 'Name (A–Z)',    value: 'atoz'  },
    { label: 'Name (Z–A)',    value: 'ztoa' },
    { label: 'Date (Newest)', value: 'newtoold' }, // default
    { label: 'Date (Oldest)', value: 'oldtonew'  },
  ]
  const [sort, setSort] = useState<DropdownOption>(sortOptions[2])

  // 2) Fetch filter options, always include “All”
  const { data: apiFilters = [] } = useFolderFilters()
  const filterOptions: FilterOption[] = [
    { label: 'All', value: '' },
    // ...apiFilters,
    ...apiFilters.map((filterName: string) => ({
      label: filterName,
      value: filterName,
    })),
  ]
  const [filter, setFilter] = useState<FilterOption>(filterOptions[0])
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  const [query, setQuery] = useState('');
  // 3) Search state & suggestions
  const { data: searchResults = [] } = useSearchFolders(query)

  const limit = 4

  // 4) Folder list query
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useFolders(filter.value, sort.value, limit)

  
  const folders = data?.pages.flatMap(p => p.folders) ?? []

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

  // 5) Mutations
  const createFolder = useCreateFolder()
  const updateFolder = useUpdateFolder()
  const deleteFolder = useDeleteFolder()

  const { isOpen, open, close } = useModal()
  // const [name, setName] = useState('')

  const [editing, setEditing] = useState<{
    id?: string
    name: string
    category: string
  }>({ name: '', category: '' })
  const [errorName, setErrorName] = useState(false);

  // Handlers
  const openModal = () => {
    setErrorName(false)
    setEditing({ name: '', category: '' })
    open()
  }
  const openEdit = (f: Folder) => {
    setErrorName(false)
    setEditing({ id: f.folderId, name: f.name, category: f.category || '' })
    open()
  }
  const validateFolderForm = ()=>{
    if(!editing.name) return false
    return true
  }
  // const handleSave = () => {
  //   if (editing.id) {
  //     updateFolder.mutate({ id: editing.id, data: { name: editing.name, category: editing.category } })
  //   } else {
  //     if(!validateFolderForm()) {
  //       setErrorName(true); 
  //       return
  //     }
  //     else{
  //       setErrorName(false)
  //       createFolder.mutate({ name: editing.name, category: editing.category })
  //     }
  //   }
  //   close()
  // }
  const handleSave = async () => {
    if (!validateFolderForm()) {
      setErrorName(true);
      return;
    }
    try {
      if (editing.id) {
        await updateFolder.mutateAsync({
          id: editing.id,
          data: { name: editing.name, category: editing.category }
        });
        addToast('success',`Folder "${editing.name}" updated successfully.`);
      } else {
        await createFolder.mutateAsync({
          name: editing.name,
          category: editing.category
        });
        addToast('success', `Folder "${editing.name}" created successfully.`);
      }
      close();
    } catch {
      addToast('error', `Folder ${editing.id ? 'updation' : 'creation'} failed. Please try again.`);
    }
  };
  // const handleDelete = (id: string) => {
  //   deleteFolder.mutate(id)
  // }
  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteFolder.mutateAsync(confirmDeleteId);
      addToast('success', 'Folder deleted successfully.');
      setConfirmDeleteId(null);
    } catch {
      addToast('error', 'Failed to delete folder.');
    }
  };

  return (
    <div>
      <div className='flex flex-row justify-between items-center  mb-4 '>
        <h2 className="text-lg md:text-2xl text-black dark:text-gray-100 font-semibold p-[0.5rem]">Folders</h2>
        <div className="flex flex-wrap items-center gap-4">
          <CustomDropdown
            label="Sort"
            options={sortOptions}
            selected={sort}
            onSelect={setSort}
          />

          <div
            onClick={openModal}
            className="cursor-pointer text-gray-700 dark:text-gray-200 
                       bg-slate-300 dark:bg-gray-700 p-2 rounded-lg 
                       transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:bg-blue-500 dark:hover:bg-blue-600"
          >
            <FiFolderPlus size={26} />
          </div>
           
        </div>
        </div>

        <Modal isOpen={isOpen} onClose={close} title={editing.id ? 'Edit Folder' : 'Create Folder'}>
          <div className="space-y-4">
            {/* <label className='text-sm'>Folder Name:</label> */}
            <input
              type="text"
              // className="w-full border rounded px-3 py-2 bg-slate-200 dark:bg-slate-700 text-black dark:text-gray-200"
              className={`input-base ${errorName ? 'border-red-600' : ''}`}
              placeholder="Folder name"
              // value={name}
              value={editing.name}
              // onChange={e => setName(e.target.value)}
              onChange={(e) => setEditing(ps => ({ ...ps, name: e.target.value }))}
            />
            {/* Add category list options in input focused */}
            <input 
              type="text"
              // className="w-full border rounded px-3 py-2 bg-slate-200 dark:bg-slate-700 text-black dark:text-gray-200"
              className='input-base'
              placeholder="Category name"
              // value={category}
              value={editing.category}
              // onChange={e => setCategory(e.target.value)}
              onChange={e => setEditing(ps => ({ ...ps, category: e.target.value }))}
            />
            <div className="flex justify-end gap-2">
              <button 
                // disabled={blockButton}
                disabled={createFolder.isPending || updateFolder.isPending}
                onClick={close} 
                className={`btn-secondary cancel-btn ${(createFolder.isPending || updateFolder.isPending) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  Cancel
              </button>
              <button 
              onClick={handleSave}
              disabled={createFolder.isPending || updateFolder.isPending}
              className= {`btn-primary submit-btn ${(createFolder.isPending || updateFolder.isPending) ? 'opacity-50 cursor-not-allowed' : ''}`} >
                {(createFolder.isPending || updateFolder.isPending)
                ? 'Saving…'
                : 'Save'}
                </button>
            </div>
          </div>
        </Modal>
        <Modal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Delete Folder"
      >
        <div className="space-y-4">
          <p className="text-gray-800 dark:text-gray-200">
            Are you sure you want to delete this folder? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="btn-secondary"
              onClick={() => setConfirmDeleteId(null)}
            >
              Cancel
            </button>
            <button
              className="btn-danger"
              onClick={confirmDelete}
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
          placeholder="Search folders..."
          // onSelect={handleSearchSelect}
          // onSearch={setSearchTerm}
          onSelect={opt => navigate(`/folder/${opt.value}`)}
        />
        </div>

        <div className='my-5'>
            <FilterBar
          options={filterOptions}
          selected={filter}
          onSelect={setFilter}
          />
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-red-600">Failed to load folders.</div>
        ) : (
          <>
            {/*
              2) The actual grid of all pages (flattened)
            */}
            <div className={`${folders.length > 0 ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : ''} `}>
              {folders.length > 0
                ? folders.map((f) => (
                    <CardDesign
                      key={f.folderId}
                      id={f.folderId}
                      category={f?.category || ''}
                      icon={<FiFolder size={24} className="text-blue-500 mr-2" />}
                      title={f.name}
                      updatedAt={f.updatedAt}
                      onClick={() => navigate(`/folder/${f.folderId}`)}
                      onEdit={() => openEdit(f)}
                      // onDelete={() => handleDelete(f.folderId)}
                      onDelete={() => setConfirmDeleteId(f.folderId)}
                    />
                  ))
                : (
                  // <div className="col-span-full text-center text-gray-500">
                  //   No folders found.
                  // </div>
                  <div className='flex flex-col gap-3 items-center justify-center min-h-48'>
                            <div 
                                        className='cursor-pointer text-gray-700 dark:text-gray-200  p-[0.5rem] transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg rounded-lg '
                                        onClick={()=>open()}
                                        >
                                          <FiFolderPlus size={100}/>
                                      </div>
                                      <p className='text-black dark:text-white font-semibold text-lg'>Add Folder</p>
                                      </div>
                )}
            </div>

            <div ref={loadMoreRef} className="h-1" />

            {isFetchingNextPage && (
              <div className="text-center py-4 text-gray-500">
                Loading more…
              </div>
            )}

            {(!hasNextPage && folders.length > 0) && (
              <div className="text-center py-4 text-gray-500">
                You’ve reached the end.
              </div>
            )}
          </>
        )}
    </div>
  );
}
