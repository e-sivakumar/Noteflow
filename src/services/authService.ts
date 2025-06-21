// src/services/authService.ts

// Define interfaces for API request/response types
interface LoginCredentials {
    username: string;
    password: string;
  }
  
  interface UserSignUpData {
    name: string;
    email: string;
    phone: string;
    username: string;
    password: string;
  }
  
  interface AuthSuccessResponse {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
      name: string;
      // Add other user properties
    };
  }
  
  // --- Mock API Functions ---
  // In a real app, you'd use axios or fetch here.
  
  const login = (credentials: LoginCredentials): Promise<AuthSuccessResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // Simulate network delay
        if (credentials.username === 'user' && credentials.password === 'pass') {
          resolve({
            token: 'mock-jwt-token-12345',
            user: {
              id: 'user123',
              username: 'user',
              email: 'user@example.com',
              name: 'Test User',
            },
          });
        } else {
          reject(new Error('Invalid username or password.'));
        }
      }, 1000);
    });
  };
  
  const signup = (userData: UserSignUpData): Promise<{ message: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // Simulate network delay
        // In a real app, you'd check for existing username/email
        if (userData.username === 'existinguser' || userData.email === 'existing@example.com') {
          reject(new Error('Username or Email already taken.'));
        } else {
          resolve({ message: 'Sign up successful! Please log in.' });
        }
      }, 1500);
    });
  };
  
  // Placeholder for user update (you'll flesh this out when you build UserEditPage)
  const updateUserProfile = (userId: string, data: Partial<UserSignUpData>, token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userId && token) {
          console.log(`Simulating update for user ${userId} with data:`, data);
          resolve({ message: 'Profile updated successfully!', user: { id: userId, ...data } });
        } else {
          reject(new Error('Failed to update profile. Invalid user ID or token.'));
        }
      }, 1000);
    });
  };
  
  export { login, signup, updateUserProfile };