import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Instagram, Linkedin, Lock, Unlock, CheckCircle, AlertCircle } from "lucide-react";
import { CertificatePreview } from "./CertificatePreview";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export function UnlockPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const formData = location.state;

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

    // Helper to find participant in Firestore
    const findParticipantInFirestore = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "events"));
            for (const eventDoc of querySnapshot.docs) {
                const eventData = eventDoc.data();
                if (eventData.subEvents) {
                    const subEvents = eventData.subEvents;
                    for (let sIdx = 0; sIdx < subEvents.length; sIdx++) {
                        if (subEvents[sIdx].name === formData.eventName) {
                            const participants = subEvents[sIdx].participants || [];
                            for (let pIdx = 0; pIdx < participants.length; pIdx++) {
                                const p = participants[pIdx];
                                // Match by Email
                                if (p.email && p.email.toLowerCase() === formData.email.toLowerCase()) {
                                    return {
                                        docRef: eventDoc.ref,
                                        subEvents,
                                        sIdx,
                                        participants,
                                        pIdx,
                                        participant: p
                                    };
                                }
                            }
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Error searching Firestore:", err);
        }
        return null;
    };

    // Check initial status on load
    useEffect(() => {
        if (!formData) return;
        const fetchStatus = async () => {
            const found = await findParticipantInFirestore();
            if (found && found.participant) {
                const { participant } = found;
                if (participant.instagramClicked) setInstagramClicked(true);
                if (participant.linkedinClicked) setLinkedinClicked(true);
                if (participant.instagramClicked && participant.linkedinClicked) setIsUnlocked(true);
            }
        };
        fetchStatus();
    }, [formData]);

    const updateFirestoreStatus = async (platform: "instagram" | "linkedin") => {
        try {
            const found = await findParticipantInFirestore();
            if (found) {
                const { docRef, subEvents, sIdx, participants, pIdx } = found;

                // Update the specific participant object
                if (platform === "instagram") participants[pIdx].instagramClicked = true;
                if (platform === "linkedin") participants[pIdx].linkedinClicked = true;

                if (participants[pIdx].instagramClicked && participants[pIdx].linkedinClicked) {
                    participants[pIdx].socialUnlockCompleted = true;
                }

                // Update the subEvent's participants array
                subEvents[sIdx].participants = participants;

                // Write back to Firestore
                await updateDoc(docRef, { subEvents });
            }
        } catch (err) {
            console.error("Failed to update Firestore:", err);
        }
    };

    const handleSocialClick = async (platform: "instagram" | "linkedin", url: string) => {
        // 1. Open Link
        window.open(url, "_blank");

        // 2. Update Local State
        if (platform === "instagram") {
            setInstagramClicked(true);
            if (linkedinClicked) setIsUnlocked(true);
        } else {
            setLinkedinClicked(true);
            if (instagramClicked) setIsUnlocked(true);
        }

        // 3. Update Firestore (Backround)
        await updateFirestoreStatus(platform);
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
