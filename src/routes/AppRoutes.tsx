

// 📁 src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing';
// import Login from '../pages/Login';
// import Signup from '../pages/Signup';
// import Dashboard from '../pages/Home/Dashboard';
// import Notes from '../pages/Home/Notes';
// import Profile from '../pages/Home/Profile';
// import AppLayout from '../layouts/AppLayout';
// import { useAuth } from '../context/AuthContext'

// const ProtectedRoute = ({ children } : { children: React.ReactNode }) => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? children : <Navigate to="/login" />;
// };

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      {/* <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} /> */}

      {/* <Route
        path="/home"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="folder/:id" element={<Notes />} />
        <Route path="profile" element={<Profile />} />
      </Route> */}

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}