// src/hooks/useModal.ts
import { useState, useCallback } from 'react'

export function useModal() {
  const [isOpen, setIsOpen] = useState(false)
  const open  = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  return { isOpen, open, close }
}
