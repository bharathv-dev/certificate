import React from "react";
import certificateTemplate from "../../assets/ec114ad7126d04c50a2c6e9e418b261aa4855b24.png";
import adividyaLogo from "../../assets/adividya-logo.png";
import { useSignatures } from "./SignatureContext";

interface CertificateProps {
  studentName: string;
  collegeName: string;
  eventName: string;
  paperTitle?: string;
}

export const CERT_WIDTH = 1000;
export const CERT_HEIGHT = 710;

export const Certificate = React.forwardRef<HTMLDivElement, CertificateProps>(
  ({ studentName, collegeName, eventName, paperTitle }, ref) => {
    const isPaperPresentation = eventName === "Paper Presentation";
    const { signatures } = useSignatures();

    const [bgImage, setBgImage] = React.useState<string>(certificateTemplate);

    React.useEffect(() => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = certificateTemplate;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          try {
            const dataURL = canvas.toDataURL("image/png");
            setBgImage(dataURL);
          } catch (e) {
            console.warn("Could not convert image to base64", e);
          }
        }
      };
    }, []);

    return (
      <div
        ref={ref}
        style={{
          width: `${CERT_WIDTH}px`,
          height: `${CERT_HEIGHT}px`,
          position: "relative",
          background: "#FFFFFF",
          fontFamily: "'Inter', sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Certificate template background image */}
        <img
          src={bgImage}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        />

        {/* Watermark Logo */}
        <img
          src={adividyaLogo}
          alt="Watermark"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            opacity: 0.1,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* Dynamic content overlay — vertically centered between header area and signature area */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "12%",
            right: "12%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: "translateY(-24%)",
          }}
        >
          {/* "This is to certify that" */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              fontWeight: 400,
              color: "#888",
              letterSpacing: "1.5px",
              margin: "0 0 10px 0",
              textTransform: "uppercase",
            }}
          >
            This is to certify that
          </p>

          {/* Student Name */}
          <h2
            style={{
              fontFamily: "'Pinyon Script', cursive",
              fontSize: "40px",
              fontWeight: 400,
              color: "#1F2A44",
              margin: "0 0 12px 0", // Increased margin to separate from underline
              lineHeight: 1.2,
            }}
          >
            {studentName || "Student Name"}
          </h2>

          {/* Gold underline */}
          <div
            style={{
              width: "280px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #DAA520, transparent)",
              margin: "0 auto 16px", // Adjusted margin
            }}
          />

          {/* "of College Name" */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              fontWeight: 400,
              color: "#666",
              margin: "0 0 14px 0",
            }}
          >
            of{" "}
            <span style={{ fontWeight: 600, color: "#1F2A44" }}>
              {collegeName || "College Name"}
            </span>
          </p>

          {/* Body paragraph */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "12.5px",
              fontWeight: 400,
              color: "#555",
              lineHeight: 1.9,
              margin: "0 auto 16px",
              maxWidth: "620px",
            }}
          >
            for his/her participation in the event{" "}
            <span style={{ fontWeight: 600, color: "#1F2A44" }}>
              &ldquo;{eventName || "Event Name"}&rdquo;
            </span>
            {isPaperPresentation && paperTitle && (
              <>
                {" "}on the topic{" "}
                <span style={{ fontWeight: 600, color: "#B8860B" }}>
                  &ldquo;{paperTitle}&rdquo;
                </span>
              </>
            )}
            {" "}in{" "}
            <span style={{ fontWeight: 700, color: "#B8860B" }}>
              Adividya 2026
            </span>{" "}
            held on{" "}
            <span style={{ fontWeight: 600, color: "#1F2A44" }}>
              19 February 2026
            </span>{" "}
            at Sri Krishna Adithya College of Arts and Science campus.
          </p>

          {/* Event Badge */}
          <div style={{ marginBottom: "0", width: "100%", display: "flex", justifyContent: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center", // Vertical centering
                justifyContent: "center", // Horizontal centering
                padding: "8px 24px 16px 24px", // Increased bottom padding for optical alignment
                backgroundColor: "#1F2A44", // Fallback background
                background: "linear-gradient(135deg, #1F2A44, #263252)",
                borderRadius: "30px",
                border: "1px solid rgba(218, 165, 32, 0.4)",
                minWidth: "120px", // Increased min-width
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
              }}
            >
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "11px", // Slightly increased font size
                  fontWeight: 700, // Thicker font weight
                  color: "#FFD700", // Brighter gold for better visibility
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  marginTop: "0", // Reset margin
                  position: "relative",
                  zIndex: 10,
                  textShadow: "0px 1px 2px rgba(0, 0, 0, 0.3)", // Text shadow for better contrast
                }}
              >
                {eventName || "Event Name"}
              </span>
            </div>
          </div>
        </div>

        {/* Signature section */}
        <div
          style={{
            position: "absolute",
            bottom: "58px",
            left: "12%",
            right: "12%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >


          {/* Center seal */}
          <div
            style={{
              width: "62px",
              height: "62px",
              borderRadius: "50%",
              border: "2.5px solid #DAA520",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              background: "rgba(218, 165, 32, 0.04)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#DAA520"
              strokeWidth="1.5"
            >
              <path d="M12 15l-3 3 1-4.5L6 10h4.5L12 5l1.5 5H18l-4 3.5 1 4.5z" />
            </svg>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "5.5px",
                fontWeight: 600,
                color: "#DAA520",
                letterSpacing: "1px",
                marginTop: "1px",
              }}
            >
              VERIFIED
            </span>
          </div>

          {/* Principal */}
          <div style={{ textAlign: "center" }}>
            {/* Signature image */}
            {signatures.principal && (
              <img
                crossOrigin="anonymous"
                src={signatures.principal}
                alt="Principal Signature"
                style={{
                  width: "120px",
                  height: "50px",
                  objectFit: "contain",
                  marginBottom: "4px",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
            )}
            <div
              style={{
                width: "130px",
                height: "1px",
                background: "#1F2A44",
                marginBottom: "5px",
              }}
            />
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "10px",
                fontWeight: 600,
                color: "#1F2A44",
                margin: 0,
              }}
            >
              Dr. S. Palaniammal
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "7.5px",
                fontWeight: 400,
                color: "#888",
                margin: "2px 0 0",
              }}
            >
              Principal
            </p>
          </div>
        </div>
      </div>
    );
  }
);

Certificate.displayName = "Certificate";