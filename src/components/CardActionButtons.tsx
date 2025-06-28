import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaThumbtack } from 'react-icons/fa';
import { MdArchive } from 'react-icons/md';

export interface CardActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onPin ?: (id: string)=>void;
  onArchive ?: (id: string)=>void;
  isNotes ?: boolean;
  isPinned ?: boolean;
  isArchived ?: boolean;
  id : string;
}

export function CardActionButtons ({onEdit = ()=>{}, onPin = ()=>{}, onArchive =()=>{}, onDelete = ()=>{}, isNotes, isPinned, id, isArchived}: CardActionButtonsProps) {
    return (
        <div className="relative xs:absolute top-2 right-2 flex space-x-2 transition-opacity">
          {/* -------------for opacity add:------------------- */}
          {/* opacity-100 sm:opacity-0 sm:group-hover:opacity-100  */}
          {isNotes 
          &&
          (
            <>
          <button title={`${isPinned  ? 'Unpin' :  'Pin'}`} onClick={e => { e.stopPropagation(); onPin(id)}} className="p-1.5 sm:p-2 xl:p-1 hover:border-none border-none hover:scale-125 bg-white dark:bg-gray-700 focus:outline-none focus:ring-0 ">
          <FaThumbtack size={18} className={`${isPinned ? ' text-blue-600 dark:text-blue-500' : ' text-gray-400 dark:text-gray-500'}`}/>
        </button>
        <button title={`${isArchived  ? 'Unarchive' :  'Archive'}`} onClick={e => { e.stopPropagation(); onArchive(id) }} className="p-1.5 sm:p-2 hover:border-none border-none hover:scale-125 bg-white dark:bg-gray-700 focus:outline-none focus:ring-0">
            <MdArchive size={20} className={`${isArchived ? ' text-blue-600 dark:text-blue-500' : ' text-gray-400 dark:text-gray-500'}`}/>
          </button>
        </>
          )
           }
            <button title="Edit" onClick={e => { e.stopPropagation(); onEdit()}} className="p-1.5 sm:p-2 xl:p-1 hover:border-none border-none hover:scale-125 bg-white dark:bg-gray-700 focus:outline-none focus:ring-0">
            {/* // bg-gray-500 dark:bg-gray-600 rounded-full hover:bg-blue-600 dark:hover:bg-blue-600"> */}
              <FiEdit2 size={16} className={` hover:text-blue-600 hover:dark:text-blue-500 text-gray-400 dark:text-gray-500`}/>
            </button>
          <button title="Delete" onClick={e => { e.stopPropagation(); onDelete()}} className="p-1.5 sm:p-2 hover:border-none border-none hover:scale-125 bg-white dark:bg-gray-700 focus:outline-none focus:ring-0">
          {/* bg-gray-500 dark:bg-gray-600 rounded-full hover:bg-red-500 dark:hover:bg-red-500"> */}
            <FiTrash2 size={16} className={` hover:text-red-500 hover:dark:text-red-500 text-gray-400 dark:text-gray-500`} />
          </button>
        </div>
    )
}