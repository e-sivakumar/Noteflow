/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect } from 'react';

type AuthContextType = {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
  };

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(()=>{
      return Boolean(localStorage.getItem('token'));
    });
    // const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log("sjs", token)
        if (token) {
          setIsAuthenticated(true);
        }
      }, []);

      const login = (token: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
      };

      const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
  };