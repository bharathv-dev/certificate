import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Building2, Calendar, Sparkles, PenLine, FileText } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Importing from local firebase config

interface FormData {
  studentName: string;
  collegeName: string;
  eventName: string;
  paperTitle: string;
}

interface CertificateFormProps {
  onSubmit: (data: FormData) => void;
}

export const COLLEGES = [
  "Adithya Institute of Technology, Coimbatore",
  "Akshaya College of Arts and Science",
  "Akshaya College of Engineering and Technology",
  "Avinashilingam Institute for Home Science and Higher Education for Women",
  "Bannari Amman College of Arts and Science",
  "Bannari Amman Institute of Technology",
  "Bishop Ambrose College",
  "CMS College of Arts and Science",
  "CMS College of Engineering and Technology",
  "CMS Institute of Management Studies",
  "Coimbatore Institute of Engineering and Technology",
  "Coimbatore Institute of Technology",
  "CSI College of Engineering",
  "Dhirajlal Gandhi College of Technology",
  "Dr. G.R. Damodaran College of Science",
  "Dr. Mahalingam College of Engineering and Technology",
  "Dr. N.G.P. Arts and Science College",
  "Dr. SNS Rajalakshmi College of Arts and Science",
  "Dr. RV Arts and Science College",
  "Erode Sengunthar Engineering College",
  "Government Arts and Science College, Avinashi",
  "Government Arts College, Coimbatore (Autonomous)",
  "Government Arts and Science College, Thondamuthur",
  "Government College of Technology, Coimbatore",
  "GRD College of Arts and Science",
  "Hindusthan College of Arts and Science",
  "Hindusthan College of Engineering and Technology",
  "Hindusthan Institute of Technology",
  "Info Institute of Engineering",
  "JCT College of Engineering and Technology",
  "Jain University",
  "K.S. Rangasamy College of Arts and Science",
  "Karpagam Academy of Higher Education",
  "Karpagam Institute of Technology",
  "Kathir College of Arts and Science",
  "Kathir College of Engineering",
  "KG College of Arts and Science",
  "KG Institute of Technology",
  "KGISL Institute of Technology",
  "Kalaignar Karunanidhi Institute of Technology (KIT)",
  "Kangeyam Institute of Technology",
  "Kongu Arts and Science College",
  "Kongunadu Arts and Science College",
  "Kongunadu College of Engineering and Technology",
  "Kovai Kalaimagal College of Arts and Science",
  "KPR College of Arts, Science and Research",
  "KPR Institute of Engineering and Technology (KPRIET)",
  "KSR College of Arts and Sciences for Women",
  "Kumaraguru College of Liberal Arts and Science",
  "Kumaraguru College of Technology",
  "Kumaraguru School of Business",
  "Mahalingam College of Engineering and Technology",
  "Nachimuthu Polytechnic College",
  "Nallamuthu Gounder Mahalingam College, Pollachi",
  "Nehru Arts and Science College",
  "Nehru Institute of Engineering and Technology",
  "Nehru Institute of Information Technology and Management",
  "Nehru Institute of Technology",
  "NGM College, Pollachi",
  "Nirmala College for Women",
  "PPG College of Arts and Science",
  "PPG College of Pharmacy",
  "PPG College of Physiotherapy",
  "PSG College of Arts and Science",
  "PSGR Krishnammal College for Women",
  "R.V.S. College of Arts and Science",
  "Ramakrishna College of Arts and Science",
  "Ramakrishna Mission Vidyalaya",
  "Rathinam College of Arts and Science",
  "Rathinam College of Liberal Arts and Science",
  "Rathinam School of Architecture",
  "RVS Technical Campus, Coimbatore",
  "Sankara College of Science and Commerce",
  "Sardar Vallabhbhai Patel Institute of Textile and Management",
  "Sasurie College of Arts and Science",
  "Shri Nehru Maha Vidyalaya College of Arts and Science (SNMV)",
  "Shri Ramakrishna College of Arts and Science",
  "Sir Lakshmi College of Pharmacy",
  "SNS College of Technology",
  "SNS Rajalakshmi College of Arts and Science",
  "Sree Narayana Guru College",
  "Sree Sakthi Engineering College",
  "Sri Eshwar College of Engineering",
  "Sri GVG Visalakshi College for Women",
  "Sri Krishna Adithya College of Arts and Science",
  "Sri Krishna Arts and Science College",
  "Sri Krishna College of Arts and Science",
  "Sri Krishna College of Engineering and Technology",
  "Sri Lakshmi College of Pharmacy",
  "Sri Lakshmi College of Physiotherapy",
  "Sri Ramakrishna College of Arts and Science",
  "Sri Ramakrishna Engineering College",
  "Sri Ramakrishna Institute of Technology",
  "Sri Sai Ranganathan Engineering College",
  "Sri Shakthi Institute of Engineering and Technology",
  "St. Joseph’s College for Women",
  "Suguna College of Arts and Science",
  "Theeran Chinnamalai College of Arts and Science for Women",
  "Velalar College of Engineering and Technology",
  "VET Institute of Arts and Science College, Thindal",
  "VLB Janakiammal College of Arts and Science",
  "VSB Engineering College",
  "Yuvaguru College of Arts and Science",
  "Others",
];

