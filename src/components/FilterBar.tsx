import { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { MdTune } from 'react-icons/md';

export interface FilterOption {
  label: string
  value: string
}

interface Props {
  options: FilterOption[]
  selected: FilterOption
  onSelect: (opt: FilterOption) => void
}

export default function FilterBar({ options, selected, onSelect }: Props) {
  const [open, setOpen] = useState(true)

  return (
    <div className="w-full">
      {/* toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2  p-2
                 bg-slate-50 dark:bg-gray-700 text-black dark:text-slate-100
                 focus:outline-none focus:ring-0
                   border border-gray-300 dark:border-gray-600 rounded-lg shadow-md
                   hover:bg-gray-200 dark:hover:bg-gray-500 transition"
      >
        <MdTune size={16}/>
        <span className='text-[0.7rem] sm:text-[0.8rem]'>Filter</span>
        {open ?
        <span>
          <FiChevronUp className=" text-gray-600 dark:text-gray-300" />
        </span>
        :
        <span>
          <FiChevronDown className=" text-gray-600 dark:text-gray-300" />
        </span>
        }
      </button>

        <div 
        className={`
               mt-3 flex flex-wrap gap-3 overflow-hidden
               transition-[max-height,opacity] duration-300 ease-in-out
               ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
             `}
        >
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => onSelect(opt)}
              className={`
                px-3 py-1 rounded-full border
                max-w-[7rem]
                focus:outline-none
                focus:ring-0
                text-[0.75rem]
                whitespace-nowrap overflow-hidden text-ellipsis
                ${selected.value === opt.value
                  ? 'bg-blue-600 text-white border-none'
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'}
              `}
              title={opt.label}
            >
              {opt.label}
            </button>
          ))}
        </div>
       {/* )} */}
    </div>
  )
}
