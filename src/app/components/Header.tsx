import { GraduationCap, Award, ChevronDown } from "lucide-react";
import { motion } from "motion/react";

export function Header() {
  return (
    <header className="relative overflow-hidden bg-[#1F2A44] text-white">
      {/* Decorative gold line at top */}
      <div className="h-1.5 bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center relative z-10">
        {/* College Logo Area */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#DAA520] to-[#B8860B] flex items-center justify-center shadow-lg">
            <GraduationCap className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[#DAA520] tracking-[0.2em] uppercase mb-2"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 500 }}
        >
          Sri Krishna Adithya College of Arts and Science
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-white/60 mb-6"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 400, letterSpacing: "0.1em" }}
        >
          Coimbatore, Tamil Nadu
        </motion.p>

        {/* Event Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-3"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            letterSpacing: "0.02em",
            lineHeight: 1.2,
          }}
        >
          <span className="bg-gradient-to-r from-[#DAA520] via-[#F5D076] to-[#DAA520] bg-clip-text text-transparent">
            Adividya 2026
          </span>
        </motion.h1>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center gap-3 mb-5"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#DAA520]/60" />
          <Award className="w-5 h-5 text-[#DAA520]" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#DAA520]/60" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-white/80"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
            fontWeight: 400,
            letterSpacing: "0.05em",
          }}
        >
          Participation Certificate Generator
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-white/40 mt-3"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 400 }}
        >
          19 February 2026 &bull; Generate & Download Instantly
        </motion.p>

        {/* Scroll down indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          onClick={() => document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" })}
          className="mt-8 mx-auto flex flex-col items-center gap-1 text-white/40 hover:text-[#DAA520] transition-colors duration-300 cursor-pointer"
        >
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 400, letterSpacing: "0.1em" }}>
            Get Started
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />

      {/* Decorative gold line at bottom */}
      <div className="h-1 bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B]" />
    </header>
  );
}
