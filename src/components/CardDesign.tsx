import React from 'react';
import { CardActionButtons } from './CardActionButtons';

export interface CardDesignProps {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  icon: React.ReactNode;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export default function CardDesign({
  id,
  title,
  description,
  createdAt,
  icon,
  onClick,
  onEdit,
  onDelete,
  className = '',
}: CardDesignProps) {
  const clickable = Boolean(onClick);

  return (
    <div
      key={id}
      onClick={onClick}
      className={
        `relative group p-4 bg-white dark:bg-gray-700 rounded-lg shadow
         transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg
         ${clickable ? 'cursor-pointer' : ''}
         ${className}`
      }
    >
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="text-md text-gray-800 dark:text-gray-100 font-medium">
          {title}
        </h3>
      </div>

      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
          {description}
        </p>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
        Last edited {createdAt}
      </p>

      <CardActionButtons onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
