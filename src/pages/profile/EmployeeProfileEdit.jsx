import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { EmployeeAPI } from "../../api/employeeApi";
import { theme } from "../../theme/theme";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import CustomLoader from "../../components/common/CustomLoader";

const EmployeeProfileEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = !!id;
  const role = user?.role || "USER";
  const currentUserId = Number(user?.id);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isProfessionalEditable = ["HR", "ADMIN"].includes(role);
  const isOwnProfile = isEditMode && parseInt(id) === currentUserId;
  const canEditPersonal =
    !isEditMode || ["HR", "ADMIN"].includes(role) || isOwnProfile;
  const canSave = !isEditMode || canEditPersonal || isProfessionalEditable;
  const empPrefix = process.env.REACT_APP_EMP_PREFIX || "EMP";

const generateEmpCode = () =>
  `${empPrefix}${Math.floor(1000 + Math.random() * 9000)}`;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [deptRes, mgrRes] = await Promise.all([
          EmployeeAPI.getDepartments(),
          EmployeeAPI.getAllManagers(),
        ]);

        setDepartments(deptRes || []);
        setManagers(mgrRes?.data || []);

        if (isEditMode) {
          const data = await EmployeeAPI.fetchEmployeeData(id);

          setValue("personalDetails.fullName", data.name || "");
          setValue("personalDetails.dateOfBirth", data.dateOfBirth || "");
          setValue("personalDetails.gender", data.gender || "");
          setValue("personalDetails.maritalStatus", data.maritalStatus || "");
          setValue("personalDetails.fatherName", data.fatherName || "");
          setValue("personalDetails.address", data.address || "");
          setValue("personalDetails.city", data.city || "");
          setValue("personalDetails.country", data.country || "");
          setValue("professionalDetails.designation", data.designation || "");
          setValue(
            "professionalDetails.department",
            data.departmentId ? data.departmentId.toString() : ""
          );
          setValue(
            "professionalDetails.reportingManager",
            data.managerId ? data.managerId.toString() : ""
          );
          setValue("professionalDetails.idNumber", data.idNumber || "");
          setValue("professionalDetails.email", data.email || "");
          setValue(
            "professionalDetails.employmentType",
            data.employmentType || ""
          );
          setValue("professionalDetails.dateOfJoining", data.joiningDate || "");

          const roleNameToId = {
            ADMIN: "1",
            HR: "2",
            MANAGER: "3",
            USER: "4",
          };

          const employeeRole = data.role || "USER";

          // Convert role name to ID for select dropdown
          const roleId = roleNameToId[employeeRole] || "4";
          setValue("professionalDetails.role", roleId);
        } else {
          setValue("professionalDetails.empCode", generateEmpCode());
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isEditMode, setValue]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const apiPayload = {
        name: data.personalDetails?.fullName,
        dateOfBirth: data.personalDetails?.dateOfBirth,
        gender: data.personalDetails?.gender,
        maritalStatus: data.personalDetails?.maritalStatus,
        fatherName: data.personalDetails?.fatherName,
        address: data.personalDetails?.address,
        city: data.personalDetails?.city,
        country: data.personalDetails?.country,
        email: data.professionalDetails?.email,
        idNumber: data.professionalDetails?.idNumber,
        designation: data.professionalDetails?.designation,
        departmentId: parseInt(data.professionalDetails?.department),
        employmentType: data.professionalDetails?.employmentType,
        joiningDate: data.professionalDetails?.dateOfJoining,
        roleIds: parseInt(data.professionalDetails?.role),
      };

      if (!isEditMode) {
        apiPayload.password = data.professionalDetails?.password;
      }

      if (isEditMode) {
        await EmployeeAPI.updateEmployee(id, apiPayload);
        navigate(`/employee-profile/${id}`);
      } else {
        const res = await EmployeeAPI.createEmployee(apiPayload);
        navigate(
          `/employee-profile/${res.employee?.id || res.data?.employee?.id}`
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () =>
    navigate(isEditMode ? `/employee-profile/${id}` : "/employees-list");

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: theme.spacing.xl }}>
        <CustomLoader />
      </div>
    );

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: isMobile ? theme.spacing.sm : theme.spacing.md,
  };

  const departmentOptions = [
    { value: "", label: "Select Department" },
    ...departments.map((d) => ({ value: d.id, label: d.departmentName })),
  ];

  const managerOptions = [
    { value: "", label: "Select Reporting Manager" },
    ...managers.map((m) => ({ value: m.id, label: m.name })),
  ];

  const roleOptions = [
    { value: "", label: "Select Role" },
    { value: 1, label: "Admin" },
    { value: 2, label: "HR" },
    { value: 3, label: "Manager" },
    { value: 4, label: "User" },
  ];

  return (
    <>
      <div style={{ paddingBottom: theme.spacing.xl }}>
        {error && (
          <div
            style={{
              color: theme.colors.error,
              marginBottom: theme.spacing.md,
              padding: theme.spacing.sm,
              backgroundColor: theme.colors.error + "10",
              borderRadius: theme.borderRadius.small,
            }}
          >
            {error}
          </div>
        )}
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "650",
            color: theme.colors.text.primary,
            margin: "0 0 " + theme.spacing.lg + " 0",
          }}
        >
          {isEditMode ? "Edit Employee Profile" : "Create Employee Profile"}
        </h1>

        {/* Avatar + Name */}
        <div
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.large,
            padding: theme.spacing.lg,
            boxShadow: theme.shadows.small,
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.lg,
            flexWrap: "wrap",
            flexDirection: isMobile ? "column" : "row",
            marginBottom: theme.spacing.lg,
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                backgroundColor: theme.colors.surfaceVariant,
                border: `3px solid ${theme.colors.lightGray}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "600",
                fontSize: "24px",
                color: theme.colors.text.secondary,
                backgroundImage: avatarPreview
                  ? `url(${avatarPreview})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!avatarPreview &&
                (watch("personalDetails.fullName") || "U")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
            </div>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setAvatarPreview(URL.createObjectURL(e.target.files[0]))
              }
              disabled={isEditMode && !canEditPersonal}
              style={{ display: "none" }}
            />
            <label
              htmlFor="avatar-upload"
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: theme.colors.primary,
                color: "#fff",
                borderRadius: "50%",
                width: 28,
                height: 28,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: isEditMode && !canEditPersonal ? "default" : "pointer",
                opacity: isEditMode && !canEditPersonal ? 0.5 : 1,
              }}
            >
              📷
            </label>
          </div>
          <div
            style={{
              flex: isMobile ? "0 0 100%" : "0 0 50%",
              maxWidth: isMobile ? "100%" : "50%",
            }}
          >
            <Input
              label="Full Name"
              name="personalDetails.fullName"
              register={register}
              required
              disabled={isEditMode && !canEditPersonal}
              errors={errors}
            />
          </div>
        </div>

        {/* Personal Details */}
        <FormCard title="Personal Details">
          <div style={gridStyle}>
            <Input
              label="Date of Birth"
              name="personalDetails.dateOfBirth"
              type="date"
              register={register}
              disabled={isEditMode && !canEditPersonal}
              errors={errors}
            />
            <Input
              label="Gender"
              name="personalDetails.gender"
              register={register}
              disabled={isEditMode && !canEditPersonal}
              errors={errors}
            />
            <Input
              label="Marital Status"
              name="personalDetails.maritalStatus"
              register={register}
              disabled={isEditMode && !canEditPersonal}
              errors={errors}
            />
            <Input
              label="Father's Name"
              name="personalDetails.fatherName"
              register={register}
              disabled={isEditMode && !canEditPersonal}
              errors={errors}
            />
            <Input
              label="Address"
              name="personalDetails.address"
              register={register}
              disabled={isEditMode && !canEditPersonal}
              errors={errors}
            />
            <Input
              label="City"
              name="personalDetails.city"
              register={register}
              disabled={isEditMode && !canEditPersonal}
              errors={errors}
            />
            <Input
              label="Country"
              name="personalDetails.country"
              register={register}
              disabled={isEditMode && !canEditPersonal}
              errors={errors}
            />
          </div>
        </FormCard>

        {/* Professional Details */}
        <FormCard title="Professional Details">
          <div style={gridStyle}>
            <Input
              label="Designation"
              name="professionalDetails.designation"
              register={register}
              disabled={isEditMode && !isProfessionalEditable}
              errors={errors}
            />
            <Input
              label="Email"
              name="professionalDetails.email"
              type="email"
              register={register}
              disabled={isEditMode && !isProfessionalEditable}
              errors={errors}
            />
            <Input
              label="ID Number"
              name="professionalDetails.idNumber"
              register={register}
              disabled={isEditMode && !isProfessionalEditable}
              errors={errors}
            />

            {!isEditMode && (
              <Input
                label="Password"
                name="professionalDetails.password"
                type="password"
                register={register}
                required
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                errors={errors}
              />
            )}

            <Input
              label="Department"
              name="professionalDetails.department"
              type="select"
              options={departmentOptions}
              register={register}
              disabled={isEditMode && !isProfessionalEditable}
              errors={errors}
            />

            <Input
              label="Reporting Manager"
              name="professionalDetails.reportingManager"
              type="select"
              options={managerOptions}
              register={register}
              disabled={isEditMode && !isProfessionalEditable}
              errors={errors}
            />

            <Input
              label="Employment Type"
              name="professionalDetails.employmentType"
              register={register}
              disabled={isEditMode && !isProfessionalEditable}
              errors={errors}
            />
            <Input
              label="Date of Joining"
              name="professionalDetails.dateOfJoining"
              type="date"
              register={register}
              disabled={isEditMode && !isProfessionalEditable}
              errors={errors}
            />

            <Input
              label="Role"
              name="professionalDetails.role"
              type="select"
              options={roleOptions}
              register={register}
              disabled={isEditMode && !isProfessionalEditable}
              errors={errors}
            />
          </div>
        </FormCard>
      </div>

      {/* Fixed Bottom Buttons */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.colors.surface,
          borderTop: `1px solid ${theme.colors.border}`,
          padding: theme.spacing.md,
          display: "flex",
          justifyContent: isMobile ? "space-between" : "flex-end",
          gap: theme.spacing.sm,
          zIndex: 10,
          boxShadow: theme.shadows.small,
        }}
      >
        <Button type="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={saving || (isEditMode && !canSave)}
        >
          {saving ? "Saving..." : isEditMode ? "Save Changes" : "Create"}
        </Button>
      </div>
    </>
  );
};

/* ---------- Helper Components ---------- */
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
        color: theme.colors.primary,
        borderBottom: `2px solid ${theme.colors.background}`,
        paddingBottom: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        fontWeight: 600,
        fontSize: "18px",
      }}
    >
      {title}
    </h2>
    {children}
  </div>
);

export default EmployeeProfileEdit;
