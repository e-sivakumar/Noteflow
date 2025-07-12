import React from 'react';
import { CardActionButtons } from './CardActionButtons';
// import {FiShare2} from 'react-icons/fi'

export interface CardDesignProps {
  id: string;
  title: string;
  description?: string;
  category ?: string;
  updatedAt: string;
  icon: React.ReactNode;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive ?: (id: string)=>void;
  onPin ?: (id: string)=>void;
  className?: string;
  isNotes ?: boolean;
  isPinned ?: boolean;
  isArchived ?: boolean;
}

export default function CardDesign({
  id,
  title,
  description,
  category,
  updatedAt,
  icon,
  onClick,
  onEdit,
  onDelete,
  className = '',
  isNotes,
  isPinned,
  onPin,
  onArchive,
  isArchived
}: CardDesignProps) {
  const clickable = Boolean(onClick);
  return (
    <div
      key={id}
      onClick={onClick}
      className={
        `relative group p-4 bg-white dark:bg-gray-700 rounded-lg shadow
         transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg
         dark:hover:shadow-[0_4px_6px_rgba(255,255,255,0.1),0_2px_4px_rgba(255,255,255,0.06)]
         ${clickable ? 'cursor-pointer' : ''}
         ${className}`
      }
    >
      <div className="flex items-center mb-2">
        {icon}
        <h3 title={title} className="max-w-28 md:max-w-28 text-md text-gray-800 dark:text-gray-100 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </h3>
      </div>

      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
          {description}
        </p>
      )}
      {category && (
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-2 ml-2">
          {/* max-w-28 sm:max-w-24 */}
          {category}
        </p>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
        Last edited {new Intl.DateTimeFormat('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(updatedAt))}
      </p>

      <CardActionButtons onArchive={onArchive ? onArchive : ()=>{}} isArchived={isArchived ? true : false} id={id} onPin={onPin ? onPin : ()=>{} } isNotes={isNotes ? true : false} isPinned = {isPinned ? true : false}  onEdit={onEdit} onDelete={onDelete} />
    
    {/* add share icon for future */}
    {/* {isNotes && <div className='absolute right-4 bottom-2'>
      <div className='w-8 h-8 flex justify-center items-center hover:border-t-sky-500 rounded-full'>
    <FiShare2 size={18} className='hover:text-blue-400'/>
    </div>
    </div>
    } */}
    </div>
  );
}
