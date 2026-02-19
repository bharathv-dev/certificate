import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SignatureData {
  principal: string | null;
}

interface SignatureContextType {
  signatures: SignatureData;
  setPrincipalSignature: (data: string | null) => Promise<void>;
  isUploading: boolean;
}

const STORAGE_KEY = "adividya_signatures";

const SignatureContext = createContext<SignatureContextType | null>(null);

export function SignatureProvider({ children }: { children: ReactNode }) {
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
    if (!data) {
      setSignatures((prev) => ({ ...prev, principal: null }));
      return;
    }

    // If it's already a URL (starts with http), just save it
    if (data.startsWith("http")) {
      setSignatures((prev) => ({ ...prev, principal: data }));
      return;
    }

    // Direct Cloudinary Upload (Frontend-only signed upload)
    setIsUploading(true);
    try {
      const CLOUD_NAME = "ddpxr28lh";
      const API_KEY = "836917184635664";
      const API_SECRET = "GUwD3-YVKK7VWItuF48ZGI59RhI";

      const timestamp = Math.round((new Date()).getTime() / 1000);
      const folder = "signatures";

      // Generate Signature: SHA-1 of `folder=signatures&timestamp=1234567890<api_secret>`
      const strToSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
      const msgBuffer = new TextEncoder().encode(strToSign);
      const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

      const formData = new FormData();
      formData.append("file", data);
      formData.append("api_key", API_KEY);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "Failed to upload signature");
      }

      const result = await response.json();
      if (result.secure_url) {
        setSignatures((prev) => ({ ...prev, principal: result.secure_url }));
      }
    } catch (error) {
      console.error("Error uploading signature:", error);
      alert("Failed to save signature. Please try again.");
    } finally {
      setIsUploading(false);
    }
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
