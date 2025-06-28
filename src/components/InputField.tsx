// src/components/TextField.tsx
import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi'

// Define props for the TextField component
interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string; // The label text for the input
  id: string;    // Unique ID for the input and its label
  error?: string; // Optional error message to display below the input
}

const TextField: React.FC<TextFieldProps> = ({ label, id, error, type, className, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  return (
    <div className="mb-4"> {/* Margin bottom for spacing between fields */}
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
      <input
        type={isPassword ? (showPassword ? 'text' : 'password') : type || 'text'}
        id={id}
        className={`mt-1 block w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
        bg-slate-200 text-black
        dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400
        ${className || ''}`} 
        {...props}
        />
         {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute p-[8px] border-none bg-transparent inset-y-0 right-2 flex items-center text-gray-600 dark:text-gray-300"
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
        </div>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default TextField;