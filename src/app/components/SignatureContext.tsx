import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SignatureData {
  principal: string | null;
}

interface SignatureContextType {
  signatures: SignatureData;
  // Principal signature is now static, so we don't need a setter exposed to the app for it,
  // but if we want to keep the context shape compatible or allow future extensions:
  setPrincipalSignature: (data: string | null) => Promise<void>;
  isUploading: boolean;
}

const STORAGE_KEY = "adividya_signatures";

const SignatureContext = createContext<SignatureContextType | null>(null);

export function SignatureProvider({ children }: { children: ReactNode }) {
  // We keep the state structure but it won't be used for Principal anymore in the Certificate component
  // However, SignatureManagement might still try to access it.
  const [signatures, setSignatures] = useState<SignatureData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return { principal: null };
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(signatures));
    } catch {
      // ignore
    }
  }, [signatures]);

  const setPrincipalSignature = async (data: string | null) => {
    // No-op or local state only if we wanted to allow local overrides, 
    // but the requirement is "Use this for Principal", implying static.
    // We'll just update local state to avoid breaking calls, but it won't affect the Certificate which now uses the static asset.
    if (!data) {
      setSignatures((prev) => ({ ...prev, principal: null }));
      return;
    }
    setSignatures((prev) => ({ ...prev, principal: data }));
  };

  return (
    <SignatureContext.Provider
      value={{ signatures, setPrincipalSignature, isUploading }}
    >
      {children}
    </SignatureContext.Provider>
  );
}

export function useSignatures() {
  const ctx = useContext(SignatureContext);
  if (!ctx) throw new Error("useSignatures must be used within SignatureProvider");
  return ctx;
}
