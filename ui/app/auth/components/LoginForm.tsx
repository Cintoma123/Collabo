"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { validateLoginForm } from "../utils/validation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import GoogleLoginButton from "./GoogleLoginButton";

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
  onForgotPassword,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Check for OAuth callback errors
  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      setErrors({ general: decodeURIComponent(oauthError) });
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateLoginForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await login(formData);
      clearError();
      
      const redirectUrl = sessionStorage.getItem("auth_redirect") || "/dashboard";
      sessionStorage.removeItem("auth_redirect");
      
      onSuccess?.();
      router.push(redirectUrl);
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Sign in to continue to your account
        </p>
      </div>

      {/* OAuth Section */}
      <div className="space-y-4 mb-8">
        <GoogleLoginButton />
        
        <div className="relative flex items-center justify-center">
          <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
          <span className="px-4 text-sm text-gray-500 dark:text-gray-400 bg-transparent">
            or continue with email
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field with Floating Label */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className={`w-5 h-5 transition-colors duration-200 ${
              focusedField === "email" 
                ? "text-blue-600 dark:text-blue-400" 
                : "text-gray-400 dark:text-gray-500"
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
              w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-200
              bg-gray-50 dark:bg-gray-800/50 
              ${focusedField === "email"
                ? "border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800"
                : errors.email
                ? "border-red-500 dark:border-red-400"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }
              text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-4 ${
                errors.email 
                  ? "focus:ring-red-500/10 dark:focus:ring-red-400/10"
                  : "focus:ring-blue-500/10 dark:focus:ring-blue-400/10"
              }
            `}
            placeholder="Email address"
            disabled={isLoading}
          />
          <label
            htmlFor="email"
            className={`absolute left-12 transition-all duration-200 pointer-events-none ${
              formData.email || focusedField === "email"
                ? "-top-2.5 left-3 text-xs bg-white dark:bg-gray-900 px-2 text-blue-600 dark:text-blue-400 font-medium"
                : "top-4 text-gray-500 dark:text-gray-400"
            }`}
          >
            {formData.email || focusedField === "email" ? "Email" : ""}
          </label>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field with Floating Label */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className={`w-5 h-5 transition-colors duration-200 ${
              focusedField === "password" 
                ? "text-blue-600 dark:text-blue-400" 
                : "text-gray-400 dark:text-gray-500"
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
              w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-200
              bg-gray-50 dark:bg-gray-800/50 
              ${focusedField === "password"
                ? "border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800"
                : errors.password
                ? "border-red-500 dark:border-red-400"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }
              text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-4 ${
                errors.password 
                  ? "focus:ring-red-500/10 dark:focus:ring-red-400/10"
                  : "focus:ring-blue-500/10 dark:focus:ring-blue-400/10"
              }
            `}
            placeholder="Password"
            disabled={isLoading}
          />
          <label
            htmlFor="password"
            className={`absolute left-12 transition-all duration-200 pointer-events-none ${
              formData.password || focusedField === "password"
                ? "-top-2.5 left-3 text-xs bg-white dark:bg-gray-900 px-2 text-blue-600 dark:text-blue-400 font-medium"
                : "top-4 text-gray-500 dark:text-gray-400"
            }`}
          >
            {formData.password || focusedField === "password" ? "Password" : ""}
          </label>
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            Forgot password?
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
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Register Link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToRegister}
            className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Sign up for free
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
