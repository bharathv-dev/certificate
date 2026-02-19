import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1F2A44] text-white/50 py-6 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="h-px w-20 mx-auto mb-4 bg-gradient-to-r from-transparent via-[#DAA520]/40 to-transparent" />
        <p
          className="flex items-center justify-center gap-1"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 400 }}
        >
          Made with <Heart className="w-3 h-3 text-[#DAA520] fill-[#DAA520]" /> for Adividya 2026
        </p>
        <p
          className="mt-1"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 400 }}
        >
          Sri Krishna Adithya College of Arts and Science, Coimbatore
        </p>
      </div>
    </footer>
  );
}
