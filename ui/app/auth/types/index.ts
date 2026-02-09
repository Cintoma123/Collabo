// Authentication types for the frontend

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  clearError: () => void;
  refreshToken: () => Promise<void>;
  // Modal state
  isModalOpen: boolean;
  modalMode: "login" | "register" | "forgot-password";
  openModal: (mode?: "login" | "register" | "forgot-password") => void;
  closeModal: () => void;
  switchModalMode: (mode: "login" | "register" | "forgot-password") => void;
}

export interface FormField {
  value: string;
  error: string;
  isValid: boolean;
}

export interface FormState {
  [key: string]: FormField;
}

export interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export interface GoogleAuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}