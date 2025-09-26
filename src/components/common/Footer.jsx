// Footer.jsx
import React from "react";
import { theme } from "../../theme/theme";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: theme.colors.white,
        borderTop: `1px solid ${theme.colors.lightGray}`,
        borderRadius: "15px",
        padding: `${theme.spacing.md} ${theme.spacing.xl}`,
        marginTop: "auto",
        marginBottom: "10px",
        marginLeft: `${theme.spacing.md}`,
         marginRight: `${theme.spacing.md}`,
        textAlign: "center",
        boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
          flexWrap: "wrap",
          gap: theme.spacing.md,
        }}
      >
        {/* Left side - Copyright */}
        <div
          style={{
            color: theme.colors.primaryLight,
            fontSize: "13px",
          }}
        >
          © {currentYear} Caerus. All rights reserved.
        </div>

        {/* Center - Company Info */}
        <div
          style={{
            color: theme.colors.text.primary,
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          Employee Management System
        </div>

        

        {/* Right side - Version/Links */}
        <div
          style={{
            display: "flex",
            gap: theme.spacing.xs,
            alignItems: "center",
           flexDirection: "column",
          }}
        >
          <span
            style={{
              color: theme.colors.primaryLight,
              fontSize: "12px",
            }}
          >
            v1.0.0
          </span>
          <a
            href="/privacy"
            style={{
              color: theme.colors.primaryLight,
              fontSize: "12px",
              textDecoration: "none",
              transition: theme.transitions.fast,
            }}
            onMouseEnter={(e) => {
              e.target.style.color = theme.colors.primary;
            }}
            onMouseLeave={(e) => {
              e.target.style.color = theme.colors.text.secondary;
            }}
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            style={{
              color: theme.colors.primaryLight,
              fontSize: "12px",
              textDecoration: "none",
              transition: theme.transitions.fast,
            }}
            onMouseEnter={(e) => {
              e.target.style.color = theme.colors.primary;
            }}
            onMouseLeave={(e) => {
              e.target.style.color = theme.colors.text.secondary;
            }}
          >
            Terms of Service
          </a>
        </div>
      </div>

      {/* Mobile responsive layout */}
      <style>
        {`
          @media (max-width: 768px) {
            footer > div {
              flex-direction: column;
              text-align: center;
            }
            footer > div > div:last-child {
              justify-content: center;
            }
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;