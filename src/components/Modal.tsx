// src/components/Modal.tsx
import { type ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './Modal.css';

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // ✅ Prevent background scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <>
      {/* 1. Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-51"
        onClick={onClose}
      >

      {/* 2. Centered panel */}
      <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg
                     transform transition-all duration-200 scale-95 opacity-0
                     animate-scale-in opacity-in"
          // if you want CSS keyframes, define them in your global CSS
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <header className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h2>
            </header>
          )}

          {/* Body */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
      </div>
    </>,
    document.body
  )
}
