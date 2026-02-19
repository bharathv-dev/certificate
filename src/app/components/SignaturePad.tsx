import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Eraser, Save, CheckCircle, PenLine, Upload, ImageIcon } from "lucide-react";

interface SignaturePadProps {
  label: string;
  subtitle: string;
  savedSignature: string | null;
  onSave: (dataUrl: string | null) => void;
  isLoading?: boolean;
}

type Mode = "draw" | "upload";

export function SignaturePad({ label, subtitle, savedSignature, onSave, isLoading = false }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mode, setMode] = useState<Mode>("draw");
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  const CANVAS_W = 400;
  const CANVAS_H = 180;

  // Initialize canvas
  useEffect(() => {
    if (mode !== "draw") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    canvas.style.width = `${CANVAS_W}px`;
    canvas.style.height = `${CANVAS_H}px`;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Draw guideline
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(30, CANVAS_H - 40);
    ctx.lineTo(CANVAS_W - 30, CANVAS_H - 40);
    ctx.stroke();
    ctx.setLineDash([]);

    if (savedSignature && !uploadedPreview) {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Enable CORS for Cloudinary images
      img.onload = () => {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.strokeStyle = "#E5E7EB";
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(30, CANVAS_H - 40);
        ctx.lineTo(CANVAS_W - 30, CANVAS_H - 40);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
        setHasStrokes(true);
      };
      img.src = savedSignature;
    }
  }, [savedSignature, mode, uploadedPreview]);

  const getPos = useCallback(
    (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_W / rect.width;
      const scaleY = CANVAS_H / rect.height;

      if ("touches" in e) {
        const touch = e.touches[0];
        if (!touch) return null;
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY,
        };
      }
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const startDraw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const ctx = canvasRef.current?.getContext("2d");
      const pos = getPos(e);
      if (!ctx || !pos) return;

      setIsDrawing(true);
      setHasStrokes(true);
      setSaved(false);

      ctx.strokeStyle = "#1F2A44";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    },
    [getPos]
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!isDrawing) return;
      const ctx = canvasRef.current?.getContext("2d");
      const pos = getPos(e);
      if (!ctx || !pos) return;

      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    },
    [isDrawing, getPos]
  );

  const endDraw = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleClear = useCallback(() => {
    if (mode === "draw") {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      ctx.strokeStyle = "#E5E7EB";
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(30, CANVAS_H - 40);
      ctx.lineTo(CANVAS_W - 30, CANVAS_H - 40);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    setUploadedPreview(null);
    setHasStrokes(false);
    setSaved(false);
    onSave(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [onSave, mode]);

  const handleSave = useCallback(() => {
    if (mode === "draw") {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = CANVAS_W;
      tempCanvas.height = CANVAS_H;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      tempCtx.drawImage(canvas, 0, 0, CANVAS_W, CANVAS_H);
      const dataUrl = tempCanvas.toDataURL("image/png");
      onSave(dataUrl);
    } else if (uploadedPreview) {
      onSave(uploadedPreview);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [onSave, mode, uploadedPreview]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setUploadedPreview(dataUrl);
      setHasStrokes(true);
      setSaved(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const switchMode = useCallback((newMode: Mode) => {
    setMode(newMode);
    setSaved(false);
    // Don't clear saved data when switching — only reset the local input state
    if (newMode === "draw") {
      setUploadedPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      // hasStrokes will be set by useEffect if savedSignature exists
      if (!savedSignature) setHasStrokes(false);
    } else {
      setHasStrokes(!!uploadedPreview || !!savedSignature);
    }
  }, [savedSignature, uploadedPreview]);

  const canSave = mode === "draw" ? hasStrokes : !!uploadedPreview;

  return (
    <div className="bg-white rounded-xl shadow-lg shadow-black/5 border border-gray-100 p-6 sm:p-8">
      {/* Label */}
      <div className="mb-4">
        <h3
          className="text-[#1F2A44] mb-0.5"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 600 }}
        >
          {label}
        </h3>
        <p
          className="text-gray-500"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 400 }}
        >
          {subtitle}
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex rounded-lg bg-gray-100 p-1 mb-4 mx-auto" style={{ maxWidth: `${CANVAS_W}px` }}>
        <button
          onClick={() => switchMode("draw")}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md transition-all duration-200"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.8rem",
            fontWeight: mode === "draw" ? 600 : 400,
            background: mode === "draw" ? "#FFFFFF" : "transparent",
            color: mode === "draw" ? "#1F2A44" : "#888",
            boxShadow: mode === "draw" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}
        >
          <PenLine className="w-3.5 h-3.5" />
          Draw
        </button>
        <button
          onClick={() => switchMode("upload")}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md transition-all duration-200"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.8rem",
            fontWeight: mode === "upload" ? 600 : 400,
            background: mode === "upload" ? "#FFFFFF" : "transparent",
            color: mode === "upload" ? "#1F2A44" : "#888",
            boxShadow: mode === "upload" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload
        </button>
      </div>

      {/* Drawing Canvas */}
      {mode === "draw" && (
        <div
          className="relative rounded-lg border-2 border-dashed border-gray-200 overflow-hidden mx-auto"
          style={{ maxWidth: `${CANVAS_W}px` }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "auto",
              aspectRatio: `${CANVAS_W}/${CANVAS_H}`,
              display: "block",
              cursor: "crosshair",
              touchAction: "none",
            }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />

          {!hasStrokes && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p
                className="text-gray-300"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 400 }}
              >
                Draw your signature here
              </p>
            </div>
          )}

          {savedSignature && !saved && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 500 }}>
                Saved
              </span>
            </div>
          )}
        </div>
      )}

      {/* Upload Area */}
      {mode === "upload" && (
        <div
          className="mx-auto"
          style={{ maxWidth: `${CANVAS_W}px` }}
        >
          {/* File input trigger */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleFileUpload}
            className="hidden"
          />

          {uploadedPreview ? (
            <div className="relative rounded-lg border-2 border-dashed border-[#DAA520]/40 overflow-hidden bg-[#FDFAF3]">
              <div
                className="flex items-center justify-center p-4"
                style={{ minHeight: `${CANVAS_H}px` }}
              >
                <img
                  src={uploadedPreview}
                  alt="Uploaded signature"
                  style={{
                    maxWidth: "100%",
                    maxHeight: `${CANVAS_H - 20}px`,
                    objectFit: "contain",
                  }}
                />
              </div>
              {savedSignature && !saved && (
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 500 }}>
                    Saved
                  </span>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-lg border-2 border-dashed border-gray-200 hover:border-[#DAA520]/50 transition-colors duration-200 cursor-pointer bg-gray-50/50 hover:bg-[#FDFAF3]/50"
              style={{ minHeight: `${CANVAS_H}px` }}
            >
              <div className="flex flex-col items-center justify-center gap-3 py-8">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                </div>
                <div className="text-center">
                  <p
                    className="text-gray-500 mb-0.5"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500 }}
                  >
                    Click to upload e-signature
                  </p>
                  <p
                    className="text-gray-400"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 400 }}
                  >
                    PNG, JPG, WebP, or SVG
                  </p>
                </div>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-center gap-3 mt-5">
        <motion.button
          onClick={handleClear}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 transition-all duration-200"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500, background: "white" }}
        >
          <Eraser className="w-4 h-4" />
          Clear
        </motion.button>

        {mode === "upload" && !uploadedPreview && (
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[#DAA520]/30 text-[#B8860B] hover:border-[#DAA520] transition-all duration-200"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500, background: "white" }}
          >
            <Upload className="w-4 h-4" />
            Browse Files
          </motion.button>
        )}

        <motion.button
          onClick={handleSave}
          disabled={!canSave || isLoading}
          whileHover={{ scale: canSave && !isLoading ? 1.03 : 1 }}
          whileTap={{ scale: canSave && !isLoading ? 0.97 : 1 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: saved
              ? "linear-gradient(135deg, #16a34a, #15803d)"
              : "linear-gradient(135deg, #1F2A44, #2D3A5C)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.85rem",
            fontWeight: 500,
            boxShadow: canSave && !isLoading ? "0 4px 12px rgba(31, 42, 68, 0.2)" : "none",
          }}
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Signature
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
