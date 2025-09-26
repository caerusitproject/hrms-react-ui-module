import React, { useState } from "react";
import { theme } from "../../theme/theme"; // Adjust path based on your project structure

const Input = ({ 
  label, 
  name, 
  type = "text", 
  register, 
  required = false, 
  errors, 
  disabled = false,
  labelColor = "#333333",
  inputColor = "#222",
  defaultBorderColor = theme.colors.lightGray,
  activeBorderColor = theme.colors.primary,
  errorBorderColor = theme.colors.error, // Added for error state
  backgroundColor = "#ffffff",
  borderWidth = "0.5px", // Default, will override to 1px for errors
  className = "",
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const error = errors?.[name.split('.')[0]]?.[name.split('.')[1]];

  return (
    <div style={{ marginBottom: theme.spacing.md, maxWidth: "500px" }} className={className}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "500",
            color: labelColor,
            marginBottom: theme.spacing.xs,
          }}
        >
          {label} {required && <span style={{ color: theme.colors.error }}>*</span>}
        </label>
      )}
      <input
        type={type}
        {...register(name, { required: required ? `${label} is required` : false })}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: "100%",
          padding: theme.spacing.sm,
          border: error 
            ? `1px solid ${errorBorderColor}` // 1px red border for errors
            : `${borderWidth} solid ${isFocused ? activeBorderColor : defaultBorderColor}`,
          outline: "none",
          borderRadius: theme.borderRadius.small,
          fontSize: "16px",
          color: inputColor,
          backgroundColor,
          boxSizing: "border-box",
        }}
        {...rest}
      />
      {error && (
        <p style={{ color: theme.colors.error, fontSize: "12px", marginTop: theme.spacing.xs }}>
          {error.message}
        </p>
      )}
    </div>
  );
};

export default Input;