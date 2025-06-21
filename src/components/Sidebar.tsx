// // src/components/Sidebar.tsx
// import { NavLink, useLocation } from 'react-router-dom'
// import { useState, useEffect, useRef } from 'react'
// import { FiMenu, FiX } from 'react-icons/fi'

// export type SidebarItem = {
//   label: string
//   to?: string              // for navigation
//   onClick?: () => void     // for action buttons
//   icon?: React.ReactNode
// }

// interface SidebarProps {
//   items: SidebarItem[]
// }

// export default function Sidebar({ items }: SidebarProps) {
//   const [isOpen, setIsOpen] = useState(false)
//   const location = useLocation()
//   const sidebarRef = useRef<HTMLDivElement>(null)

//   useEffect(() => setIsOpen(false), [location.pathname])

//   /* Close on Esc */
//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false)
//     document.addEventListener('keyup', handler)
//     return () => document.removeEventListener('keyup', handler)
//   }, [])

//   return (
//     // <div
//     //   className={`
//     //     flex flex-col
//     //     ${isOpen ? 'z-[2]' : ''}
//     //     bg-slate-100 dark:bg-gray-800
//     //     h-screen
//     //     transition-[width] duration-300
//     //     ${isOpen ? 'w-64' : 'w-16'}
//     //     ${isOpen ? 'absolute' : 'relative'}
//     //     `}
//     //     >
//     //   {/* Toggle button */}
//     //   <button
//     //     onClick={() => setIsOpen(v => !v)}
//     //     className="p-4 text-gray-700 dark:text-gray-200 focus:outline-none"
//     //     aria-label={isOpen ? 'Collapse menu' : 'Expand menu'}
//     //   >
//     //     <FiMenu size={24} />
//     //   </button>

//     //   {/* Menu items */}
//     //   <nav className="mt-4 flex-1 overflow-auto">
//     //     {items.map((item, i) =>
//     //       item.to ? (
//     //         <NavLink
//     //           key={i}
//     //           to={item.to}
//     //           className={({ isActive }) =>
//     //             `flex items-center gap-3 px-4 py-2 my-1 rounded-md
//     //              text-gray-700 hover:bg-blue-500 hover:text-white
//     //              dark:text-gray-200 dark:hover:text-white
//     //              ${isActive ? 'bg-blue-600 text-white' : ''}`
//     //           }
//     //         >
//     //           {item.icon}
//     //           {isOpen && <span>{item.label}</span>}
//     //         </NavLink>
//     //       ) : (
//     //         <button
//     //           key={i}
//     //           onClick={item.onClick}
//     //           className="flex items-center gap-3 px-4 py-2 my-1 w-full text-left rounded-md
//     //                      text-gray-700 hover:bg-blue-500 hover:text-white
//     //                      dark:text-gray-200 dark:hover:text-white"
//     //         >
//     //           {item.icon}
//     //           {isOpen && <span>{item.label}</span>}
//     //         </button>
//     //       )
//     //     )}
//     //   </nav>
//     // </div>
//     <>
//     {/* Back-drop (only rendered while open) */}
//     {isOpen && (
//       <div
//         className="fixed inset-0 top-16 z-[1] bg-black/40 dark:bg-black/60"
//         onClick={() => setIsOpen(false)}
//       />
//     )}

//     {/* Sidebar */}
//     <aside
//       ref={sidebarRef}
//       className={`
//         fixed top-16 left-0 z-[2] h-[calc(100vh-4rem)]
//         flex flex-col bg-slate-100 dark:bg-gray-800 shadow-md
//         transition-[width] duration-300
//         ${isOpen ? 'w-64' : 'w-16'}
//       `}
//     >
//       {/* Toggle */}
//       <button
//         onClick={() => setIsOpen(v => !v)}
//         className="p-4 text-gray-700 dark:text-gray-200 focus:outline-none"
//         aria-label={isOpen ? 'Collapse menu' : 'Expand menu'}
//       >
//         {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//       </button>

//       {/* Links / Actions */}
//       <nav className="mt-4 flex-1 overflow-auto">
//         {items.map((item, i) =>
//           item.to ? (
//             <NavLink
//               key={i}
//               to={item.to}
//               end={item.to === '/dashboard'} 
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-4 py-2 my-1 rounded-md
//                  text-gray-700 hover:bg-blue-500 hover:text-white
//                  dark:text-gray-200 dark:hover:text-white
//                  ${isActive ? 'bg-blue-600 text-white' : ''}`
//               }
//             >
//               {item.icon}
//               {isOpen && <span>{item.label}</span>}
//             </NavLink>
//           ) : (
//             <button
//               key={i}
//               onClick={item.onClick}
//               className="flex items-center gap-3 px-4 py-2 my-1 w-full text-left rounded-md
//                          text-gray-700 hover:bg-blue-500 hover:text-white
//                          dark:text-gray-200 dark:hover:text-white"
//             >
//               {item.icon}
//               {isOpen && <span>{item.label}</span>}
//             </button>
//           )
//         )}
//       </nav>
//     </aside>
//   </>
//   )
// }


import { NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'

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
          w-14 
          sticky top-0
          bg-slate-200 dark:bg-gray-800
          "
          >
        {/* h-auto */}
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          className="p-4 flex items-center justify-center w-full  text-center text-gray-700 dark:text-gray-200 focus:outline-none bg-slate-300 dark:bg-gray-700"
        >
          <FiMenu size={24} />
        </button>

        <nav className="mt-4 flex flex-col gap-2">
          {items.map((item, i) =>
            item.to ? (
              <NavLink
                key={i}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `p-3 rounded-lg
                   text-gray-700 dark:text-gray-200
                   hover:bg-blue-500 hover:text-white
                   ${isActive ? 'bg-blue-600 text-white' : ''}`
                }
              >
                {item.icon}
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

            <nav className="mt-2 flex-1 overflow-auto px-2">
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
