import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { theme } from "../../theme/theme";
import { COMPANY_INFO } from "../../utils/constants";
import CompanyLogo from "../../assets/caerus-logo.png";

const SideNav = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  const menuItems = [
    {
      path: "/home",
      label: "Home",
      icon: "🏠",
      key: "home",
      requiredRoles: ["EMPLOYEE", "TEAM MANAGER", "HR", "ADMIN"],
    },
    {
      path: "/employee-profile",
      label: "Profile",
      icon: "🏠",
      key: "profile",
      requiredRoles: ["EMPLOYEE", "TEAM MANAGER", "HR", "ADMIN"],
    },
    {
      path: "/about",
      label: "About",
      icon: "ℹ️",
      key: "about",
      requiredRoles: ["EMPLOYEE", "TEAM MANAGER", "HR", "ADMIN"],
    },
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: "📊",
      key: "dashboard",
      requiredRoles: ["TEAM MANAGER", "HR", "ADMIN"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    user?.role ? item.requiredRoles.includes(user.role) : false
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) onToggle();
  };

  return (
    <>
      {isMobile && !collapsed && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
          onClick={onToggle}
        />
      )}

      <div
        className={`sidebar ${!collapsed ? "open" : ""} sidebar-transition`}
        style={{
          width: collapsed ? "70px" : "260px",
          maxWidth: "90%",
          height: "100vh",
          backgroundColor: theme.colors.white,
          borderRight: `1px solid ${theme.colors.lightGray}`,
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 1000,
          transform:
            isMobile && collapsed ? "translateX(-100%)" : "translateX(0)",
          boxShadow: theme.shadows.medium,
          borderTopRightRadius: "25px", 
          borderBottomRightRadius: "25px", // Add this to curve the top-right corner
    overflow: "hidden", // Ensure content doesn't overflow the curve
        }}
      >
        <div
          style={{
            padding: isMobile ? theme.spacing.sm : theme.spacing.md, // Reduced padding for mobile
            borderBottom: `1px solid ${theme.colors.lightGray}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "80px",
            overflow: "visible",
          }}
        >
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={CompanyLogo}
                alt="Company Logo"
                style={{
                  height: isMobile ? "40px" : "48px", // Smaller height on mobile
                  width: isMobile ? "140px" : "180px", // Stretched width, adjusted for mobile
                  maxWidth: "100%", // Prevent overflow
                  objectFit: "contain",
                  position: "relative",
                  zIndex: 1,
                }}
              />
            </div>
          )}

          {!collapsed && (
            <button
              onClick={onToggle}
              style={{
                background: "none",
                border: "none",
                fontSize: isMobile ? "20px" : "24px", // Smaller icon on mobile
                cursor: "pointer",
                padding: isMobile ? theme.spacing.xs : theme.spacing.sm, // Reduced padding
                borderRadius: theme.borderRadius.small,
                color: collapsed
                  ? theme.colors.text.secondary
                  : theme.colors.primary,
                transition: theme.transitions.fast,
                marginLeft: isMobile ? theme.spacing.xs : theme.spacing.sm, // Reduced space between logo and button
              }}
            >
              ☰
            </button>
          )}
        </div>

        {/* User Info */}
        {!collapsed && user && (
          <div
            style={{
              padding: theme.spacing.lg,
              borderBottom: `1px solid ${theme.colors.lightGray}`,
              backgroundColor: theme.colors.background,
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: theme.borderRadius.round,
                  backgroundColor: theme.colors.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.colors.white,
                  fontWeight: "bold",
                  marginRight: theme.spacing.md,
                }}
              >
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <div
                  style={{
                    fontWeight: "600",
                    color: theme.colors.text.primary,
                    fontSize: "14px",
                  }}
                >
                  {user.name || "User"}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: theme.colors.text.secondary,
                  }}
                >
                  {user.email}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: theme.colors.text.secondary,
                  }}
                >
                  Role: {user.role || "N/A"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <div
          style={{
            flex: 1,
            paddingTop: theme.spacing.md,
            overflowY: "auto",
          }}
        >
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.key}
                onClick={() => handleNavigation(item.path)}
                style={{
                  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  backgroundColor: isActive
                    ? `${theme.colors.primary}15`
                    : "transparent",
                  borderRight: isActive
                    ? `4px solid ${theme.colors.primary}`
                    : "none",
                  color: isActive
                    ? theme.colors.primary
                    : theme.colors.text.primary,
                  fontWeight: isActive ? "600" : "400",
                  transition: theme.transitions.fast,
                  margin: `2px ${theme.spacing.sm}`,
                  borderRadius: theme.borderRadius.small,
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = theme.colors.gray;
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = "transparent";
                  }
                }}
              >
                <span
                  style={{
                    fontSize: "20px",
                    marginRight:
                      collapsed && !isMobile ? "0" : theme.spacing.md,
                    minWidth: "20px",
                    textAlign: "center",
                  }}
                >
                  {item.icon}
                </span>
                {(!collapsed || isMobile) && (
                  <span style={{ fontSize: "15px" }}>{item.label}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        {!collapsed && (
          <div
            style={{
              padding: theme.spacing.lg,
              borderTop: `1px solid ${theme.colors.lightGray}`,
              backgroundColor: theme.colors.background,
            }}
          >
            <button
              onClick={handleLogout}
              className="btn-secondary"
              style={{
                width: "100%",
                padding: theme.spacing.md,
                display: "flex",
                alignItems: "center",
                justifyContent:
                  collapsed && !isMobile ? "center" : "flex-start",
                fontSize: "14px",
                borderRadius: theme.borderRadius.large,
              }}
            >
              <span
                style={{
                  marginRight: collapsed && !isMobile ? "0" : theme.spacing.sm,
                  fontSize: "16px",
                }}
              >
                🚪
              </span>
              {(!collapsed || isMobile) && "Logout"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SideNav;
