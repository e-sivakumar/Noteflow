import { NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import './Sidebar.css'

export type SidebarItem = {
  label: string
  to?: string
  onClick?: () => void
  icon?: React.ReactNode
}

interface SidebarProps {
  items: SidebarItem[]
}

export default function Sidebar({ items }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {setIsOpen(false)}, [location.pathname])

    /* Close on Esc */
    useEffect(() => {
      const handler = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false)
      document.addEventListener('keyup', handler)
      return () => document.removeEventListener('keyup', handler)
    }, [])

  return (
    <>
      {/* ─────── Rail ─────────────── */}
      <div
        className="
          flex-shrink-0 flex flex-col items-center
          w-16 
          sticky top-0
          bg-slate-200 dark:bg-gray-800
          thin-scrollbar
          overflow-y-auto
          p-0
          overflow-x-hidden
          "
          >
        {/* h-auto */}
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          className="p-2 flex items-center justify-center rounded-xl w-auto  text-center text-gray-700 dark:text-gray-200 focus:outline-none bg-slate-200 dark:bg-gray-800"
        >
          {/* bg-slate-300 dark:bg-gray-700 */}
          <FiMenu size={24} />
        </button>

        <nav className="mt-4 flex flex-col gap-2">
          {items.map((item, i) =>
            item.to ? (
              <NavLink
                title={item.label}
                key={i}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `p-3 rounded-lg
                   text-gray-700 dark:text-gray-200
                   hover:bg-blue-500 hover:text-white
                   dark:hover:bg-blue-500 dark:hover:text-white
                   flex flex-col items-center
                   ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-gray-800'}`
                }
              >
                {item.icon}
                <span className='w-8 text-xs whitespace-nowrap overflow-hidden text-ellipsis'> {item.label} </span>
              </NavLink>
            ) : (
              <button
                key={i}
                onClick={item.onClick}
                className="
                  p-3 rounded-lg
                  text-gray-700 dark:text-gray-200
                  hover:bg-blue-500 hover:text-white
                "
              >
                {item.icon}
                {item.label}
              </button>
            )
          )}
        </nav>
      </div>

      {/* ─────── Drawer Overlay ─────────────── */}
      {isOpen && (
        <div 
        className="fixed inset-0 z-40"
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/70"
            onClick={() => setIsOpen(false)}
          />

          {/* sliding drawer */}
          <aside
            className="
              absolute left-0 top-0 h-full w-64
              bg-slate-100 dark:bg-gray-800
              shadow-lg flex flex-col
              animate-slide-in
            "
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="mt-3 mr-2 p-3 self-end text-gray-700 dark:text-gray-200 bg-gray-300 dark:bg-gray-700 focus:outline-none"
            >
              <FiX size={24} />
            </button>

            <nav className="mt-2 flex-1 overflow-auto thin-scrollbar px-2">
              {items.map((item, i) =>
                item.to ? (
                  <NavLink
                    key={i}
                    to={item.to}
                    end={item.to === '/dashboard'}
                    className={({ isActive }) =>
                      `flex items-center w-full gap-3 px-4 py-2 my-1 rounded-md
                       text-gray-700 hover:bg-blue-500 hover:text-white
                       dark:text-gray-200 dark:hover:text-white
                       ${isActive ? 'bg-blue-600 text-white' : ''}`
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ) : (
                  <button
                    key={i}
                    onClick={() => {
                      item.onClick?.()
                      setIsOpen(false)
                    }}
                    className="
                      flex items-center gap-3 px-4 py-2 my-1 w-full text-left rounded-md
                      text-gray-700 hover:bg-blue-500 hover:text-white
                      dark:text-gray-200 dark:hover:text-white
                    "
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                )
              )}
            </nav>
          </aside>
        </div>
      )}
    </>
  )
}
