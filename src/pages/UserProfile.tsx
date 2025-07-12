import React, { useState, useEffect } from 'react';
import { FiEdit2, FiLock, FiUser, FiMail, FiPhone, FiUserCheck, FiLogOut } from 'react-icons/fi';
import { useGetUser, useUpdateUser, useUpdatePassword } from "../hooks/useProfile";
import Modal from '../components/Modal';
import { useModal } from '../hooks/useModal';
import { doPasswordsMatch, isStrongPassword } from '../utils/Validation';
import { useToast } from '../components/ToastProvider'; 
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Avatar Component with first letter and animation
const UserAvatar = ({ name, size = "w-20 h-20" }:{name: string; size?: string}) => {
  const firstLetter = name ? name.charAt(0).toUpperCase() : 'U';
  const colors = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-green-500 to-green-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-pink-500 to-pink-600',
    'bg-gradient-to-br from-yellow-500 to-yellow-600',
    'bg-gradient-to-br from-red-500 to-red-600'
  ];
  
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
  
  return (
    <div className={`${size} rounded-full ${colors[colorIndex]} flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl`}>
      <span className="text-white font-bold text-2xl">{firstLetter}</span>
    </div>
  );
};

export default function UserProfile() {
  const { data: user, isLoading } = useGetUser();
  const updateUser = useUpdateUser();
  const updatePassword = useUpdatePassword();
  const { addToast } = useToast();
  const { logout } = useAuth()
  const navigate = useNavigate();
  
  // Modals
  const { isOpen: isEditOpen, open: openEdit, close: closeEdit } = useModal();
  const { isOpen: isPasswordOpen, open: openPassword, close: closePassword } = useModal();
  
  // Edit Profile State
  const [editing, setEditing] = useState<{
    name: string
    username: string
    email: string
    phoneNumber: string
  }>({
    name: '',
    username: '',
    email: '',
    phoneNumber: '',
  });
  
  // Password State
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Error States
  const [editErrors, setEditErrors] = useState<{
    name?: string
    username?: string
    email?: string
    phoneNumber?: string
  }>({});
  const [passwordErrors, setPasswordErrors] = useState<{
    oldPassword?: string
    newPassword?: string
    confirmPassword?: string
  }>({});

  useEffect(() => {
    if (user) {
      setEditing({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber?.toString() || ''
      });
    }
  }, [user]);

  const openEditModal = () => {
    setEditErrors({});
    openEdit();
  };

  const closeEditModal = () => {
    setEditErrors({});
    closeEdit();
  };

  const openPasswordModal = () => {
    setPasswordErrors({});
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    openPassword();
  };

  const closePasswordModal = () => {
    setPasswordErrors({});
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    closePassword();
  };

  const validateEditForm = () => {
    const errors: {
      name?: string
      username?: string
      email?: string
      phoneNumber?: string
    } = {};
    
    if (!editing.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!editing.username.trim()) {
      errors.username = 'Username is required';
    } else if (editing.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!editing.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editing.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!editing.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(editing.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors: {
      oldPassword?: string
      newPassword?: string
      confirmPassword?: string
    } = {};
    
    if (!passwordData.oldPassword) {
      errors.oldPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } 
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    }

    if (!isStrongPassword(passwordData.newPassword)) {
        errors.newPassword = 'Password must be at least 8 chars, incl. uppercase, lowercase, number, and special char.';
    }
    if (!doPasswordsMatch(passwordData.newPassword, passwordData.confirmPassword)) {
        errors.confirmPassword = 'Passwords do not match.';
    }
    
    if (passwordData.oldPassword && passwordData.oldPassword === passwordData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditSave = async () => {
    if (!validateEditForm()) return;
    
    try {
      await updateUser.mutateAsync({data:{
        name: editing.name,
        username: editing.username,
        email: editing.email,
        phoneNumber: parseInt(editing.phoneNumber, 10)
      }});
      
      addToast('success', 'Your profile has been updated successfully.');
      
      closeEditModal();
    } catch (error: unknown) {
      if(axios.isAxiosError(error) && error?.response?.data?.message){
        addToast(
           'error',
           error.response.data.message);
      }
      else{
        addToast(
          'error',
          'Failed to update profile. Please try again.');
      }
    }
  };

  const onLogout = ()=>{
    logout();
    addToast('success', 'Logged out successfully')
    navigate("/login");
  }

  const handlePasswordSave = async () => {
    if (!validatePasswordForm()) return;
    
    try {
      await updatePassword.mutateAsync({data:{
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      }});
      
      addToast(
         'success',
         'Your password has been changed successfully.'
      );
      
      closePasswordModal();
    } catch (error: unknown) {
      if(axios.isAxiosError(error) && error?.response?.data?.message){
        addToast(
           'error',
           error.response.data || 'Failed to change password. Please try again.'
        );
      }
      else{
        addToast(
           'error',
            'Failed to change password. Please try again.'
        );
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setEditing(prev => ({ ...prev, phoneNumber: value }));
    }
  };

  if (isLoading) {
    return (
      <div className="w-screen min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-screen min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Failed to load user data</div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6 transition-all duration-300 hover:shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-4 sm:mb-0">
              <UserAvatar name={user.name} />
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  @{user.username}
                </p>
              </div>
            </div>
            <button
              onClick={openEditModal}
              title='Edit profile'
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <FiEdit2 size={18} />
            </button>
          </div>

          <div className="grid gap-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="p-2 rounded-lg">
              {/* bg-blue-100 dark:bg-blue-900 */}
                <FiUser className="text-blue-600 dark:text-blue-400 hover:scale-110" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="p-2 rounded-lg">
                {/* bg-green-100 dark:bg-green-900  */}
                <FiUserCheck className="text-green-600 dark:text-green-400 hover:scale-110" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">@{user.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="p-2 rounded-lg">
                {/* bg-purple-100 dark:bg-purple-900 */}
                <FiMail className="text-purple-600 dark:text-purple-400 hover:scale-110" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="p-2 rounded-lg">
              {/* bg-orange-100 dark:bg-orange-900  */}
                <FiPhone className="text-orange-600 dark:text-orange-400 hover:scale-110" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{user.phoneNumber}</p>
              </div>
            </div>
          </div>


          <div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-600 flex flex-col gap-10 sm:flex-row  sm:justify-between'>
            <div className="">
              <button
                onClick={openPasswordModal}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <FiLock size={18} />
                Change Password
              </button>
            </div>
            <div className="">
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <FiLogOut size={18} />
                Log out
              </button>
          </div>
          </div>
        </div>

        <Modal isOpen={isEditOpen} onClose={closeEditModal} title="Edit Profile">
          <div className="space-y-4">
            <div>
              <input
                type="text"
                className={`input-base ${editErrors.name ? 'border-red-600' : ''}`}
                placeholder="Full Name"
                value={editing.name}
                onChange={(e) => setEditing(prev => ({ ...prev, name: e.target.value }))}
              />
              {editErrors.name && <p className="text-red-500 text-sm mt-1">{editErrors.name}</p>}
            </div>

            <div>
              <input
                type="text"
                className={`input-base ${editErrors.username ? 'border-red-600' : ''}`}
                placeholder="Username"
                value={editing.username}
                onChange={(e) => setEditing(prev => ({ ...prev, username: e.target.value }))}
              />
              {editErrors.username && <p className="text-red-500 text-sm mt-1">{editErrors.username}</p>}
            </div>

            <div>
              <input
                type="email"
                className={`input-base ${editErrors.email ? 'border-red-600' : ''}`}
                placeholder="Email"
                value={editing.email}
                onChange={(e) => setEditing(prev => ({ ...prev, email: e.target.value }))}
              />
              {editErrors.email && <p className="text-red-500 text-sm mt-1">{editErrors.email}</p>}
            </div>

            <div>
              <input
                type="tel"
                className={`input-base ${editErrors.phoneNumber ? 'border-red-600' : ''}`}
                placeholder="Phone Number"
                value={editing.phoneNumber}
                onChange={handlePhoneChange}
                maxLength={10}
              />
              {editErrors.phoneNumber && <p className="text-red-500 text-sm mt-1">{editErrors.phoneNumber}</p>}
            </div>

            <div className="flex justify-end gap-2">
              <button
                disabled={updateUser.isPending}
                onClick={closeEditModal}
                className={`cancel-btn ${updateUser.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={updateUser.isPending}
                className={`submit-btn ${updateUser.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {updateUser.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={isPasswordOpen} onClose={closePasswordModal} title="Change Password">
          <div className="space-y-4">
            <div>
              <input
                type="password"
                className={`input-base ${passwordErrors.oldPassword ? 'border-red-600' : ''}`}
                placeholder="Current Password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
              />
              {passwordErrors.oldPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.oldPassword}</p>}
            </div>

            <div>
              <input
                type="password"
                className={`input-base ${passwordErrors.newPassword ? 'border-red-600' : ''}`}
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              />
              {passwordErrors.newPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>}
            </div>

            <div>
              <input
                type="password"
                className={`input-base ${passwordErrors.confirmPassword ? 'border-red-600' : ''}`}
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
              {passwordErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>}
            </div>

            <div className="flex justify-end gap-2">
              <button
                disabled={updatePassword.isPending}
                onClick={closePasswordModal}
                className={`cancel-btn ${updatePassword.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSave}
                disabled={updatePassword.isPending}
                className={`submit-btn ${updatePassword.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {updatePassword.isPending ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

