import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth";
import { theme } from "../../theme/theme";
import { useNavigate } from "react-router-dom";
import CompanyLogo from "../../assets/caerus-logo.png"; // Adjust path to your logo

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const reduxAuthState = useSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    console.log("Context API State (useAuth):", { isAuthenticated, user });
    console.log("Redux Auth State:", reduxAuthState);
  }, []);

  const announcements = [
    {
      id: 1,
      title: "New HR Policy Integration",
      description:
        "We've added support for a new HR policy provider. Connect your accounts now!",
      icon: "📋",
    },
    {
      id: 2,
      title: "Payroll Updates",
      description:
        "Check out the latest improvements to our payroll system, including enhanced automation features.",
      icon: "💰",
    },
  ];

  return (
    <div
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: theme.spacing.xl }}>
        <img
          src={CompanyLogo}
          alt="Company Logo"
          style={{
            height: isMobile ? "85px" : "140px", // increased height
            width: isMobile ? "auto" : "auto", // keeps aspect ratio
            maxWidth: "240px", // ensures it doesn’t stretch too much
            marginBottom: theme.spacing.lg, // slightly larger spacing
            objectFit: "contain", // maintains proportion
          }}
        />

        <h1
          style={{
            color: theme.colors.text.primary,
            fontSize: isMobile ? "28px" : "48px",
            fontWeight: "800",
            marginBottom: theme.spacing.sm,
          }}
        >
          Welcome to HRMS, {user?.name}! 👋
        </h1>
        <p
          style={{
            color: theme.colors.text.secondary,
            fontSize: isMobile ? "14px" : "18px",
            maxWidth: isMobile ? "100%" : "600px",
            margin: "0 auto",
          }}
        >
          Stay connected and manage your work efficiently. Access tools,
          information, and updates to stay productive and aligned with your
          team.
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ textAlign: "center", marginBottom: theme.spacing.xl }}>
        <h2
          style={{
            color: theme.colors.text.primary,
            fontSize: isMobile ? "20px" : "24px",
            fontWeight: "700",
            marginBottom: theme.spacing.md,
          }}
        >
          Quick Actions
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: theme.spacing.md,
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.white,
              padding: isMobile ? "10px 20px" : "12px 24px",
              border: "none",
              borderRadius: theme.borderRadius.medium,
              cursor: "pointer",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "600",
            }}
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate("/employee-profile/" + user?.id)}
            style={{
              backgroundColor: theme.colors.grayLight,
              color: theme.colors.text.primary,
              padding: isMobile ? "10px 20px" : "12px 24px",
              border: "none",
              borderRadius: theme.borderRadius.medium,
              cursor: "pointer",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "600",
            }}
          >
            View Profile
          </button>
        </div>
      </div>

      {/* Company News & Announcements */}
      <div>
        <h2
          style={{
            color: theme.colors.text.primary,
            fontSize: isMobile ? "20px" : "24px",
            fontWeight: "700",
            marginBottom: theme.spacing.lg,
          }}
        >
          Company News & Announcements
        </h2>
        <div
          style={{
            display: "grid",
            gap: theme.spacing.lg,
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          }}
        >
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              style={{
                backgroundColor: theme.colors.surface,
                padding: theme.spacing.lg,
                borderRadius: theme.borderRadius.large,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  marginBottom: theme.spacing.sm,
                }}
              >
                {announcement.icon}
              </div>
              <h3
                style={{
                  color: theme.colors.text.primary,
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: "600",
                  marginBottom: theme.spacing.sm,
                }}
              >
                {announcement.title}
              </h3>
              <p
                style={{
                  color: theme.colors.text.secondary,
                  fontSize: isMobile ? "12px" : "14px",
                }}
              >
                {announcement.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
