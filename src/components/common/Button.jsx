import React from "react";
import { theme } from "../../theme/theme";

const Button = ({ type = "primary", disabled = false, onClick, children }) => {
  // Variant styles
  const getButtonStyle = () => {
    switch (type) {
      case "primary":
        return {
          backgroundColor: theme.colors.primary,
          color: "white",
          border: "none",
        };
      case "secondary":
        return {
          backgroundColor: "transparent",
          color: theme.colors.primary,
          border: `2px solid ${theme.colors.primary}`,
        };
      case "tertiary":
         return {
          backgroundColor: "transparent",
          color: theme.colors.text.secondary,
          border: `2px solid ${theme.colors.primary}`,
        };
      case "white":
        return {
          backgroundColor: "white",
          color: theme.colors.text.secondary,
          border: `2px solid ${theme.colors.text.secondary}`,
        };
      case "error":
        return {
          backgroundColor: theme.colors.error,
          color: "white",
          border: "none",
        };
      case "success":
        return {
          backgroundColor: theme.colors.success,
          color: "white",
          border: "none",
        };
      default:
        return {
          backgroundColor: theme.colors.primary,
          color: "white",
          border: "none",
        };
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px",
        borderRadius: "6px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: "14px",
        fontWeight: "600",
        fontFamily: theme.typography?.fontFamily || '"Roboto", "Arial", sans-serif', // Consistent font family
        opacity: disabled ? 0.7 : 1,
        ...getButtonStyle(),
      }}
    >
      {children}
    </button>
  );
};

export default Button;
