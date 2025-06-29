import { useState, useRef, useEffect } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { MdSort } from 'react-icons/md';

export type DropdownOption = {
  label: string
  value: string
}

interface CustomDropdownProps {
  label: string
  options: DropdownOption[]
  selected: DropdownOption
  onSelect: (opt: DropdownOption) => void
  isFilter ?: boolean
}

export default function CustomDropdown({
  label,
  options,
  selected,
  onSelect,
  isFilter = false,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (isOpen && ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(o => !o)}
        className="flex items-center px-2 py-2 focus:outline-none focus:ring-0 sm:px-3 sm:py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
      >
        <span className="text-gray-800 dark:text-gray-200 mr-2">{isFilter ? 
    <MdSort size={16}/> : <MdSort size={16}/>    
    }</span>
        <span className='hidden sm:block text-sm text-slate-900 dark:text-gray-100'>{label}</span>

        {/* <span className="hidden md:visible  text-xs md:font-medium text-gray-700 dark:text-gray-100">{selected.label}</span> */}
        {isOpen ? (
          <FiChevronUp className="ml-1 text-gray-600 dark:text-gray-300" />
        ) : (
          <FiChevronDown className="ml-1 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 px-0.5 mt-1 w-18 md:w-32 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50 overflow-hidden">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onSelect(opt)
                setIsOpen(false)
              }}
              className={`rounded-md my-0.5 block text-[0.6rem] sm:text-[0.8rem] w-full text-left p-2 text-gray-700 dark:text-gray-200 focus:outline-none
                focus:ring-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  opt.value === selected.value ? 'bg-blue-500 dark:bg-blue-600' : 'bg-slate-200 dark:bg-gray-700'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
