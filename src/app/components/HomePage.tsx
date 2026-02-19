import { useNavigate } from "react-router";
import { Header } from "./Header";
import { CertificateForm } from "./CertificateForm";
import { Footer } from "./Footer";

interface FormData {
  studentName: string;
  collegeName: string;
  eventName: string;
  paperTitle: string;
  mobileNumber: string;
  email: string;
}

export function HomePage() {
  const navigate = useNavigate();

  const handleFormSubmit = (data: FormData) => {
    // Navigate to unlock page with form data
    navigate("/unlock", { state: data });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header / Landing Section */}
      <Header />

      {/* Form Section */}
      <CertificateForm onSubmit={handleFormSubmit} />

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