const OTHER_VALUE = "__other__";

function toTitleCase(str: string): string {
  return str.replace(/(^|\s)\S/g, (char) => char.toUpperCase());
}

export function CertificateForm({ onSubmit }: CertificateFormProps) {
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    collegeName: "",
    eventName: "",
    paperTitle: "",
  });
  const [selectedCollege, setSelectedCollege] = useState("");
  const [customCollege, setCustomCollege] = useState("");
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const fetchedEvents: string[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.subEvents) {
            data.subEvents.forEach((subEvent: any) => {
              fetchedEvents.push(subEvent.name);
            });
          }
        });
        fetchedEvents.sort(); // Sort events alphabetically
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  const isOtherCollege = selectedCollege === OTHER_VALUE;
  const isPaperPresentation = formData.eventName === "Paper Presentation";

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.studentName.trim()) newErrors.studentName = "Student name is required";

    if (!selectedCollege) {
      newErrors.collegeName = "Please select a college";
    } else if (isOtherCollege && !customCollege.trim()) {
      newErrors.collegeName = "Please enter your college name";
    }

    if (!formData.eventName) newErrors.eventName = "Please select an event";

    if (isPaperPresentation && !formData.paperTitle.trim()) {
      newErrors.paperTitle = "Paper title is required for Paper Presentation";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Resolve actual college name
    const resolvedCollege = isOtherCollege ? customCollege.trim() : selectedCollege;
    const submitData = { ...formData, collegeName: resolvedCollege };
    setFormData(submitData);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Simulate network delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Direct submission - NO DATABASE VERIFICATION
      setIsSubmitting(false);
      onSubmit(submitData);

    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
      setErrors((prev) => ({ ...prev, studentName: "Error submitting form. Please try again." }));
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    // Clear paperTitle when switching away from Paper Presentation
    if (field === "eventName" && value !== "Paper Presentation") {
      setFormData((prev) => ({ ...prev, [field]: value, paperTitle: "" }));
      setErrors((prev) => ({ ...prev, paperTitle: undefined, ...(errors[field] ? { [field]: undefined } : {}) }));
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCollegeSelect = (value: string) => {
    setSelectedCollege(value);
    if (value !== OTHER_VALUE) {
      setFormData((prev) => ({ ...prev, collegeName: value }));
      setCustomCollege("");
    } else {
      setFormData((prev) => ({ ...prev, collegeName: "" }));
    }
    if (errors.collegeName) {
      setErrors((prev) => ({ ...prev, collegeName: undefined }));
    }
  };

  const handleCustomCollegeChange = (value: string) => {
    const titleCased = toTitleCase(value);
    setCustomCollege(titleCased);
    setFormData((prev) => ({ ...prev, collegeName: titleCased }));
    if (errors.collegeName) {
      setErrors((prev) => ({ ...prev, collegeName: undefined }));
    }
  };

  const inputBase =
    "w-full px-4 py-3 pl-11 rounded-lg border bg-white transition-all duration-200 outline-none";
  const inputNormal = "border-gray-200 focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20";
  const inputError = "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200";

  return (
    <section className="py-12 sm:py-16 px-4 bg-[#F7F8FA]" id="form-section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-xl mx-auto"
      >
        {/* Section heading */}
        <div className="text-center mb-8">
          <h2
            className="text-[#1F2A44] mb-2"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 600 }}
          >
            Enter Your Details
          </h2>
          <p
            className="text-gray-500"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 400 }}
          >
            Fill in the form below to generate your participation certificate
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg shadow-black/5 border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Student Name */}
            <div>
              <label
                className="block text-[#1F2A44] mb-1.5"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500 }}
              >
                Student Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.studentName}
                  onChange={(e) => handleChange("studentName", e.target.value)}
                  className={`${inputBase} ${errors.studentName ? inputError : inputNormal} `}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}
                />
              </div>
              {errors.studentName && (
                <p className="mt-1 text-red-500" style={{ fontSize: "0.78rem" }}>
                  {errors.studentName}
                </p>
              )}
            </div>

            {/* College Name */}
            <div>
              <label
                className="block text-[#1F2A44] mb-1.5"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500 }}
              >
                College Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                <select
                  value={selectedCollege}
                  onChange={(e) => handleCollegeSelect(e.target.value)}
                  className={`${inputBase} appearance - none cursor - pointer ${errors.collegeName && !isOtherCollege ? inputError : inputNormal
                    } ${!selectedCollege ? "text-gray-400" : "text-gray-900"} `}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}
                >
                  <option value="" disabled>
                    Select your college
                  </option>
                  {COLLEGES.map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                  <option value={OTHER_VALUE}>Other (Type your college name)</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Custom college name input (shown when "Other" is selected) */}
              <AnimatePresence>
                {isOtherCollege && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="relative mt-2.5">
                      <PenLine className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Type your college name"
                        value={customCollege}
                        onChange={(e) => handleCustomCollegeChange(e.target.value)}
                        className={`${inputBase} ${errors.collegeName && isOtherCollege ? inputError : inputNormal
                          } `}
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}
                        autoFocus
                      />
                    </div>
                    <p
                      className="mt-1 text-gray-400"
                      style={{ fontSize: "0.72rem", fontFamily: "'Inter', sans-serif" }}
                    >
                      First letter of each word will be auto-capitalized
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {errors.collegeName && (
                <p className="mt-1 text-red-500" style={{ fontSize: "0.78rem" }}>
                  {errors.collegeName}
                </p>
              )}
            </div>

            {/* Event Name */}
            <div>
              <label
                className="block text-[#1F2A44] mb-1.5"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500 }}
              >
                Event Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                <select
                  value={formData.eventName}
                  onChange={(e) => handleChange("eventName", e.target.value)}
                  className={`${inputBase} appearance - none cursor - pointer ${errors.eventName ? inputError : inputNormal
                    } ${!formData.eventName ? "text-gray-400" : "text-gray-900"} `}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}
                >
                  <option value="" disabled>
                    Select event
                  </option>
                  {isLoadingEvents ? (
                    <option disabled>Loading events...</option>
                  ) : (
                    events.map((event) => (
                      <option key={event} value={event}>
                        {event}
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.eventName && (
                <p className="mt-1 text-red-500" style={{ fontSize: "0.78rem" }}>
                  {errors.eventName}
                </p>
              )}
            </div>

            {/* Paper Title — only shown when "Paper Presentation" is selected */}
            <AnimatePresence>
              {isPaperPresentation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div>
                    <label
                      className="block text-[#1F2A44] mb-1.5"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500 }}
                    >
                      Paper Title <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Enter the title of your paper"
                        value={formData.paperTitle}
                        onChange={(e) => {
                          const titleCased = toTitleCase(e.target.value);
                          handleChange("paperTitle", titleCased);
                        }}
                        className={`${inputBase} ${errors.paperTitle ? inputError : inputNormal} `}
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}
                        autoFocus
                      />
                    </div>
                    <p
                      className="mt-1 text-gray-400"
                      style={{ fontSize: "0.72rem", fontFamily: "'Inter', sans-serif" }}
                    >
                      First letter of each word will be auto-capitalized
                    </p>
                    {errors.paperTitle && (
                      <p className="mt-1 text-red-500" style={{ fontSize: "0.78rem" }}>
                        {errors.paperTitle}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(218, 165, 32, 0.35)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-lg text-white transition-all duration-300 flex items-center justify-center gap-2 mt-3 disabled:opacity-70"
              style={{
                background: "linear-gradient(135deg, #DAA520, #B8860B)",
                fontFamily: "'Inter', sans-serif",
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: "0 4px 15px rgba(218, 165, 32, 0.25)",
              }}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generating Certificate...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Certificate
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}