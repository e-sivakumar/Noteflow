/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';

// Types for toast
type ToastType = 'success' | 'error';
interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}
interface ToastContextValue {
  /**
   * Show a toast notification.
   * @param type     'success' or 'error'
   * @param message  main message body
   * @param title    optional bold title above message
   */
  addToast: (type: ToastType, message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Provider component
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string, title?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    // Auto-remove after 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container in top-center */}
      <div className="fixed top-5 inset-x-0 flex flex-col items-center space-y-2 z-50 pointer-events-none">
        <AnimatePresence initial={false}>
          {toasts.map(({ id, type, message }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto border-l-4 ${
                type === 'success' ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <div className="flex flex-row p-2 items-center justify-center gap-1 ">
                {/* <div className="flex items-center"> */}
                  {type === 'success' ? (
                    <AiOutlineCheckCircle className="mr-2 w-6 h-6 text-green-500" />
                  ) : (
                    <AiOutlineCloseCircle className="mr-2 w-6 h-6 text-red-500" />
                  )}
                  {/* {title && <span className="font-semibold text-gray-900">{title}</span>} */}
                {/* </div> */}
                <p className="ml-2 text-gray-800 flex items-center justify-center">{message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
