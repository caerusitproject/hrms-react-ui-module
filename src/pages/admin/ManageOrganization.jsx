import React from "react";
import { theme } from "../../theme/theme";

const ManageOrganization = () => {
  const isMobile = window.innerWidth <= 768; // Simple check, consider moving to useEffect if state is needed

  return (
    <div
      style={{
        padding: isMobile ? `${theme.spacing.sm} ${theme.spacing.xs}` : `${theme.spacing.xl} ${theme.spacing.lg}`,
        maxWidth: "100%",
        width: "100%",
        boxSizing: "border-box",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: theme.spacing.xl,
        }}
      >
        <h1
          style={{
            color: theme.colors.text.primary,
            margin: 0,
            fontSize: "26px",
            fontWeight: "700",
          }}
        >
          Manage Organization
        </h1>
        <p
          style={{
            color: theme.colors.text.secondary,
            margin: "8px 0 0 0",
            fontSize: "14px",
          }}
        >
          Manage organizational settings and conduct appraisals for your team.
        </p>
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(400px, 1fr))",
          gap: isMobile ? theme.spacing.md : theme.spacing.lg,
          width: "100%",
        }}
      >
        {/* Manage Organizational Settings */}
        <div
          style={{
            padding: `${theme.spacing.md} ${theme.spacing.sm}`,
            backgroundColor: theme.colors.white,
            borderRadius: theme.borderRadius.small,
            boxShadow: theme.shadows.small,
            border: `1px solid ${theme.colors.lightGray}`,
            maxWidth: "100%",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <h3
            style={{
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.xs,
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Manage Organizational Settings
          </h3>
          <p
            style={{
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing.sm,
              fontSize: "13px",
              lineHeight: "1.4",
            }}
          >
            Configure company details, departments, and roles. This is a crucial
            step in organizing your team structure.
          </p>
          <button
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.white,
              padding: "10px 20px",
              border: "none",
              borderRadius: theme.borderRadius.small,
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.xs,
              width: "100%",
              justifyContent: "center",
            }}
          >
            🛠️ Start Settings
          </button>
        </div>

        {/* Conduct Team Appraisals */}
        <div
          style={{
            padding: `${theme.spacing.md} ${theme.spacing.sm}`,
            backgroundColor: theme.colors.white,
            borderRadius: theme.borderRadius.small,
            boxShadow: theme.shadows.small,
            border: `1px solid ${theme.colors.lightGray}`,
            maxWidth: "100%",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <h3
            style={{
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.xs,
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Manage Organizational Settings
          </h3>
          <p
            style={{
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing.sm,
              fontSize: "13px",
              lineHeight: "1.4",
            }}
          >
            Configure company details, departments, and roles. This is a crucial
            step in organizing your team structure.
          </p>
          <button
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.white,
              padding: "10px 20px",
              border: "none",
              borderRadius: theme.borderRadius.small,
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.xs,
              width: "100%",
              justifyContent: "center",
            }}
          >
            🛠️ Start Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageOrganization;