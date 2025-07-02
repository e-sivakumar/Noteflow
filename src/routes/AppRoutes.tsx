import { BrowserRouter ,Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/LoginPage';
import Signup from '../pages/SignupPage';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import NotesLayout from '../layouts/NotesLayout';
import AllNotesList from '../pages/AllNotesList';
import NotesInFolder from '../pages/NotesInFolder';
import FolderList from '../pages/FolderList';
import NoteViewPage from '../pages/NoteViewPage';
import UserProfile from '../pages/UserProfile';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
    <Header/>

    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        element={
          <ProtectedRoute/>
        }
      >
        <Route element={<DashboardLayout/>}>
          <Route path='/dashboard' element={<FolderList/>} />
          <Route path='/dashboard/all' element={<AllNotesList/>} />
        </Route>

        <Route path="folder/:folderId" element={<NotesLayout/>}>
            <Route index element={<NotesInFolder/>} />         {/* /folder/123 */}
            <Route path="note/:noteId" element={<NoteViewPage/>}/>
          </Route>
      </Route>
      
      <Route path='/profile' element={<UserProfile/>} />

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
    </BrowserRouter>
  );
}