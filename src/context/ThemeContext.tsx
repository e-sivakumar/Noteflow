
// 📁 src/context/ThemeContext.tsx
import { createContext, useContext, useLayoutEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme === 'dark' ? 'dark' : 'light';
  });

  useLayoutEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);

    localStorage.setItem('theme', theme);
    console.log(`Theme changed to: ${theme}`);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};