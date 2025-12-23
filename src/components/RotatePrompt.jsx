import React, { useState, useEffect } from "react";

const RotatePrompt = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    window.addEventListener("orientationchange", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("orientationchange", checkDevice);
    };
  }, []);

  if (!isMobile) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        color: "white",
        fontFamily: "JungleAdventurer, serif",
      }}
    >
      <div
        style={{
          fontSize: "64px",
          marginBottom: "20px",
          animation: "bounce 2s ease-in-out infinite",
        }}
      >
        💻
      </div>
      <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
        Please switch to desktop
      </h2>
      <p style={{ fontSize: "16px", opacity: 0.8 }}>
        This game is best played on desktop
      </p>
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
    </div>
  );
};

export default RotatePrompt;
