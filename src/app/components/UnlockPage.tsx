import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Instagram, Linkedin, Lock, Unlock, CheckCircle, AlertCircle } from "lucide-react";
import { CertificatePreview } from "./CertificatePreview";

export function UnlockPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const formData = location.state;

    // Use simple local state for unlock status
    // In a real production app with auth, this would be saved to a database.
    // For this public generator, we'll just track it in the session.
    const [instagramClicked, setInstagramClicked] = useState(false);
    const [linkedinClicked, setLinkedinClicked] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if no data
    useEffect(() => {
        if (!formData) {
            navigate("/");
        }
    }, [formData, navigate]);

    // Check if both are clicked to unlock
    useEffect(() => {
        if (instagramClicked && linkedinClicked) {
            setIsUnlocked(true);
        }
    }, [instagramClicked, linkedinClicked]);

    const handleSocialClick = (platform: "instagram" | "linkedin", url: string) => {
        // 1. Open Link
        window.open(url, "_blank");

        // 2. Update Local State
        if (platform === "instagram") {
            setInstagramClicked(true);
        } else {
            setLinkedinClicked(true);
        }
    };

    const handleGenerate = async () => {
        setError(null);
        setIsGenerating(true);

        // Simulate verification delay
        setTimeout(() => {
            setIsGenerating(false);
            if (isUnlocked) {
                setShowPreview(true);
            } else {
                setError("Please follow both pages to unlock.");
            }
        }, 800);
    };

    if (!formData) return null;

    if (showPreview) {
        return (
            <CertificatePreview
                studentName={formData.studentName}
                collegeName={formData.collegeName}
                eventName={formData.eventName}
                paperTitle={formData.paperTitle}
                onReset={() => navigate("/")}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center p-4 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center"
            >
                <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                        {isUnlocked ? (
                            <Unlock className="w-8 h-8 text-blue-600" />
                        ) : (
                            <Lock className="w-8 h-8 text-blue-600" />
                        )}
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {isUnlocked ? "Certificate Unlocked!" : "Unlock Your Certificate"}
                </h2>

                <p className="text-gray-600 mb-8">
                    {isUnlocked
                        ? "Thank you for following us! You can now generate and download your certificate."
                        : "Please follow our social media pages to unlock your certificate download."
                    }
                </p>

                <div className="space-y-4 mb-8">
                    {/* Instagram Button */}
                    <button
                        onClick={() => handleSocialClick("instagram", "https://www.instagram.com/official_skacas?igsh=bndsYWM1MmZqY2hi")}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${instagramClicked
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-pink-500 hover:bg-pink-50 text-gray-700"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Instagram className={`w-6 h-6 ${instagramClicked ? "text-green-600" : "text-pink-600"}`} />
                            <span className="font-semibold">Follow on Instagram</span>
                        </div>
                        {instagramClicked && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </button>

                    {/* LinkedIn Button */}
                    <button
                        onClick={() => handleSocialClick("linkedin", "https://www.linkedin.com/school/srikrishna-adithya-college-of-arts-and-science/")}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${linkedinClicked
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Linkedin className={`w-6 h-6 ${linkedinClicked ? "text-green-600" : "text-blue-600"}`} />
                            <span className="font-semibold">Follow on LinkedIn</span>
                        </div>
                        {linkedinClicked && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGenerate}
                    disabled={!isUnlocked || isGenerating}
                    className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all duration-200 ${isUnlocked && !isGenerating
                        ? "bg-[#DAA520] text-white shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:-translate-y-1"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                >
                    {isGenerating ? "Verifying & Generating..." : "Generate Certificate"}
                </button>
            </motion.div>
        </div>
    );
}
