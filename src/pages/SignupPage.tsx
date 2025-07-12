// src/pages/SignupPage.tsx
import React, { useEffect, useState } from 'react';
import TextField from '../components/InputField';
import { isRequired, isValidEmail, isStrongPassword, doPasswordsMatch, isValidPhoneNumber } from '../utils/Validation';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from '../hooks/useSignUp';
import axios from 'axios';
import { useToast } from '../components/ToastProvider';
import { useAuth } from '../context/AuthContext';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const signup = useSignUp()
  const { addToast } = useToast();

  const {isAuthenticated} = useAuth();
  
  useEffect(()=>{
    if(isAuthenticated){
      navigate("/dashboard")
    }
  },[])

  // State to manage individual field errors
  const [errors, setErrors] = useState({
    name: '', email: '', phone: '', username: '', password: '', confirmPassword: '', form: ''
  });
  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', phone: '', username: '', password: '', confirmPassword: '', form: '' };

    if (!isRequired(name)) { newErrors.name = 'Name is required.'; isValid = false; }
    if (!isValidEmail(email)) { newErrors.email = 'Please enter a valid email.'; isValid = false; }
    if (!isRequired(phone)) { newErrors.phone = 'Phone number is required.'; isValid = false; }
    else if (!isValidPhoneNumber(phone)) { newErrors.phone = 'Please enter a valid phone number.'; isValid = false; }
    if (!isRequired(username)) { newErrors.username = 'Username is required.'; isValid = false; }
    if (!isStrongPassword(password)) {
      newErrors.password = 'Password must be at least 8 chars, incl. uppercase, lowercase, number, and special char.';
      isValid = false;
    }
    if (!doPasswordsMatch(password, confirmPassword)) {
      newErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ name: '', email: '', phone: '', username: '', password: '', confirmPassword: '', form: '' }); // Clear errors
    // setLoading(true);

    if (!validateForm()) {
      // setLoading(false);
      return;
    }

    try {
      // const data = await signup({ name, email, phone, username, password });
      // console.log('Sign up successful:', data);
      await signup.mutateAsync({ name, email, phoneNumber: phone, username, password, confirmPassword })
      alert('Sign up successful! Please log in.');
      addToast('success', "Signed up successfully, You can login now !")
      navigate('/login'); // Redirect to login page after successful signup
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setErrors(prev => ({ ...prev, form: err?.response?.data?.message || 'Sign up failed. Please try again.' }));
        console.error('Sign up error:', err?.response?.data?.message);
        addToast('error',err?.response?.data?.message || 'Sign up failed. Please try again.' )
      } else {
        setErrors(prev => ({ ...prev, form: 'Sign up failed. Please try again.' }));
        addToast('error', 'Sign up failed. Please try again.' )
      }
      console.error('Login error:', err)
    } 
  };

  return (
    <div className="flex items-center justify-center py-10 min-h-[calc(100vh-4rem)] bg-slate-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md w-[70%] min-w-[20rem] max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Create Your NoteFlow Account</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            id="name"
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            error={errors.name}
          />
          <TextField
            id="email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            error={errors.email}
          />
          <TextField
            id="phone"
            label="Phone Number"
            type="tel" // Use type="tel" for phone numbers
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 1234567890"
            error={errors.phone}
          />
          <TextField
            id="username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a unique username"
            error={errors.username}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            error={errors.password}
          />
          <TextField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            error={errors.confirmPassword}
          />

          {errors.form && (
            <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-800 dark:border-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{errors.form}</span>
            </div>
          )}

          <div className='w-[40%] mx-auto mt-5'>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none 
            dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
            disabled={signup.isPending}
          >
            {signup.isPending ? 'Signing up...' : 'Sign Up'}
          </button>
          </div>
          

          <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
            Already have an account? <a href="/login" className="text-blue-600 hover:underline dark:text-blue-400">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;