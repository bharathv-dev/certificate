import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import { Download, RotateCcw, CheckCircle } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Certificate, CERT_WIDTH, CERT_HEIGHT } from "./Certificate";

interface CertificatePreviewProps {
  studentName: string;
  collegeName: string;
  eventName: string;
  paperTitle: string;
  onReset: () => void;
}

export function CertificatePreview({
  studentName,
  collegeName,
  eventName,
  paperTitle,
  onReset,
}: CertificatePreviewProps) {
  const hiddenCertRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [scale, setScale] = useState(1);

  // Responsive scaling based on container width
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newScale = Math.min(1, containerWidth / CERT_WIDTH);
        setScale(newScale);
      }
    };

    updateScale();

    const observer = new ResizeObserver(() => {
      updateScale();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleDownload = useCallback(async () => {
    if (!hiddenCertRef.current) return;

    setIsDownloading(true);
    try {
      // Capture the hidden full-size certificate (no CSS transforms applied)
      const canvas = await html2canvas(hiddenCertRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#FFFFFF",
        logging: false,
        width: CERT_WIDTH,
        height: CERT_HEIGHT,
        windowWidth: CERT_WIDTH + 100,
        windowHeight: CERT_HEIGHT + 100,
        onclone: (clonedDoc) => {
          // html2canvas cannot parse oklch() color functions used by Tailwind v4.
          // Strategy: Extract font definitions (which we need) and then remove ALL other styles
          // (which contain oklch and are not needed for the inline-styled certificate).

          // Explicitly add Google Fonts to the cloned document head
          const fontLink = clonedDoc.createElement("link");
          fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Great+Vibes&family=Pinyon+Script&family=Inter:wght@300;400;500;600;700&display=swap";
          fontLink.rel = "stylesheet";
          clonedDoc.head.appendChild(fontLink);

          // Force waiting for fonts (though html2canvas usually handles this, specific injection helps)
          // We don't remove existing styles immediately to allow better capturing

          let fontCss = "";
          const styles = Array.from(clonedDoc.querySelectorAll("style"));

          styles.forEach((style) => {
            if (style.textContent) {
              // Extract @font-face blocks if anylocal ones exist
              const fontFaces = style.textContent.match(/@font-face\s*{[^}]*}/g);
              if (fontFaces) {
                fontCss += fontFaces.join("\n");
              }
            }
          });

          // Add a new style tag with just the fonts
          const newStyle = clonedDoc.createElement("style");
          newStyle.textContent = fontCss;
          clonedDoc.head.appendChild(newStyle);

          // Remove ALL original style tags to banish oklch
          styles.forEach((s) => s.remove());

          // Remove all external stylesheets except those explicitly for fonts
          const links = Array.from(clonedDoc.querySelectorAll("link[rel='stylesheet']"));
          for (const link of links) {
            const href = link.getAttribute("href") || "";
            if (!href.includes("fonts.googleapis.com") && !href.includes("fonts.css")) {
              link.remove();
            }
          }

          // Fallback: Check for inline styles with oklch on all elements
          const allElements = clonedDoc.getElementsByTagName("*");
          for (const el of allElements) {
            const style = el.getAttribute("style");
            if (style && style.includes("oklch")) {
              // Replace oklch(...) with a gray fallback
              el.setAttribute("style", style.replace(/oklch\([^)]+\)/g, "#808080"));
            }
          }
        },
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [CERT_WIDTH, CERT_HEIGHT],
      });

      pdf.addImage(imgData, "PNG", 0, 0, CERT_WIDTH, CERT_HEIGHT);
      pdf.save(`Adividya_2026_Certificate_${studentName.replace(/\s+/g, "_")}.pdf`);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  }, [studentName]);

  const scaledHeight = CERT_HEIGHT * scale;

  return (
    <section className="py-12 sm:py-16 px-4 bg-white" id="certificate-preview">
      <div className="max-w-5xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span
              className="text-green-600"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500 }}
            >
              Certificate Generated Successfully!
            </span>
          </div>
          <h2
            className="text-[#1F2A44] mb-2"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 600 }}
          >
            Your Certificate Preview
          </h2>
          <p
            className="text-gray-500"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 400 }}
          >
            Review your certificate below and download it as a PDF
          </p>
        </motion.div>

        {/* Responsive certificate container (visible preview) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div
            ref={containerRef}
            className="w-full mx-auto rounded-lg overflow-hidden"
            style={{
              maxWidth: `${CERT_WIDTH}px`,
              boxShadow: "0 20px 60px rgba(31, 42, 68, 0.15), 0 8px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: `${scaledHeight}px`,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  width: `${CERT_WIDTH}px`,
                  height: `${CERT_HEIGHT}px`,
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              >
                <Certificate
                  studentName={studentName}
                  collegeName={collegeName}
                  eventName={eventName}
                  paperTitle={paperTitle}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hidden full-size certificate for PDF capture (off-screen, no transforms) */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            left: "-9999px",
            top: "-9999px",
            width: `${CERT_WIDTH}px`,
            height: `${CERT_HEIGHT}px`,
            overflow: "hidden",
            pointerEvents: "none",
            opacity: 1,
          }}
        >
          <Certificate
            ref={hiddenCertRef}
            studentName={studentName}
            collegeName={collegeName}
            eventName={eventName}
            paperTitle={paperTitle}
          />
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          {/* Download Button */}
          <motion.button
            onClick={handleDownload}
            disabled={isDownloading}
            whileHover={{ scale: 1.03, boxShadow: "0 8px 25px rgba(31, 42, 68, 0.3)" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-lg text-white transition-all duration-300 disabled:opacity-70"
            style={{
              background: downloaded
                ? "linear-gradient(135deg, #16a34a, #15803d)"
                : "linear-gradient(135deg, #1F2A44, #2D3A5C)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.95rem",
              fontWeight: 600,
              boxShadow: "0 4px 15px rgba(31, 42, 68, 0.2)",
            }}
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Preparing PDF...
              </>
            ) : downloaded ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download Certificate (PDF)
              </>
            )}
          </motion.button>

          {/* Generate Another */}
          <motion.button
            onClick={onReset}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-[#DAA520] hover:text-[#B8860B] transition-all duration-300"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9rem",
              fontWeight: 500,
              background: "white",
            }}
          >
            <RotateCcw className="w-4 h-4" />
            Generate Another
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}