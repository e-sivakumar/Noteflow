import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
      <AuthProvider>
          <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
);
