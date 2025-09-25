import React, { useState, useEffect } from "react";
import { fetchEmployeeData, saveEmployeeData } from "./employeeService";
import { theme } from "../../theme/theme";
import CustomLoader from "../../components/common/CustomLoader";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/common/Button";

const EmployeeProfileEdit = () => {
  const { id } = useParams(); // Get id from URL params
  const isEditMode = !!id; // Determine mode based on presence of id
  const [formData, setFormData] = useState({
    personalDetails: {
      fullName: "",
      dateOfBirth: "",
      gender: "",
      maritalStatus: "",
      fatherName: "",
      idNumber: "",
    },
    contactDetails: {
      workEmail: "",
      phone: "",
      address: "",
    },
    employmentDetails: {
      employeeId: "",
      jobTitle: "",
      department: "",
      reportingManager: "",
      employmentType: "",
      dateOfJoining: "",
      status: "",
    },
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [documents, setDocuments] = useState([
    { name: "Offer Letter", icon: "📄" },
    { name: "Aadhaar Card", icon: "🆔" },
    { name: "PAN Card", icon: "📋" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({ name: "", file: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/employee-profile");
  };

  useEffect(() => {
    const loadEmployeeData = async () => {
      if (!isEditMode) {
        // Create mode: No fetch, use defaults
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchEmployeeData(id);
        setFormData({
          personalDetails: {
            fullName: data.name || "",
            dateOfBirth: data.dateOfBirth || "",
            gender: data.gender || "",
            maritalStatus: data.maritalStatus || "",
            fatherName: data.fatherName || "",
            idNumber: data.idNumber || "",
          },
          contactDetails: {
            workEmail: data.email || "",
            phone: data.mobile || data.phone || "",
            address: [data.address, data.city, data.country].filter(Boolean).join(", ") || "",
          },
          employmentDetails: {
            employeeId: data.empCode || "",
            jobTitle: data.department || "",
            department: data.department || "",
            reportingManager: data.professionalDetails?.reportingManager || "",
            employmentType: "",
            dateOfJoining: data.joiningDate || "",
            status: data.state === "ACTIVE" ? "Active" : (data.state || ""),
          },
        });
      } catch (err) {
        setError(err.message.includes("CORS")
          ? "Failed to connect to the server. Please ensure the backend is configured to allow requests from this application."
          : err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEmployeeData();
  }, [id, isEditMode]);

  const updateFormData = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const normalizedData = {
        ...formData,
        employmentDetails: {
          ...formData.employmentDetails,
          status: formData.employmentDetails.status === "Active" ? "ACTIVE" : formData.employmentDetails.status,
        },
      };
      await saveEmployeeData(normalizedData, id); // Pass id for update/create logic in service
      navigate("/employee-profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAddDocument = () => {
    setIsModalOpen(true);
  };

  const handleDocumentRemove = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
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
        <Button
          type="primary"
          onClick={() => window.location.reload()}
          style={{ marginTop: theme.spacing.md }}
        >
          Retry
        </Button>
      </div>
    );
  }

  const DocumentModal = () => {
    const handleModalSave = () => {
      if (newDocument.name && newDocument.file) {
        setDocuments(prev => [...prev, { name: newDocument.name, icon: "📄", file: newDocument.file }]);
        setNewDocument({ name: "", file: null });
        setIsModalOpen(false);
      }
    };

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: isModalOpen ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.large,
            boxShadow: theme.shadows.small,
            width: "90%",
            maxWidth: "400px",
            position: "relative",
          }}
        >
          <span
            onClick={() => setIsModalOpen(false)}
            style={{
              position: "absolute",
              top: theme.spacing.sm,
              right: theme.spacing.sm,
              fontSize: "24px",
              color: theme.colors.text.secondary,
              cursor: "pointer",
            }}
          >
            ×
          </span>
          <h2
            style={{
              marginBottom: theme.spacing.md,
              fontSize: "18px",
              fontWeight: "600",
              color: theme.colors.text.primary,
            }}
          >
            Add New Document
          </h2>
          <Input
            label="Document Name"
            value={newDocument.name}
            onChange={(value) => setNewDocument(prev => ({ ...prev, name: value }))}
            required
          />
          <div style={{ marginBottom: theme.spacing.md, marginTop: theme.spacing.md }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing.xs,
              }}
            >
              Upload File
            </label>
            <input
              type="file"
              onChange={(e) => setNewDocument(prev => ({ ...prev, file: e.target.files[0] }))}
              style={{
                width: "100%",
                padding: theme.spacing.sm,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.small,
                fontSize: "16px",
                color: theme.colors.text.primary,
                backgroundColor: theme.colors.surface,
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: theme.spacing.sm }}>
            <Button type="tertiary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleModalSave} disabled={!newDocument.name || !newDocument.file}>
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>

      {/* Top Bar with Title and Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: theme.spacing.md,
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: theme.colors.text.primary,
            margin: 0,
          }}
        >
          {isEditMode ? "Edit Employee Profile" : "Create Employee Profile"}
        </h1>
        <div style={{ display: "flex", gap: theme.spacing.sm }}>
          <Button type="tertiary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : (isEditMode ? "Save Changes" : "Create Employee")}
          </Button>
        </div>
      </div>

      <p
        style={{
          fontSize: "14px",
          color: theme.colors.text.secondary,
          marginBottom: theme.spacing.lg,
        }}
      >
        {isEditMode ? "Make changes to the employee's details and documents." : "Fill in the details to create a new employee."}
      </p>

      {/* Header Section */}
      <div
        className="header"
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.large,
          padding: theme.spacing.xl,
          marginBottom: theme.spacing.lg,
          boxShadow: theme.shadows.small,
          display: "flex",
          alignItems: "center",
          gap: theme.spacing.md,
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: theme.borderRadius.round,
              backgroundImage: avatarPreview ? `url(${avatarPreview})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: `3px solid ${theme.colors.lightGray}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "600",
              color: theme.colors.text.secondary,
              backgroundColor: !avatarPreview ? theme.colors.surfaceVariant : "transparent",
            }}
          >
            {!avatarPreview && formData.personalDetails.fullName.split(" ").map(n => n[0]).join("")}
          </div>
          <label
            htmlFor="avatar-upload"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: theme.colors.primary,
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.colors.white,
              cursor: "pointer",
            }}
          >
            📷
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>

        <div style={{ flex: 1, minWidth: "200px" }}>
          <Input
            label="Full Name"
            value={formData.personalDetails.fullName}
            onChange={(value) => updateFormData("personalDetails", "fullName", value)}
            required
          />
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: theme.colors.text.secondary,
            }}
          >
            Joined on {formData.employmentDetails.dateOfJoining ? new Date(formData.employmentDetails.dateOfJoining).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "N/A"}
          </p>
        </div>
      </div>

      {/* Personal Details Section */}
      <FormCard title="Personal Details">
        <div
          className="profile-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: theme.spacing.sm,
          }}
        >
          <Input
            label="Contact Number"
            value={formData.contactDetails.phone}
            onChange={(value) => updateFormData("contactDetails", "phone", value)}
          />
          <Input
            label="Email Address"
            type="email"
            value={formData.contactDetails.workEmail}
            onChange={(value) => updateFormData("contactDetails", "workEmail", value)}
            required
          />
          <Input
            label="Address"
            value={formData.contactDetails.address}
            onChange={(value) => updateFormData("contactDetails", "address", value)}
          />
        </div>
      </FormCard>

      {/* Professional Details Section */}
      <FormCard title="Professional Details">
        <div
          className="profile-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: theme.spacing.sm,
          }}
        >
          <Input
            label="Designation"
            value={formData.employmentDetails.jobTitle}
            onChange={(value) => updateFormData("employmentDetails", "jobTitle", value)}
            required
          />
          <Input
            label="Department"
            value={formData.employmentDetails.department}
            onChange={(value) => updateFormData("employmentDetails", "department", value)}
            required
          />
          <Input
            label="Reporting Manager"
            value={formData.employmentDetails.reportingManager}
            onChange={(value) => updateFormData("employmentDetails", "reportingManager", value)}
          />
        </div>
      </FormCard>

      {/* Supportive Documents Section */}
      <FormCard title="Supportive Documents">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing.sm,
          }}
        >
          {documents.map((doc, index) => (
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
              <span
                onClick={() => handleDocumentRemove(index)}
                style={{
                  color: theme.colors.error,
                  cursor: "pointer",
                  fontSize: "20px",
                  lineHeight: "20px",
                }}
              >
                ×
              </span>
            </div>
          ))}
        </div>
        <Button
          type="secondary"
          onClick={handleAddDocument}
          style={{ marginTop: theme.spacing.md, display: "block", marginLeft: "auto", marginRight: "auto" }}
        >
          + Add Document
        </Button>
        <DocumentModal />
      </FormCard>
    </div>
  );
};

const FormCard = ({ title, children }) => (
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
      {title}
    </h2>
    {children}
  </div>
);

const Input = ({ label, value, onChange, type = "text", required = false, disabled = false }) => (
  <div style={{ marginBottom: theme.spacing.md }}>
    <label
      style={{
        display: "block",
        fontSize: "14px",
        fontWeight: "500",
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
      }}
    >
      {label} {required && <span style={{ color: theme.colors.error }}>*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      style={{
        width: "100%",
        padding: theme.spacing.sm,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.small,
        fontSize: "16px",
        color: theme.colors.text.primary,
        backgroundColor: theme.colors.surface,
        boxSizing: "border-box",
      }}
    />
  </div>
);

export default EmployeeProfileEdit;