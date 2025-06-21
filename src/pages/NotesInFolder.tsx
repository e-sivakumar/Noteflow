import { useParams } from 'react-router-dom'
import { FiFilePlus, FiFileText } from 'react-icons/fi'
import CardDesign from '../components/CardDesign'
import Modal from '../components/Modal';
import { useModal } from '../hooks/useModal';
import { useState } from 'react';

const dummyNotes = [
  { id: 'a1', folderId: '1', title: 'Alpha Plan',   snippet: 'Outline the phases...', createdAt: '2025-04-11' },
  { id: 'a2', folderId: '1', title: 'Alpha Budget', snippet: 'Cost analysis...',       createdAt: '2025-04-12' },
  { id: 'b1', folderId: '2', title: 'Groceries',    snippet: 'Buy fruits and veggies',createdAt: '2025-04-13' },
]

export default function NotesInFolder() {
  const { folderId } = useParams<{ folderId: string }>()
  const notes = dummyNotes.filter(n => n.folderId === folderId)

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

  return (
    <div>
      {/* <h2 className="text-2xl text-black dark:text-gray-100 font-semibold mb-4">Notes in Folder {folderId}</h2> */}
      <div className='flex flex-row justify-between items-center  mb-4 '>
                    <h2 className="text-2xl text-black dark:text-gray-100 font-semibold p-[0.5rem]">Notes in Folder {folderId}</h2>
                    <div 
                      className='cursor-pointer text-gray-700 dark:text-gray-200 bg-slate-300 dark:bg-gray-700 p-[0.5rem] transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg rounded-lg hover:bg-blue-500 dark:hover:bg-blue-600'
                      onClick={()=>open()}
                      >
                        <FiFilePlus size={26}/>
                    </div>
                    </div>

       <Modal isOpen={isOpen} onClose={close} title="Create Folder">
                <div className="space-y-4">
                  <input
                    type="text"
                    className='input-base'
                    placeholder="Folder name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                  {/* Add category list options in input focused */}
                  <input 
                    type="text"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => (
          // <div
          //   key={note.id}
          //   className="relative group p-4 bg-white dark:bg-gray-700 rounded-lg shadow 
          //              transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
          // >
          //   <div className="flex items-center mb-2">
          //     <FiFileText size={24} className="text-green-500 mr-2" />
          //     <h3 className="text-lg font-medium">{note.title}</h3>
          //   </div>
          //   <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">{note.snippet}</p>
          //   <p className="text-xs text-gray-400 dark:text-gray-500">Created on {note.createdAt}</p>

          //   <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          //     <button className="p-1 bg-white dark:bg-gray-600 rounded-full hover:bg-blue-100">
          //       <FiEdit2 size={16} />
          //     </button>
          //     <button className="p-1 bg-white dark:bg-gray-600 rounded-full hover:bg-red-100">
          //       <FiTrash2 size={16} />
          //     </button>
          //   </div>
          // </div>
          <CardDesign 
          key={note.id}
          id={note.id}
          title={note.title}
          createdAt= {note.createdAt}
          icon={<FiFileText size={24} className="text-green-500 mr-2" />}
          description={note.snippet}
          onEdit={() => {console.log("file edited")}}
          onDelete={() => {console.log("file deleted")}}
          onClick={()=>{}}
          />
        ))}
        {notes.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">No notes in this folder.</p>
        )}
      </div>
    </div>
  )
}
