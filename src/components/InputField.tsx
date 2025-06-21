// src/components/TextField.tsx
import React from 'react';

// Define props for the TextField component
interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string; // The label text for the input
  id: string;    // Unique ID for the input and its label
  error?: string; // Optional error message to display below the input
}

const TextField: React.FC<TextFieldProps> = ({ label, id, error, className, ...props }) => {
  return (
    <div className="mb-4"> {/* Margin bottom for spacing between fields */}
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type={props.type || "text"} // Default type to "text" if not specified
        id={id}
        // Tailwind classes for styling:
        // - block w-full: Takes full width
        // - px-3 py-2: Padding inside input
        // - border: Default border
        // - rounded-md shadow-sm: Rounded corners and subtle shadow
        // - focus:outline-none focus:ring-blue-500 focus:border-blue-500: Focus styles
        // - dark: classes for dark mode
        // - conditional border-red-500 if there's an error
        className={`mt-1 block w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
        bg-slate-200 text-black
        dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400
        ${className || ''}`} // Allow additional classes to be passed in
        {...props} // Pass through all other standard input props (value, onChange, placeholder, required etc.)
        />
      {/* Display error message if provided */}
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default TextField;