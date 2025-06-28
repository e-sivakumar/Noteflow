// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import TextField from '../components/InputField'; // Reusable input component
import { isRequired } from '../utils/Validation'; // Validation utilities
import { useNavigate } from 'react-router-dom'; // For redirection after login
import { useSignIn } from '../hooks/useSignIn';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null); // For general form errors
  const navigate = useNavigate(); // Hook to navigate programmatically
  const signIn = useSignIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission and page reload
    setFormError(null); // Clear previous errors

    // Client-side validation: Check if fields are required
    if (!isRequired(username)) {
      setFormError('Username is required.');
      return;
    }
    if (!isRequired(password)) {
      setFormError('Password is required.');
      return;
    }

    try {

      await signIn.mutateAsync({usernameoremail: username, password})
      // alert("loged in")
      console.log('Login successful:');
      navigate('/dashboard'); // Redirect to your main notes page
    } catch (err: any) {
      // Handle API errors
      setFormError(err?.response?.data?.message || 'Login failed. Please try again.');
      alert(`error ${err?.message}`)
      console.error('Login error:', err?.response?.data?.message );
    } 
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md w-[70%] min-w-[20rem] max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Login to NoteFlow</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            id="username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
            // No specific error prop here for individual field, using general formError for simplicity
            // You can add field-specific errors if desired
          />
          <TextField
            id="password"
            label="Password"
            type="password" // Important for password fields
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />

          {/* Display general form error */}
          {formError && (
            <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-800 dark:border-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{formError}</span>
            </div>
          )}

          <div className='w-[40%] mx-auto mt-5'>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none 
            dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
            disabled={signIn.isPending} // Disable button while loading
          >
            {signIn.isPending ? 'Logging in...' : 'Login'}
          </button>
          </div>

          <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
            Don't have an account? <a href="/signup" className="text-blue-600 hover:underline dark:text-blue-400">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;