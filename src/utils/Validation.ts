// Checks if a string is not empty or just whitespace
export const isRequired = (value: string | undefined | null): boolean => {
    return value !== undefined && value !== null && String(value).trim() !== '';
  };
  
  // Basic email format validation
  export const isValidEmail = (email: string): boolean => {
    if (!isRequired(email)) return false; // Must not be empty
    // Regex for common email format
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  // Password strength validation:
  // - At least 8 characters
  // - At least one uppercase letter
  // - At least one lowercase letter
  // - At least one digit
  // - At least one special character (@$!%*?&)
  export const isStrongPassword = (password: string): boolean => {
    if (!isRequired(password)) return false; // Must not be empty
    // Regex for strong password criteria
    const strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );
    return strongRegex.test(password);
  };
  
  // Basic phone number validation (e.g., min 10 digits, can be customized for specific regions)
  export const isValidPhoneNumber = (phone: string): boolean => {
    if (!isRequired(phone)) return false;
    // Allows digits and optional hyphens/spaces. Adjust regex for specific needs.
    return /^\+?[\d\s\-]{7,15}$/.test(phone);
  };
  
  // Check if two passwords match (for "confirm password" fields)
  export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword && isRequired(password);
  };