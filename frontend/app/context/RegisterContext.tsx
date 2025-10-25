"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
}

interface RegisterContextType {
  registerData: RegisterData | null;
  setRegisterData: (data: RegisterData) => void;
  clearRegisterData: () => void;
}

const RegisterContext = createContext<RegisterContextType | undefined>(
  undefined
);

export function RegisterProvider({ children }: { children: ReactNode }) {
  const [registerData, setRegisterData] = useState<RegisterData | null>(null);

  const clearRegisterData = () => {
    setRegisterData(null);
  };

  return (
    <RegisterContext.Provider
      value={{ registerData, setRegisterData, clearRegisterData }}
    >
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegister() {
  const context = useContext(RegisterContext);
  if (context === undefined) {
    throw new Error("useRegister must be used within a RegisterProvider");
  }
  return context;
}
