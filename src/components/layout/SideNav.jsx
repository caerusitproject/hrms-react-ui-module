// SideNav.jsx (updated with highlight styling and nested route support)
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { theme } from "../../theme/theme";
import { COMPANY_INFO } from "../../utils/constants";
import { menuItems } from "./menuItems"; // Import from separate file
import CompanyLogo from "../../assets/caerus-logo.png";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const SideNav = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

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

  const getIconStyle = (isActive) => ({
    fontSize: collapsed && !isMobile ? "23px" : "20px",
    marginRight: collapsed && !isMobile ? "0" : theme.spacing.md,
    minWidth: "20px",
    textAlign: "center",
    color: isActive ? theme.colors.primary : theme.colors.text.secondary,
  });

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
          width: collapsed ? "80px" : "260px",
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
          borderBottomRightRadius: "25px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: isMobile ? theme.spacing.sm : theme.spacing.md,
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
                  height: isMobile ? "40px" : "48px",
                  width: isMobile ? "140px" : "180px",
                  maxWidth: "100%",
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
                fontSize: isMobile ? "20px" : "24px",
                cursor: "pointer",
                padding: isMobile ? theme.spacing.xs : theme.spacing.sm,
                borderRadius: theme.borderRadius.small,
                color: collapsed
                  ? theme.colors.text.secondary
                  : theme.colors.primary,
                transition: theme.transitions.fast,
                marginLeft: isMobile ? theme.spacing.xs : theme.spacing.sm,
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
              padding: isMobile ? `${theme.spacing.sm}` : `${theme.spacing.md}`,
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
            // Enhanced isActive logic for nested routes
            const isActive = (() => {
              const currentPath = location.pathname;

              // Direct match
              if (currentPath === item.path) return true;

              // Handle nested routes - check if current path starts with menu item path
              if (item.path !== "/" && currentPath.startsWith(item.path)) {
                const remainingPath = currentPath.substring(item.path.length);
                // Check if it's a proper nested route (starts with / or is empty)
                if (remainingPath === "" || remainingPath.startsWith("/")) {
                  return true;
                }
              }

              // Special case for employee-profile highlighting when on employee routes
              if (
                item.path === "/employee-profile" &&
                currentPath.startsWith("/employee")
              ) {
                return true;
              }

              return false;
            })();

            return (
              <div
                key={item.key}
                onClick={() => handleNavigation(item.path)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    collapsed && !isMobile ? "center" : "flex-start",
                  flexDirection: collapsed && !isMobile ? "column" : "row",
                  padding:
                    collapsed && !isMobile
                      ? `${theme.spacing.sm} ${theme.spacing.xs}`
                      : `${theme.spacing.md} ${theme.spacing.lg}`,
                  cursor: "pointer",
                  // Replace this section:
                  backgroundColor: isActive
                    ? collapsed && !isMobile
                      ? `${theme.colors.primaryLight}34` // Primary dark when collapsed
                      : `${theme.colors.primaryLight}22` // Light primary when expanded
                    : "transparent",
                  borderRight:
                    collapsed && !isMobile && isActive
                      ? "none" // Remove the right border WHILE ITS COLLAPSED
                      : isActive
                      ? `4px solid ${theme.colors.primary}`
                      : "none",
                  color: isActive
                    ? theme.colors.primary
                    : theme.colors.text.primary,
                  fontWeight: isActive ? "600" : "400",
                  transition: theme.transitions.fast,
                  margin: `2px ${theme.spacing.sm}`,
                  marginBottom:
                    collapsed && !isMobile ? theme.spacing.md : "2px",
                  borderRadius: theme.borderRadius.small,
                  minHeight: collapsed && !isMobile ? "50px" : "auto",
                  textAlign: collapsed && !isMobile ? "center" : "left",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor =
                      theme.colors.mediumGray + "22";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <item.icon sx={getIconStyle(isActive)} />

                {(!collapsed || isMobile) && (
                  <span
                    style={{
                      fontSize: isMobile ? "15px" : "14px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.label}
                  </span>
                )}

                {collapsed && !isMobile && (
                  <span
                    style={{
                      fontSize: "10px",
                      marginTop: "2px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "60px",
                      textAlign: "center",
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        {
          <div
            style={{
              padding:
                collapsed && !isMobile ? theme.spacing.md : theme.spacing.md,
              borderTop: `1px solid ${theme.colors.lightGray}`,
              backgroundColor: theme.colors.background,
            }}
          >
            <button
              onClick={handleLogout}
              className="btn-secondary"
              style={{
                width: "100%",
                padding:
                  collapsed && !isMobile ? theme.spacing.xs : theme.spacing.md,
                display: "flex",
                alignItems: "center",
                justifyContent:
                  collapsed && !isMobile ? "center" : "flex-start",
                fontSize: collapsed && !isMobile ? "20px" : "16px",
                borderRadius: theme.borderRadius.large,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme.colors.error + "20";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "";
              }}
            >
              <span
                style={{
                  marginRight: collapsed && !isMobile ? "0" : theme.spacing.sm,
                  fontSize: collapsed && !isMobile ? "20px" : "16px",
                }}
              >
                <ExitToAppIcon fontSize="inherit" color="error" />
              </span>
              {(!collapsed || isMobile) && "Logout"}
            </button>
          </div>
        }
      </div>
    </>
  );
};

export default SideNav;
