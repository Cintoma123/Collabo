"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { validateForgotPasswordForm } from "../utils/validation";
import { Mail, ArrowRight, AlertCircle, CheckCircle, ArrowLeft, Lock } from "lucide-react";

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  onBackToLogin?: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSuccess,
  onBackToLogin,
}) => {
  const router = useRouter();
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
    
    const validation = validateForgotPasswordForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await forgotPassword(formData.email);
      setIsSubmitted(true);
      clearError();
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full text-center animate-in fade-in slide-in-from-bottom duration-500">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Check Your Email
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          We've sent password reset instructions to
        </p>
        <p className="text-blue-600 dark:text-blue-400 font-semibold mb-8">
          {formData.email}
        </p>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8 text-left">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <p className="font-semibold text-gray-900 dark:text-white">What's next?</p>
              <ol className="list-decimal list-inside space-y-1.5">
                <li>Check your inbox for the reset link</li>
                <li>Click the link in the email</li>
                <li>Choose a new password</li>
                <li>Sign in with your new password</li>
              </ol>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onBackToLogin}
            className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300
              bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
              text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25
              focus:outline-none focus:ring-4 focus:ring-blue-500/20
              transform hover:-translate-y-0.5"
          >
            Back to Sign In
          </button>
          
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({ email: "" });
            }}
            className="w-full py-4 px-6 rounded-xl font-semibold
              bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
              text-gray-700 dark:text-gray-300
              border border-gray-200 dark:border-gray-700
              transition-all duration-200"
          >
            Try a Different Email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Forgot Password?
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          No worries, we'll send you reset instructions
        </p>
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
        {/* Email Field */}
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
            placeholder="Enter your email address"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>
          )}
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
              <span>Sending Reset Link...</span>
            </>
          ) : (
            <>
              <span>Send Reset Link</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Back to Login Link */}
      <div className="mt-8 text-center">
        <button
          onClick={onBackToLogin}
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
