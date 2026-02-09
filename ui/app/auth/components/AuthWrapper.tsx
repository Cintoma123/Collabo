"use client";

import React from "react";
import { useAuthModal } from "../hooks/useAuthModal";
import AuthModal from "./AuthModal";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isOpen, mode, openModal, closeModal } = useAuthModal();

  return (
    <>
      {children}
      <AuthModal
        isOpen={isOpen}
        onClose={closeModal}
        initialMode={mode}
      />
    </>
  );
};

export default AuthWrapper;