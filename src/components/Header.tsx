// src/components/Header.tsx
import React from 'react';
import ThemeToggle from './ThemeToggle'; // Assuming it's in the same components folder
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';

const Header: React.FC = () => {
  const {isAuthenticated} = useAuth();
  const location = useLocation();
  if(location.pathname == '/'){
    return (<></>)
  }else{
    return (
      <header className="h-16 bg-slate-50 shadow-xl dark:bg-gray-800 transition-colors duration-300 p-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold text-gray-900 dark:text-white">NoteFlow</Link>
        <nav>
          <ul className="flex items-center space-x-4">
            {
            (isAuthenticated)
            &&
            (
            <>
            <li><Link to="/profile" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
            <FiUser size={24} />
            </Link></li>
            </>
            )
            }
            <li><ThemeToggle /></li>
          </ul>
        </nav>
      </header>
    );
  }
};

export default Header;