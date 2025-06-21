// src/components/ThemeToggle.tsx
import React, { useEffect, useState } from 'react';

// Define the Theme type for clarity
type Theme = 'light' | 'dark';

const ThemeToggle: React.FC = () => {
  // State to manage the current theme
  const [theme, setTheme] = useState<Theme>(() => {
    // Initialize theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    // Check system preference if no theme is saved
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Effect to apply the theme to the document element and save to localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]); // Re-run effect whenever theme changes

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div
      className="relative w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out"
      // Apply background based on theme for visual distinction
      // light: bg-gray-200, dark: bg-gray-700
      // Consider using a primary color for the background in dark mode, like `bg-blue-900`
      // or `bg-gray-800` depending on your app's theme.
      // Here, using a subtle gray.
      style={{ backgroundColor: theme === 'light' ? '#E5E7EB' : '#374151' }} // Tailwind's gray-200 and gray-700 hex
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      role="switch"
      aria-checked={theme === 'dark'}
    >
      {/* Moving circle/thumb */}
      <div
        className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center
          ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}
      >
        {/* Sun/Moon Icon */}
        {theme === 'light' ? (
          // Sun icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h1M3 12h1m15.325-4.275l-.707-.707M4.372 19.325l-.707-.707M19.325 4.372l-.707.707M4.372 4.372l-.707.707M18 12a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        ) : (
          // Moon icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export default ThemeToggle;