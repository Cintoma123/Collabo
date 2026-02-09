"use client";

import { useState, useCallback } from "react";

export interface UseAuthModalReturn {
  isOpen: boolean;
  mode: "login" | "register" | "forgot-password";
  openModal: (mode?: "login" | "register" | "forgot-password") => void;
  closeModal: () => void;
  switchMode: (mode: "login" | "register" | "forgot-password") => void;
}

export const useAuthModal = (): UseAuthModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register" | "forgot-password">("login");

  const openModal = useCallback((initialMode: "login" | "register" | "forgot-password" = "login") => {
    setMode(initialMode);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Reset to login mode when closing
    setMode("login");
  }, []);

  const switchMode = useCallback((newMode: "login" | "register" | "forgot-password") => {
    setMode(newMode);
  }, []);

  return {
    isOpen,
    mode,
    openModal,
    closeModal,
    switchMode,
  };
};