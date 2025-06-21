import { FiEdit2, FiTrash2 } from "react-icons/fi";

export interface CardActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CardActionButtons ({onEdit = ()=>{}, onDelete = ()=>{}}: CardActionButtonsProps) {
    return (
        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={e => { e.stopPropagation(); onEdit()}} className="p-1.5 bg-gray-500 dark:bg-gray-600 rounded-full hover:bg-blue-600 dark:hover:bg-blue-600">
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={e => { e.stopPropagation(); onDelete()}} className="p-1.5 bg-gray-500 dark:bg-gray-600 rounded-full hover:bg-red-500 dark:hover:bg-red-500">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
    )
}