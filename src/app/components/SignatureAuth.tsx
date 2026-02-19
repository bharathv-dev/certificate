import { useState } from "react";
import { motion } from "motion/react";
import { Lock, Eye, EyeOff, ShieldAlert, LogIn } from "lucide-react";

interface SignatureAuthProps {
  onAuthenticated: () => void;
}

const VALID_ID = "adividya2026";
const VALID_PASSWORD = "04skacas@890";

export function SignatureAuth({ onAuthenticated }: SignatureAuthProps) {
  const [credId, setCredId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!credId.trim() || !password.trim()) {
      setError("Please enter both Credential ID and Password.");
      return;
    }

    setIsLoading(true);
    // Simulate a brief check
    await new Promise((r) => setTimeout(r, 600));

    if (credId.trim() === VALID_ID && password === VALID_PASSWORD) {
      onAuthenticated();
    } else {
      setError("Invalid Credential ID or Password. Access denied.");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{
        background: "linear-gradient(135deg, #1F2A44 0%, #2D3A5C 50%, #1F2A44 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Subtle background pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Gold top bar */}
        <div className="h-1.5 rounded-t-2xl bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B]" />

        <div className="bg-white rounded-b-2xl shadow-2xl shadow-black/30 p-8 sm:p-10">
          {/* Lock icon */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1F2A44] to-[#2D3A5C] flex items-center justify-center shadow-lg">
              <Lock className="w-7 h-7 text-[#DAA520]" />
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-center text-[#1F2A44] mb-1"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700 }}
          >
            Signature Management
          </h1>
          <p
            className="text-center text-gray-400 mb-7"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 400 }}
          >
            Authorized access only &bull; Adividya 2026
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Credential ID */}
            <div>
              <label
                className="block text-[#1F2A44] mb-1.5"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 500 }}
              >
                Credential ID
              </label>
              <input
                type="text"
                value={credId}
                onChange={(e) => { setCredId(e.target.value); setError(""); }}
                placeholder="Enter your credential ID"
                autoComplete="off"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-[#1F2A44] placeholder-gray-400 focus:border-[#DAA520] focus:bg-white focus:outline-none transition-all duration-200"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 400 }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-[#1F2A44] mb-1.5"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 500 }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter password"
                  autoComplete="off"
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-200 bg-gray-50 text-[#1F2A44] placeholder-gray-400 focus:border-[#DAA520] focus:bg-white focus:outline-none transition-all duration-200"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 400 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1F2A44] transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200"
              >
                <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p
                  className="text-red-600"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 500 }}
                >
                  {error}
                </p>
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-white transition-all duration-300 disabled:opacity-70 mt-2"
              style={{
                background: "linear-gradient(135deg, #1F2A44, #2D3A5C)",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.92rem",
                fontWeight: 600,
                boxShadow: "0 4px 15px rgba(31, 42, 68, 0.25)",
              }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  <LogIn className="w-4.5 h-4.5" />
                  Access Signatures
                </>
              )}
            </motion.button>
          </form>

          {/* Security note */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p
              className="text-center text-gray-400"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 400, lineHeight: 1.6 }}
            >
              This area is restricted to authorized event coordinators only.
              <br />
              Contact the organizing committee for access credentials.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Footer text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-white/30 text-center"
        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 400 }}
      >
        Sri Krishna Adithya College of Arts and Science, Coimbatore
      </motion.p>
    </div>
  );
}
