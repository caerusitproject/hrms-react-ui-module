import React, { useState, useEffect } from "react";
import { EmployeeAPI } from "../../api/employeeApi";
import { theme } from "../../theme/theme";
import CustomLoader from "../../components/common/CustomLoader";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";

const EmployeeProfileView = ({ employeeId = "1" }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        setLoading(true);
        const data = await EmployeeAPI.fetchEmployeeData(employeeId);
        // Transform API response to match expected structure
        const transformedData = {
          personalDetails: {
            fullName: data.name || "N/A",
            email: data.email || "N/A",
            contactNumber: data.mobile || data.phone || "N/A",
            gender: data.gender || "N/A",
            maritalStatus: data.maritalStatus || "N/A",
            fatherName: data.fatherName || "N/A",
            idNumber: data.idNumber || "N/A",
            address:
              data.address && data.city
                ? `${data.address}, ${data.city}`
                : "N/A",
            country: data.country || "N/A",
          },
          professionalDetails: {
            designation: data.department || "N/A", // assuming department as designation
            department: data.department || "N/A",
            dateOfJoining: data.joiningDate || "N/A",
            reportingManager: "N/A", // not available in API
            employeeId: data.id || "N/A",
            empCode: data.empCode || "N/A",
          },
          avatar: null, // not available in API
        };
        setEmployee(transformedData);
      } catch (err) {
        setError(
          err.message.includes("CORS")
            ? "Failed to connect to the server. Please ensure the backend is configured to allow requests from this application."
            : err.message
        );
      } finally {
        setLoading(false);
      }
    };

    loadEmployeeData();
  }, [employeeId]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
    navigate(`/employee/edit/${employeeId}`); // Pass employeeId in URL for edit mode
  };

  const handleView = (docName) => {
    alert(`Viewing ${docName}`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: theme.spacing.xl }}>
        <CustomLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: theme.spacing.xl }}>
        <div style={{ color: theme.colors.error }}>Error: {error}</div>
      </div>
    );
  }

  if (!employee) return null;

  // Dummy documents data
  const dummyDocuments = [
    { name: "Offer Letter", icon: "📄" },
    { name: "ID Proof", icon: "🆔" },
    { name: "Tax Document", icon: "📋" },
  ];

  return (
    <div>
      {/* Inline CSS for responsive grid */}
      <style>
        {`
          @media (max-width: 768px) {
            .profile-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      {/* Button Section */}
      <div
        style={{
          padding: theme.spacing.md,
          display: "flex",
          justifyContent: "flex-end",
          gap: theme.spacing.md,
        }}
      >
        <Button type="primary" onClick={handleEdit}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {/* Header Section */}
      <div
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.large,
          padding: theme.spacing.xl,
          marginBottom: theme.spacing.lg,
          boxShadow: theme.shadows.small,
          display: "flex",
          alignItems: "center",
          gap: theme.spacing.md,
          position: "relative",
          transition: theme.transitions.medium,
        }}
      >
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: theme.borderRadius.round,
            backgroundImage: employee.avatar
              ? `url(${employee.avatar})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: `3px solid ${theme.colors.lightGray}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            fontWeight: "600",
            color: theme.colors.text.secondary,
            backgroundColor: !employee.avatar && theme.colors.surfaceVariant,
          }}
        >
          {!employee.avatar &&
            employee.personalDetails?.fullName
              ?.split(" ")
              .map((n) => n[0])
              .join("")}
        </div>

        <div style={{ flex: 1 }}>
          <h1
            style={{
              margin: `${theme.spacing.xs} 0`,
              fontSize: "24px",
              fontWeight: "600",
              color: theme.colors.text.primary,
            }}
          >
            {employee.personalDetails?.fullName || "N/A"}
          </h1>
          <p
            style={{
              margin: `${theme.spacing.xs} 0`,
              fontSize: "16px",
              color: theme.colors.text.secondary,
            }}
          >
            {employee.professionalDetails?.designation || "N/A"}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: theme.colors.text.secondary,
            }}
          >
            Employee ID {employee.professionalDetails?.employeeId || "N/A"}
          </p>
        </div>
      </div>

      {/* Personal Details Section */}
      <div
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.large,
          padding: theme.spacing.xl,
          marginBottom: theme.spacing.lg,
          boxShadow: theme.shadows.small,
        }}
      >
        <h2
          style={{
            margin: `${theme.spacing.sm} 0 ${theme.spacing.md} 0`,
            fontSize: "18px",
            fontWeight: "600",
            color: theme.colors.text.primary,
            borderBottom: `2px solid ${theme.colors.background}`,
            paddingBottom: theme.spacing.sm,
          }}
        >
          Personal Details
        </h2>

        <div
          className="profile-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: theme.spacing.sm,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: theme.colors.text.secondary,
              }}
            >
              Full Name:
            </label>
            <div
              style={{
                fontSize: "16px",
                color: theme.colors.text.primary,
              }}
            >
              {employee.personalDetails?.fullName || "N/A"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: theme.colors.text.secondary,
              }}
            >
              Email Address:
            </label>
            <div
              style={{
                fontSize: "16px",
                color: theme.colors.text.primary,
              }}
            >
              {employee.personalDetails?.email || "N/A"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: theme.colors.text.secondary,
              }}
            >
              Contact Number:
            </label>
            <div
              style={{
                fontSize: "16px",
                color: theme.colors.text.primary,
              }}
            >
              {employee.personalDetails?.contactNumber || "N/A"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: theme.colors.text.secondary,
              }}
            >
              Gender:
            </label>
            <div
              style={{
                fontSize: "16px",
                color: theme.colors.text.primary,
              }}
            >
              {employee.personalDetails?.gender || "N/A"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: theme.colors.text.secondary,
              }}
            >
              Marital Status:
            </label>
            <div
              style={{
                fontSize: "16px",
                color: theme.colors.text.primary,
              }}
            >
              {employee.personalDetails?.maritalStatus || "N/A"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: theme.colors.text.secondary,
              }}
            >
              Father's Name:
            </label>
            <div
              style={{
                fontSize: "16px",
                color: theme.colors.text.primary,
              }}
            >
              {employee.personalDetails?.fatherName || "N/A"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: theme.colors.text.secondary,
              }}
            >
              ID Number:
            </label>
            <div
              style={{
                fontSize: "16px",
                color: theme.colors.text.primary,
              }}
            >
              {employee.personalDetails?.idNumber || "N/A"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: theme.colors.text.secondary,
              }}
            >
              Address:
            </label>
            <div
              style={{
                fontSize: "16px",
                color: theme.colors.text.primary,
              }}
            >
              {employee.personalDetails?.address || "N/A"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: theme.colors.text.secondary,
              }}
            >
              Country:
            </label>
            <div
              style={{
                fontSize: "16px",
                color: theme.colors.text.primary,
              }}
            >
              {employee.personalDetails?.country || "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Details Section */}
      <div
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.large,
          padding: theme.spacing.xl,
          marginBottom: theme.spacing.lg,
          boxShadow: theme.shadows.small,
        }}
      >
        <h2
          style={{
            margin: `${theme.spacing.sm} 0 ${theme.spacing.md} 0`,
            fontSize: "18px",
            fontWeight: "600",
            color: theme.colors.text.primary,
            borderBottom: `2px solid ${theme.colors.background}`,
            paddingBottom: theme.spacing.sm,
          }}
        >
          Professional Details
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: theme.spacing.sm,
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing.xs,
              }}
            >
              Employee Code
            </label>
            <div
              style={{
                fontSize: "16px",
                color: theme.colors.text.primary,
              }}
            >
              {employee.professionalDetails?.empCode || "N/A"}
            </div>
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing.xs,
              }}
            >
              Designation
            </label>
            <div
              style={{
                fontSize: "16px",
                color: theme.colors.text.primary,
              }}
            >
              {employee.professionalDetails?.designation || "N/A"}
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing.xs,
              }}
            >
              Department
            </label>
            <div
              style={{
                fontSize: "16px",
                color: theme.colors.text.primary,
              }}
            >
              {employee.professionalDetails?.department || "N/A"}
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing.xs,
              }}
            >
              Date of Joining
            </label>
            <div
              style={{
                fontSize: "16px",
                color: theme.colors.text.primary,
              }}
            >
              {employee.professionalDetails?.dateOfJoining
                ? new Date(
                    employee.professionalDetails.dateOfJoining
                  ).toLocaleDateString()
                : "N/A"}
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing.xs,
              }}
            >
              Reporting Manager
            </label>
            <div
              style={{
                fontSize: "16px",
                color: theme.colors.text.primary,
              }}
            >
              {employee.professionalDetails?.reportingManager || "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Supportive Documents Section */}
      <div
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.large,
          padding: theme.spacing.xl,
          boxShadow: theme.shadows.small,
        }}
      >
        <h2
          style={{
            margin: `${theme.spacing.sm} 0 ${theme.spacing.md} 0`,
            fontSize: "18px",
            fontWeight: "600",
            color: theme.colors.text.primary,
            borderBottom: `2px solid ${theme.colors.background}`,
            paddingBottom: theme.spacing.sm,
          }}
        >
          Supportive Documents
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing.sm,
          }}
        >
          {dummyDocuments.map((doc, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                backgroundColor: theme.colors.background,
                borderRadius: theme.borderRadius.small,
                border: `1px solid ${theme.colors.lightGray}`,
                transition: theme.transitions.fast,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.sm,
                }}
              >
                <span style={{ fontSize: "20px" }}>{doc.icon}</span>
                <span
                  style={{
                    fontSize: "16px",
                    color: theme.colors.text.primary,
                    fontWeight: "500",
                  }}
                >
                  {doc.name}
                </span>
              </div>

              <button
                onClick={() => handleView(doc.name)}
                style={{
                  backgroundColor: "transparent",
                  color: theme.colors.warning,
                  border: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  textDecoration: "underline",
                  transition: theme.transitions.fast,
                }}
                onMouseOver={(e) =>
                  (e.target.style.color = theme.colors.primaryDark)
                }
                onMouseOut={(e) =>
                  (e.target.style.color = theme.colors.warning)
                }
              >
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileView;