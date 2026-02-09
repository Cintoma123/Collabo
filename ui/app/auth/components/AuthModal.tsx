"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register" | "forgot-password";
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "login",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [currentMode, setCurrentMode] = useState<"login" | "register" | "forgot-password">(initialMode);

  // Check for OAuth callback errors
  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      setCurrentMode("login");
    }
  }, [searchParams]);

  // Close modal if user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleLoginSuccess = () => {
    onClose();
  };

  const handleRegisterSuccess = () => {
    onClose();
  };

  const handleForgotPasswordSuccess = () => {
    // Stay on the forgot password success screen
  };

  const handleSwitchToRegister = () => {
    setCurrentMode("register");
  };

  const handleSwitchToLogin = () => {
    setCurrentMode("login");
  };

  const handleSwitchToForgotPassword = () => {
    setCurrentMode("forgot-password");
  };

  const handleClose = () => {
    setCurrentMode("login");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl max-h-[95vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 text-white/80 hover:text-white transition-all duration-200 hover:rotate-90 z-10"
          aria-label="Close"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Modal Content with Grid Layout */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="grid lg:grid-cols-2 min-h-[600px]">
            {/* Left Side - Branding / Image */}
            <div className="hidden lg:flex bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 p-12 relative overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between text-white">
                <div>
                  {/* Logo */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-bold">C</span>
                    </div>
                    <span className="text-2xl font-bold">Collabo</span>
                  </div>

                  {/* Dynamic Content Based on Mode */}
                  <div className="space-y-6">
                    {currentMode === "login" && (
                      <>
                        <h2 className="text-4xl font-bold leading-tight">
                          Welcome Back!
                        </h2>
                        <p className="text-white/80 text-lg leading-relaxed">
                          Sign in to continue your journey with Collabo and access all your collaborative projects.
                        </p>
                      </>
                    )}
                    {currentMode === "register" && (
                      <>
                        <h2 className="text-4xl font-bold leading-tight">
                          Join Collabo Today
                        </h2>
                        <p className="text-white/80 text-lg leading-relaxed">
                          Create your account and start collaborating with teams worldwide. It only takes a minute!
                        </p>
                      </>
                    )}
                    {currentMode === "forgot-password" && (
                      <>
                        <h2 className="text-4xl font-bold leading-tight">
                          Forgot Password?
                        </h2>
                        <p className="text-white/80 text-lg leading-relaxed">
                          No worries! We'll send you reset instructions to get you back on track.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Features / Benefits */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-white/90">Real-time collaboration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-white/90">Secure & GDPR compliant</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-white/90">Trusted by 10,000+ teams</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-8 lg:p-12 overflow-y-auto max-h-[95vh]">
              {/* Mode Switcher for Login/Register */}
              {currentMode !== "forgot-password" && (
                <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1.5 mb-8">
                  <button
                    onClick={handleSwitchToLogin}
                    className={`flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      currentMode === "login"
                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleSwitchToRegister}
                    className={`flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      currentMode === "register"
                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Form Content */}
              <div className="animate-in slide-in-from-right duration-300">
                {currentMode === "login" && (
                  <LoginForm
                    onSuccess={handleLoginSuccess}
                    onSwitchToRegister={handleSwitchToRegister}
                    onForgotPassword={handleSwitchToForgotPassword}
                  />
                )}
                
                {currentMode === "register" && (
                  <RegisterForm
                    onSuccess={handleRegisterSuccess}
                    onSwitchToLogin={handleSwitchToLogin}
                  />
                )}
                
                {currentMode === "forgot-password" && (
                  <ForgotPasswordForm
                    onSuccess={handleForgotPasswordSuccess}
                    onBackToLogin={handleSwitchToLogin}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
