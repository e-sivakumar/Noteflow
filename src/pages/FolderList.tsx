import { FiFolder, FiFolderPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import CardDesign from '../components/CardDesign';
import CustomDropdown, {type DropdownOption} from '../components/CustomDropDown';
import { useState } from 'react';
import FilterBar, { type FilterOption } from '../components/FilterBar';
import SearchDropdown, { type SearchOption } from '../components/SearchBox';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Modal';

const dummyFolders = [
  { id: '1', name: 'Project Alpha', createdAt: '2025-01-01' },
  { id: '2', name: 'Personal',      createdAt: '2025-02-15' },
  { id: '3', name: 'Work',          createdAt: '2025-03-10' },
  { id: '4', name: 'Project Alpha', createdAt: '2025-01-01' },
  { id: '5', name: 'Personal',      createdAt: '2025-02-15' },
  { id: '6', name: 'Work',          createdAt: '2025-03-10' }
];

const sortOptions: DropdownOption[] = [
  { label: 'Name (A–Z)', value: 'name-asc' },
  { label: 'Name (Z–A)', value: 'name-desc' },
  { label: 'Date (Newest)', value: 'date-desc' },
  { label: 'Date (Oldest)', value: 'date-asc' },
]

const filterOpts: DropdownOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Project Alpha', value: '1' },
  { label: 'Personal', value: '2' },
  { label: 'Work', value: '3' },
  { label: 'All Folders', value: 'All' },
  { label: 'Project Alpha', value: '1' },
  { label: 'Personal', value: '2' },
  { label: 'Work', value: '3' },
]

const searchOpts: SearchOption[] = dummyFolders.map(f => ({
  label: f.name,
  value: f.id,
}))

export default function FolderList() {
  const navigate = useNavigate();

  const { isOpen, open, close } = useModal()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('');
  const [blockButton, setBlockButton] = useState(false);

  const newPromise = async()=>{
    return new Promise((resolve)=>{
      setTimeout(()=>{resolve("done")}, 3000)
    })
  }

  const save = async() => {
    console.log('save folder:', name)
    await newPromise().then(()=>{alert("saved success")}).catch((err)=>{alert(`eroro ${err}`)})
    close()
  }

  const [selectedSort, setSelectedSort] = useState<DropdownOption>(sortOptions[0])
  // const [selectedFilter, setSelectedFilter] = useState<DropdownOption>(filterOptions[0])
  const [filter, setFilter] = useState<FilterOption>(filterOpts[0])

  const handleSearchSelect = (opt: SearchOption) => {
    console.log('search selected', opt);
    navigate(`/folder/${opt.value}`);
  };

  return (
    <div>
      <div className='flex flex-row justify-between items-center  mb-4 '>
        <h2 className="text-lg md:text-2xl text-black dark:text-gray-100 font-semibold p-[0.5rem]">Folders</h2>
        <div className="flex flex-wrap items-center gap-4">
          <CustomDropdown
            label="Sort"
            options={sortOptions}
            selected={selectedSort}
            onSelect={setSelectedSort}
          />

          {/* <CustomDropdown
            label="Filter"
            options={filterOptions}
            selected={selectedFilter}
            onSelect={setSelectedFilter}
            isFilter={true}
          /> */}

          <div
            onClick={open}
            className="cursor-pointer text-gray-700 dark:text-gray-200 
                       bg-slate-300 dark:bg-gray-700 p-2 rounded-lg 
                       transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:bg-blue-500 dark:hover:bg-blue-600"
          >
            <FiFolderPlus size={26} />
          </div>
           
        </div>
        </div>

        <Modal isOpen={isOpen} onClose={close} title="Create Folder">
          <div className="space-y-4">
            <input
              type="text"
              // className="w-full border rounded px-3 py-2 bg-slate-200 dark:bg-slate-700 text-black dark:text-gray-200"
              className='input-base'
              placeholder="Folder name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            {/* Add category list options in input focused */}
            <input 
              type="text"
              // className="w-full border rounded px-3 py-2 bg-slate-200 dark:bg-slate-700 text-black dark:text-gray-200"
              className='input-base'
              placeholder="Category name"
              value={category}
              onChange={e => setCategory(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button 
                disabled={blockButton}
                onClick={close} 
                className={`btn-secondary bg-slate-100 dark:bg-slate-800 text-gray-800 dark:text-gray-100 ${blockButton ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  Cancel
              </button>
              <button 
              onClick={
                async()=>{
                  setBlockButton(true)
                  await save()
                  setBlockButton(false)
                  close()
                }
              }   
              disabled={blockButton}
              className= {`btn-primary bg-blue-400 hover:bg-blue-600 text-gray-800 dark:text-gray-100 ${blockButton ? 'opacity-50 cursor-not-allowed' : ''}`} >
                {blockButton ? 'Saving...' : 'Save'}
                </button>
            </div>
          </div>
        </Modal>

        <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* 1) Search on left */}
        <SearchDropdown
          options={searchOpts}
          placeholder="Search folders..."
          onSelect={handleSearchSelect}
        />
        </div>

        <div className='my-5'>
            <FilterBar
          options={filterOpts}
          selected={filter}
          onSelect={setFilter}
          />
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyFolders.map(f => (
          <CardDesign
            key={f.id}
            id={f.id}
            icon={<FiFolder size={24} className="text-blue-500 mr-2" />}
            title={f.name}
            createdAt={f.createdAt}
            onClick={() => navigate(`/folder/${f.id}`)}
            onEdit={() => {console.log("folder edited")}}
            onDelete={() => {console.log("folder deleted")}}
          />
        ))}
      </div>
    </div>
  );
}
