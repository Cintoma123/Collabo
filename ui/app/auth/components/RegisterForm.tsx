"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { validateRegistrationForm, getPasswordStrength } from "../utils/validation";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, Check, X } from "lucide-react";
import GoogleLoginButton from "./GoogleLoginButton";

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: "" }));
    }

    if (name === "username" && value.length >= 3) {
      await checkUsernameAvailability(value);
    } else if (name === "username" && value.length < 3) {
      setUsernameAvailable(null);
    }

    if (name === "email" && value.includes("@")) {
      await checkEmailAvailability(value);
    } else if (name === "email" && !value.includes("@")) {
      setEmailAvailable(null);
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    setIsCheckingUsername(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsernameAvailable(true);
    } catch (error) {
      setUsernameAvailable(false);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const checkEmailAvailability = async (email: string) => {
    setIsCheckingEmail(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setEmailAvailable(true);
    } catch (error) {
      setEmailAvailable(false);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateRegistrationForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await register(formData);
      clearError();
      
      onSuccess?.();
      router.push("/dashboard");
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const passwordRequirements = [
    { label: "8+ characters", met: formData.password.length >= 8 },
    { label: "Uppercase", met: /[A-Z]/.test(formData.password) },
    { label: "Lowercase", met: /[a-z]/.test(formData.password) },
    { label: "Number", met: /\d/.test(formData.password) },
    { label: "Special char", met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create Account
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Join thousands of teams collaborating on Collabo
        </p>
      </div>

      {/* OAuth Section */}
      <div className="space-y-4 mb-8">
        <GoogleLoginButton />
        
        <div className="relative flex items-center justify-center">
          <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
          <span className="px-4 text-sm text-gray-500 dark:text-gray-400 bg-transparent">
            or sign up with email
          </span>
          <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
        </div>
      </div>

      {/* Error Display */}
      {(error || errors.general) && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">
              {error || errors.general}
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative group">
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              onFocus={() => setFocusedField("firstName")}
              onBlur={() => setFocusedField(null)}
              className={`
                w-full px-4 py-3.5 border-2 rounded-xl transition-all duration-200
                bg-gray-50 dark:bg-gray-800/50 
                ${focusedField === "firstName"
                  ? "border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800"
                  : errors.firstName
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-200 dark:border-gray-700"
                }
                text-gray-900 dark:text-white placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-blue-500/10
              `}
              placeholder="First name"
              disabled={isLoading}
            />
          </div>
          <div className="relative group">
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              onFocus={() => setFocusedField("lastName")}
              onBlur={() => setFocusedField(null)}
              className={`
                w-full px-4 py-3.5 border-2 rounded-xl transition-all duration-200
                bg-gray-50 dark:bg-gray-800/50 
                ${focusedField === "lastName"
                  ? "border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800"
                  : errors.lastName
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-200 dark:border-gray-700"
                }
                text-gray-900 dark:text-white placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-blue-500/10
              `}
              placeholder="Last name"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Username Field */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <User className={`w-5 h-5 transition-colors ${
              focusedField === "username" ? "text-blue-600" : "text-gray-400"
            }`} />
          </div>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            onFocus={() => setFocusedField("username")}
            onBlur={() => setFocusedField(null)}
            className={`
              w-full pl-12 pr-12 py-3.5 border-2 rounded-xl transition-all duration-200
              bg-gray-50 dark:bg-gray-800/50 
              ${focusedField === "username"
                ? "border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800"
                : usernameAvailable === false
                ? "border-red-500"
                : usernameAvailable === true
                ? "border-green-500"
                : "border-gray-200 dark:border-gray-700"
              }
              text-gray-900 dark:text-white placeholder-gray-400
              focus:outline-none focus:ring-4 focus:ring-blue-500/10
            `}
            placeholder="Choose a username"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            {isCheckingUsername && (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            )}
            {usernameAvailable === true && !isCheckingUsername && (
              <Check className="w-5 h-5 text-green-500" />
            )}
            {usernameAvailable === false && !isCheckingUsername && (
              <X className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>

        {/* Email Field */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className={`w-5 h-5 transition-colors ${
              focusedField === "email" ? "text-blue-600" : "text-gray-400"
            }`} />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            className={`
              w-full pl-12 pr-12 py-3.5 border-2 rounded-xl transition-all duration-200
              bg-gray-50 dark:bg-gray-800/50 
              ${focusedField === "email"
                ? "border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800"
                : emailAvailable === false
                ? "border-red-500"
                : emailAvailable === true
                ? "border-green-500"
                : "border-gray-200 dark:border-gray-700"
              }
              text-gray-900 dark:text-white placeholder-gray-400
              focus:outline-none focus:ring-4 focus:ring-blue-500/10
            `}
            placeholder="Email address"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            {isCheckingEmail && (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            )}
            {emailAvailable === true && !isCheckingEmail && (
              <Check className="w-5 h-5 text-green-500" />
            )}
            {emailAvailable === false && !isCheckingEmail && (
              <X className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>

        {/* Password Field */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className={`w-5 h-5 transition-colors ${
              focusedField === "password" ? "text-blue-600" : "text-gray-400"
            }`} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            className={`
              w-full pl-12 pr-12 py-3.5 border-2 rounded-xl transition-all duration-200
              bg-gray-50 dark:bg-gray-800/50 
              ${focusedField === "password"
                ? "border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800"
                : "border-gray-200 dark:border-gray-700"
              }
              text-gray-900 dark:text-white placeholder-gray-400
              focus:outline-none focus:ring-4 focus:ring-blue-500/10
            `}
            placeholder="Create a strong password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">Password strength</span>
                <span className={`font-semibold capitalize ${
                  passwordStrength.level === 'weak' ? 'text-red-600' :
                  passwordStrength.level === 'fair' ? 'text-orange-600' :
                  passwordStrength.level === 'good' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {passwordStrength.level}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: passwordStrength.width,
                    backgroundColor: passwordStrength.color,
                  }}
                ></div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {passwordRequirements.map((req, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg transition-colors ${
                      req.met
                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {req.met ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <X className="w-3 h-3" />
                    )}
                    <span>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className={`w-5 h-5 transition-colors ${
              focusedField === "confirmPassword" ? "text-blue-600" : "text-gray-400"
            }`} />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onFocus={() => setFocusedField("confirmPassword")}
            onBlur={() => setFocusedField(null)}
            className={`
              w-full pl-12 pr-12 py-3.5 border-2 rounded-xl transition-all duration-200
              bg-gray-50 dark:bg-gray-800/50 
              ${focusedField === "confirmPassword"
                ? "border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800"
                : errors.confirmPassword
                ? "border-red-500"
                : "border-gray-200 dark:border-gray-700"
              }
              text-gray-900 dark:text-white placeholder-gray-400
              focus:outline-none focus:ring-4 focus:ring-blue-500/10
            `}
            placeholder="Confirm password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`
            group w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300
            bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
            text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25
            focus:outline-none focus:ring-4 focus:ring-blue-500/20
            transform hover:-translate-y-0.5
            ${isLoading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}
            flex items-center justify-center gap-2
          `}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
