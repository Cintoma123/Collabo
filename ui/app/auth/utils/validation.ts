import { RegisterCredentials, LoginCredentials, ForgotPasswordRequest } from "../types";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Username validation regex (alphanumeric and underscores, 3-20 characters)
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

export const validateEmail = (email: string): { isValid: boolean; error: string } => {
  if (!email.trim()) {
    return { isValid: false, error: "Email is required" };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }
  return { isValid: true, error: "" };
};

export const validateUsername = (username: string): { isValid: boolean; error: string } => {
  if (!username.trim()) {
    return { isValid: false, error: "Username is required" };
  }
  if (!USERNAME_REGEX.test(username)) {
    return { 
      isValid: false, 
      error: "Username must be 3-20 characters and contain only letters, numbers, and underscores" 
    };
  }
  return { isValid: true, error: "" };
};

export const validatePassword = (password: string): { isValid: boolean; error: string; validation: any } => {
  const validation = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isValid = Object.values(validation).every(Boolean);

  let error = "";
  if (!isValid) {
    if (!validation.length) error = "Password must be at least 8 characters long";
    else if (!validation.uppercase) error = "Password must contain at least one uppercase letter";
    else if (!validation.lowercase) error = "Password must contain at least one lowercase letter";
    else if (!validation.number) error = "Password must contain at least one number";
    else if (!validation.special) error = "Password must contain at least one special character";
  }

  return { isValid, error, validation };
};

export const validateName = (name: string, fieldName: string): { isValid: boolean; error: string } => {
  if (!name.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
  }
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }
  return { isValid: true, error: "" };
};

export const validateConfirmPassword = (password: string, confirmPassword: string): { isValid: boolean; error: string } => {
  if (!confirmPassword) {
    return { isValid: false, error: "Please confirm your password" };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }
  return { isValid: true, error: "" };
};

// Form validation functions
export const validateRegistrationForm = (data: RegisterCredentials) => {
  const errors: Partial<Record<keyof RegisterCredentials, string>> = {};

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) errors.email = emailValidation.error;

  const usernameValidation = validateUsername(data.username);
  if (!usernameValidation.isValid) errors.username = usernameValidation.error;

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) errors.password = passwordValidation.error;

  const firstNameValidation = validateName(data.firstName, "First name");
  if (!firstNameValidation.isValid) errors.firstName = firstNameValidation.error;

  const lastNameValidation = validateName(data.lastName, "Last name");
  if (!lastNameValidation.isValid) errors.lastName = lastNameValidation.error;

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateLoginForm = (data: LoginCredentials) => {
  const errors: Partial<Record<keyof LoginCredentials, string>> = {};

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) errors.email = emailValidation.error;

  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 1) {
    errors.password = "Password cannot be empty";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateForgotPasswordForm = (data: ForgotPasswordRequest) => {
  const errors: Partial<Record<keyof ForgotPasswordRequest, string>> = {};

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) errors.email = emailValidation.error;

  return { isValid: Object.keys(errors).length === 0, errors };
};

// Async validation functions (for real-time validation)
export const checkEmailUniqueness = async (email: string): Promise<{ isValid: boolean; error: string }> => {
  // This would make an API call to check if email is already registered
  // For now, we'll simulate the API call
  try {
    const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    
    if (response.ok) {
      return { isValid: true, error: "" };
    } else {
      return { isValid: false, error: data.message || "Email is already registered" };
    }
  } catch (error) {
    // If API is not available, assume email is valid for now
    return { isValid: true, error: "" };
  }
};

export const checkUsernameUniqueness = async (username: string): Promise<{ isValid: boolean; error: string }> => {
  // This would make an API call to check if username is already taken
  // For now, we'll simulate the API call
  try {
    const response = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
    const data = await response.json();
    
    if (response.ok) {
      return { isValid: true, error: "" };
    } else {
      return { isValid: false, error: data.message || "Username is already taken" };
    }
  } catch (error) {
    // If API is not available, assume username is valid for now
    return { isValid: true, error: "" };
  }
};

// Password strength indicator
export const getPasswordStrength = (password: string): { level: 'weak' | 'medium' | 'strong'; color: string; width: string } => {
  const validation = validatePassword(password).validation;
  const score = Object.values(validation).filter(Boolean).length;

  if (score <= 2) {
    return { level: 'weak', color: '#ef4444', width: '33%' }; // Red
  } else if (score <= 4) {
    return { level: 'medium', color: '#f59e0b', width: '66%' }; // Orange
  } else {
    return { level: 'strong', color: '#22c55e', width: '100%' }; // Green
  }
};