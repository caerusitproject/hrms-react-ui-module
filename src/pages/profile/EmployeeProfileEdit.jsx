import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { EmployeeAPI } from "../../api/employeeApi";
import { theme } from "../../theme/theme";
import CustomLoader from "../../components/common/CustomLoader";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const EmployeeProfileEdit = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: {
      personalDetails: {
        fullName: "",
        dateOfBirth: "",
        gender: "",
        maritalStatus: "",
        fatherName: "",
        idNumber: "",
        email: "",
        contactNumber: "",
        address: "",
        city: "",
        country: "",
      },
      professionalDetails: {
        empCode: "",
        designation: "",
        department: "",
        reportingManager: "",
        employmentType: "",
        dateOfJoining: "",
        status: "",
      },
    },
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [documents, setDocuments] = useState([
    { name: "Offer Letter", icon: "📄" },
    { name: "ID Proof", icon: "🆔" },
    { name: "Tax Document", icon: "📋" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({ name: "", file: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  const handleCancel = () => {
    navigate("/employee-profile");
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const loadEmployeeData = async () => {
      if (!isEditMode) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching data for employee ID:", id);
        const data = await EmployeeAPI.fetchEmployeeData(id);
        console.log("Fetched employee data:", data);
        setValue("personalDetails.fullName", data.name || "");
        setValue("personalDetails.dateOfBirth", data.dateOfBirth || "");
        setValue("personalDetails.gender", data.gender || "");
        setValue("personalDetails.maritalStatus", data.maritalStatus || "");
        setValue("personalDetails.fatherName", data.fatherName || "");
        setValue("personalDetails.idNumber", data.idNumber || "");
        setValue("personalDetails.email", data.email || "");
        setValue(
          "personalDetails.contactNumber",
          data.mobile || data.phone || ""
        );
        setValue("personalDetails.address", data.address || "");
        setValue("personalDetails.city", data.city || "");
        setValue("personalDetails.country", data.country || "");
        setValue("professionalDetails.empCode", data.empCode || "");
        setValue("professionalDetails.designation", data.department || "");
        setValue("professionalDetails.department", data.department || "");
        setValue("professionalDetails.reportingManager", "N/A");
        setValue("professionalDetails.employmentType", "");
        setValue("professionalDetails.dateOfJoining", data.joiningDate || "");
        setValue("professionalDetails.status", data.state || "");
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
  }, [id, isEditMode, setValue]);

  const onSubmit = async (formData) => {
    try {
      setSaving(true);
      const apiData = {
        name: formData.personalDetails.fullName,
        dateOfBirth: formData.personalDetails.dateOfBirth,
        gender: formData.personalDetails.gender,
        maritalStatus: formData.personalDetails.maritalStatus,
        fatherName: formData.personalDetails.fatherName,
        idNumber: formData.personalDetails.idNumber,
        email: formData.personalDetails.email,
        mobile: formData.personalDetails.contactNumber,
        phone: formData.personalDetails.contactNumber,
        address: formData.personalDetails.address,
        city: formData.personalDetails.city,
        country: formData.personalDetails.country,
        empCode: formData.professionalDetails.empCode,
        department: formData.professionalDetails.department,
        joiningDate: formData.professionalDetails.dateOfJoining,
        state: formData.professionalDetails.status,
      };
      await EmployeeAPI.saveEmployeeData(apiData, id);
      navigate("/employee-profile");
    } catch (err) {
      setError(err.message);
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const fieldPath = Object.keys(errors[firstErrorField])[0];
        setFocus(`${firstErrorField}.${fieldPath}`);
      }
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
    setDocuments((prev) => prev.filter((_, i) => i !== index));
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
    const {
      register: modalRegister,
      handleSubmit: handleModalSubmit,
      formState: { errors: modalErrors },
    } = useForm({
      defaultValues: {
        documentName: "",
      },
    });

    const handleModalSave = (data) => {
      if (data.documentName && newDocument.file) {
        setDocuments((prev) => [
          ...prev,
          { name: data.documentName, icon: "📄", file: newDocument.file },
        ]);
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
            name="documentName"
            register={modalRegister}
            required
            errors={modalErrors}
          />
          <div
            style={{
              marginBottom: theme.spacing.md,
              marginTop: theme.spacing.md,
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#333333",
                marginBottom: theme.spacing.xs,
              }}
            >
              Upload File
            </label>
            <input
              type="file"
              onChange={(e) =>
                setNewDocument((prev) => ({ ...prev, file: e.target.files[0] }))
              }
              style={{
                width: "100%",
                maxWidth: "300px",
                padding: theme.spacing.sm,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.small,
                fontSize: "16px",
                color: "#222",
                backgroundColor: "#ffffff",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: theme.spacing.sm,
            }}
          >
            <Button type="tertiary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleModalSubmit(handleModalSave)}
              disabled={!newDocument.file}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <style>
        {`
          @media (max-width: 768px) {
            .form-grid {
              grid-template-columns: 1fr !important;
            }
            .header {
              flex-direction: column !important;
              align-items: center !important;
              text-align: center;
            }
            .header > div:nth-child(2) {
              min-width: unset !important;
              margin-top: ${theme.spacing.md};
              width: 200px; /* Reduced width for Full Name input */
            }
          }
        `}
      </style>

      {/* Top Bar with Title and Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: theme.spacing.md,
          position: "sticky",
          top: 0,
          //backgroundColor: theme.colors.surface, // ✅ prevents overlap
          //zIndex: 1000, // ✅ higher z-index so it stays above content
          padding: `${theme.spacing.sm} ${theme.spacing.md}`, // ✅ space left & right
          //boxShadow: "0 2px 6px rgba(0,0,0,0.05)", // ✅ subtle shadow for separation
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
          <Button
            type="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : isEditMode
              ? "Save Changes"
              : "Create Employee"}
          </Button>
        </div>
      </div>

      {/* <p
        style={{
          fontSize: "14px",
          color: theme.colors.text.secondary,
          marginBottom: theme.spacing.lg,
        }}
      >
        {isEditMode
          ? "Make changes to the employee's details and documents."
          : "Fill in the details to create a new employee."}
      </p> */}

      {/* Header Section */}
      <div
        className="header"
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.large,
          padding: isMobile ? theme.spacing.md : theme.spacing.xl,
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
              backgroundColor: !avatarPreview
                ? theme.colors.surfaceVariant
                : "transparent",
            }}
          >
            {!avatarPreview &&
              (watch("personalDetails.fullName")
                ?.split(" ")
                .map((n) => n[0])
                .join("") ||
                "")}
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
            name="personalDetails.fullName"
            register={register}
            required
            errors={errors}
            //style={{ maxWidth: "200px" }}
          />
        </div>
      </div>

      {/* Personal Details Section */}
      <FormCard title="Personal Details">
        <div
          className="form-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: theme.spacing.xs /* Increased gap between fields */,
            padding: `0 ${theme.spacing.md}`,
          }}
        >
          <Input
            label="Date of Birth"
            name="personalDetails.dateOfBirth"
            type="date"
            register={register}
            errors={errors}
            // style={{ maxWidth: "275px" }}
          />
          <Input
            label="Gender"
            name="personalDetails.gender"
            register={register}
            errors={errors}
            //style={{ maxWidth: "275px" }}
          />
          <Input
            label="Marital Status"
            name="personalDetails.maritalStatus"
            register={register}
            errors={errors}
            //style={{ maxWidth: "275px" }}
          />
          <Input
            label="Father's Name"
            name="personalDetails.fatherName"
            register={register}
            errors={errors}
            //style={{ maxWidth: "275px" }}
          />
          <Input
            label="ID Number"
            name="personalDetails.idNumber"
            register={register}
            errors={errors}
            // style={{ maxWidth: "275px" }}
          />
          <Input
            label="Email Address"
            name="personalDetails.email"
            type="email"
            register={register}
            required
            errors={errors}
            // style={{ maxWidth: "275px" }}
          />
          <Input
            label="Contact Number"
            name="personalDetails.contactNumber"
            register={register}
            errors={errors}
            //style={{ maxWidth: "275px" }}
          />
          <Input
            label="Address"
            name="personalDetails.address"
            register={register}
            errors={errors}
            //style={{ minWidth: "275px" }}
          />
          <Input
            label="City"
            name="personalDetails.city"
            register={register}
            errors={errors}
            //style={{ maxWidth: "275px" }}
          />
          <Input
            label="Country"
            name="personalDetails.country"
            register={register}
            errors={errors}
            //style={{ maxWidth: "2895px" }}
          />
        </div>
      </FormCard>

      {/* Professional Details Section */}
      <FormCard title="Professional Details">
        <div
          className="form-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: theme.spacing.xs /* Increased gap between fields */,
            padding: `0 ${theme.spacing.md}`,
          }}
        >
          <Input
            label="Employee Code"
            name="professionalDetails.empCode"
            register={register}
            errors={errors}
            //style={{ maxWidth: "275px" }}
          />
          <Input
            label="Designation"
            name="professionalDetails.designation"
            register={register}
            required
            errors={errors}
            //style={{ maxWidth: "275px" }}
          />
          <Input
            label="Department"
            name="professionalDetails.department"
            register={register}
            required
            errors={errors}
            //style={{ maxWidth: "275px" }}
          />
          <Input
            label="Reporting Manager"
            name="professionalDetails.reportingManager"
            register={register}
            errors={errors}
            // style={{ maxWidth: "275px" }}
          />
          <Input
            label="Employment Type"
            name="professionalDetails.employmentType"
            register={register}
            errors={errors}
            //style={{ maxWidth: "275px" }}
          />
          <Input
            label="Date of Joining"
            name="professionalDetails.dateOfJoining"
            type="date"
            register={register}
            required
            errors={errors}
            //style={{ maxWidth: "275px" }}
          />
          <Input
            label="Status"
            name="professionalDetails.status"
            register={register}
            errors={errors}
            //style={{ maxWidth: "375px" }}
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
          style={{
            marginTop: theme.spacing.xxl,
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
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

export default EmployeeProfileEdit;
