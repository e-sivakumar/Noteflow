import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/ToastProvider';

const qc = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={qc}>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
);
