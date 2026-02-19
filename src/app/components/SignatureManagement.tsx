import { useState } from "react";
import { motion } from "motion/react";
import { PenTool, ArrowLeft, ShieldCheck, Info } from "lucide-react";
import { Link } from "react-router";
import { useSignatures } from "./SignatureContext";
import { SignaturePad } from "./SignaturePad";
import { SignatureAuth } from "./SignatureAuth";

export function SignatureManagement() {
  const [authenticated, setAuthenticated] = useState(false);
  const { signatures, setPrincipalSignature, isUploading } = useSignatures();

  if (!authenticated) {
    return <SignatureAuth onAuthenticated={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Mini Header */}
      <header className="bg-[#1F2A44] text-white">
        <div className="h-1.5 bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-[#DAA520] transition-colors duration-200 mb-5"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 500 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Certificate Generator
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#DAA520] to-[#B8860B] flex items-center justify-center shadow-lg">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                  fontWeight: 700,
                  lineHeight: 1.3,
                }}
              >
                <span className="bg-gradient-to-r from-[#DAA520] via-[#F5D076] to-[#DAA520] bg-clip-text text-transparent">
                  Signature Management
                </span>
              </h1>
              <p
                className="text-white/50"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 400 }}
              >
                Adividya 2026 &bull; Certificate Signatures
              </p>
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B]" />
      </header>

      {/* Content */}
      <main className="flex-1 py-10 sm:py-14 px-4 bg-[#F7F8FA]">
        <div className="max-w-4xl mx-auto">
          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-[#DAA520]/20 rounded-xl p-4 sm:p-5 mb-8 flex gap-3"
          >
            <div className="flex-shrink-0 mt-0.5">
              <Info className="w-5 h-5 text-[#DAA520]" />
            </div>
            <div>
              <p
                className="text-[#1F2A44] mb-1"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 600 }}
              >
                How Signatures Work
              </p>
              <p
                className="text-gray-500"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 400, lineHeight: 1.7 }}
              >
                Draw or upload signatures below. They will automatically appear on all certificates generated from this browser.
                Signatures are stored locally in your browser and persist across sessions.
              </p>
            </div>
          </motion.div>

          {/* Two Signature Pads */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">


            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SignaturePad
                label="Principal"
                subtitle="Sri Krishna Adithya College"
                savedSignature={signatures.principal}
                onSave={setPrincipalSignature}
                isLoading={isUploading}
              />
            </motion.div>
          </div>

          {/* Status Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-[#1F2A44]" />
              <h3
                className="text-[#1F2A44]"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 600 }}
              >
                Signature Status
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">


              <div className={`flex items-center gap-3 p-3 rounded-lg border ${signatures.principal ? "border-green-200 bg-green-50" : "border-gray-100 bg-gray-50"}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${signatures.principal ? "bg-green-500" : "bg-gray-300"}`} />
                <div>
                  <p
                    className="text-[#1F2A44]"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 500 }}
                  >
                    Dr. S. Palaniammal
                  </p>
                  <p
                    className={signatures.principal ? "text-green-600" : "text-gray-400"}
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 400 }}
                  >
                    {signatures.principal ? "Signature saved" : "No signature added"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Back button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-8 text-center"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-all duration-300 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #DAA520, #B8860B)",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem",
                fontWeight: 600,
                boxShadow: "0 4px 15px rgba(218, 165, 32, 0.25)",
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Certificate Generator
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1F2A44] text-white/50 py-5 px-4 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <div className="h-px w-20 mx-auto mb-3 bg-gradient-to-r from-transparent via-[#DAA520]/40 to-transparent" />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 400 }}>
            Sri Krishna Adithya College of Arts and Science, Coimbatore
          </p>
        </div>
      </footer>
    </div>
  );
}
