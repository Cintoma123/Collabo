"use client";

import React, { useState } from "react";
import { GoogleAuthResponse } from "../types";

interface GoogleLoginButtonProps {
  onSuccess?: (response: GoogleAuthResponse) => void;
  onError?: (error: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError,
  className = "",
  size = "md",
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/auth/google`;
      sessionStorage.setItem("auth_redirect", window.location.pathname);
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error("Google login error:", error);
      onError?.("Failed to initiate Google login");
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-4 py-2.5 text-sm";
      case "lg":
        return "px-8 py-4 text-lg";
      default:
        return "px-6 py-3.5 text-base";
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className={`
        group w-full flex items-center justify-center gap-3
        bg-white dark:bg-gray-800 
        border-2 border-gray-200 dark:border-gray-700
        hover:border-gray-300 dark:hover:border-gray-600
        hover:bg-gray-50 dark:hover:bg-gray-750
        text-gray-700 dark:text-gray-200
        font-semibold rounded-xl
        transition-all duration-200
        shadow-sm hover:shadow-md
        focus:outline-none focus:ring-4 focus:ring-blue-500/10
        transform hover:-translate-y-0.5
        ${getButtonSizeClasses()}
        ${isLoading ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" className="w-5 h-5 group-hover:scale-110 transition-transform">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>Continue with Google</span>
        </>
      )}
    </button>
  );
};

export default GoogleLoginButton;
