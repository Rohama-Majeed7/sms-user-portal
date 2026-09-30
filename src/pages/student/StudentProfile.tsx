import React, { useEffect, useState } from "react";
import UserLayout from "../../layouts/UserLayout";
import {
  User,
  Calendar,
  MapPin,
  Phone,
  Shield,
  Pencil,
  X,
  Save,
  Mail,
  Building2,
  UserCheck,
  GraduationCap,
} from "lucide-react";
import {
  getStudentProfile,
  updateStudentProfile,
} from "../../apis/student/student.service";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PhoneInput } from "../../components/ui/PhoneInput";
import { Select } from "../../components/ui/Select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Alert } from "../../components/ui/Alert";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import {
  validateName,
  validatePakistaniPhone,
  validateDate,
  validateSelect,
  validateRequired,
} from "../../utils/validation";

type ProfileForm = {
  dateOfBirth: string;
  gender: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
};

export const ProtectedRoute: React.FC<{ element: React.ReactNode; allowedRoles: string[] }> = ({ element, allowedRoles }) => {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{element}</>;
};

export const StudentProfile: React.FC = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : null;

  const school = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "{}")?.school
    : null;

  const schoolName =
    school?.name || school?.schoolName || user?.schoolName || "SMS Portal";

  const getInitialForm = (): ProfileForm => ({
    dateOfBirth: "",
    gender: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState<ProfileForm>(getInitialForm());
  const [savedForm, setSavedForm] = useState<ProfileForm>(getInitialForm());
  const [fieldErrors, setFieldErrors] = useState<{
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    guardianName?: string;
    guardianPhone?: string;
  }>({});

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const res = await getStudentProfile();
        const loaded: ProfileForm = {
          dateOfBirth: res?.data?.dateOfBirth || "",
          gender: res?.data?.gender || "",
          address: res?.data?.address || "",
          guardianName: res?.data?.guardianName || "",
          guardianPhone: res?.data?.guardianPhone || "",
        };
        setForm(loaded);
        setSavedForm(loaded);
      } catch (err) {
        console.error("Failed to fetch student profile:", err);
      }
    };
    fetchStudentProfile();
  }, []);

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleEdit = () => {
    setError("");
    setSuccess("");
    setFieldErrors({});
    // If guardianPhone is empty, default it to +92 when editing begins
    if (!form.guardianPhone) {
      setForm((prev) => ({ ...prev, guardianPhone: "+92" }));
    }
    setEditing(true);
  };

  const handleCancel = () => {
    setForm({ ...savedForm });
    setFieldErrors({});
    setEditing(false);
    setError("");
    setSuccess("");
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (saving) return;

    setError("");
    setSuccess("");

    const newFieldErrors: {
      dateOfBirth?: string;
      gender?: string;
      address?: string;
      guardianName?: string;
      guardianPhone?: string;
    } = {};

    // 1. Date of Birth (mandatory)
    const dobVal = validateDate(form.dateOfBirth, "Date of birth", {
      disallowFuture: true,
      isRequired: true,
    });
    if (!dobVal.isValid) {
      newFieldErrors.dateOfBirth = dobVal.error;
    }

    // 2. Gender (mandatory)
    const genderVal = validateSelect(form.gender, "gender");
    if (!genderVal.isValid) {
      newFieldErrors.gender = genderVal.error;
    }

    // 3. Residential Address (mandatory)
    const addressVal = validateRequired(form.address, "Residential address", 3);
    if (!addressVal.isValid) {
      newFieldErrors.address = addressVal.error;
    }

    // 4. Guardian Full Name (mandatory)
    const trimmedGuardianName = form.guardianName.trim();
    const nameVal = validateName(trimmedGuardianName, true, "Guardian full name");
    if (!nameVal.isValid) {
      newFieldErrors.guardianName = nameVal.error;
    }

    // 5. Guardian Phone Number (mandatory)
    const trimmedPhone = form.guardianPhone.trim();
    const phoneVal = validatePakistaniPhone(trimmedPhone, true);
    if (!phoneVal.isValid) {
      newFieldErrors.guardianPhone = phoneVal.error;
    }

    // Prevent submission and show errors if any mandatory field is missing or invalid
    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setError("Please fill in all mandatory fields correctly before saving your profile.");
      return;
    }

    try {
      setSaving(true);

      const res = await updateStudentProfile({
        dateOfBirth: form.dateOfBirth.trim(),
        gender: form.gender.trim(),
        address: form.address.trim(),
        guardianName: trimmedGuardianName,
        guardianPhone: trimmedPhone,
      });

      const updatedForm: ProfileForm = {
        dateOfBirth: form.dateOfBirth.trim(),
        gender: form.gender.trim(),
        address: form.address.trim(),
        guardianName: trimmedGuardianName,
        guardianPhone: trimmedPhone,
      };

      const updated = {
        ...user,
        ...res?.data,
        ...updatedForm,
      };

      localStorage.setItem("user", JSON.stringify(updated));
      toast.success(res?.message || "Profile updated successfully!");
      setForm(updatedForm);
      setSavedForm(updatedForm);
      setFieldErrors({});
      setEditing(false);

      setTimeout(() => {
        setSuccess("");
      }, 4000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to update your profile. Please check your connection and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (value: string) => {
    if (!value) return null;
    try {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return null;
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return null;
    }
  };

  const initials =
    user?.initials ||
    (user?.name
      ? user.name
          .split(" ")
          .map((p: string) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "S");

  return (
    <UserLayout
      role="STUDENT"
      pageTitle="Student Profile"
      activePath="/student-profile"
    >
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-12">
        {/* =========================================================
            PROFILE HERO HEADER
        ========================================================== */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl bg-indigo-600 text-white text-2xl font-bold flex items-center justify-center shadow-md shadow-indigo-500/20">
                  {initials}
                </div>
              </div>

              {/* Student Identity */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight truncate">
                    {user?.name || "Student Profile"}
                  </h1>
                  <Badge variant="student">
                    <GraduationCap className="h-3.5 w-3.5 mr-1" />
                    Enrolled Student
                  </Badge>
                </div>

                <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 truncate">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    {user?.email || "No email specified"}
                  </span>
                  <span className="hidden sm:inline text-slate-300">•</span>
                  <span className="flex items-center gap-1.5 truncate">
                    <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    {schoolName}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            {!editing ? (
              <Button
                variant="primary"
                leftIcon={<Pencil className="h-4 w-4" />}
                onClick={handleEdit}
                className="w-full sm:w-auto"
              >
                Edit Profile
              </Button>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  leftIcon={<X className="h-4 w-4" />}
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  leftIcon={<Save className="h-4 w-4" />}
                  onClick={() => handleSave()}
                  loading={saving}
                  className="flex-1 sm:flex-none"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Feedback alerts */}
        {error && (
          <Alert variant="danger" title="Update Failed" message={error} />
        )}
        {success && (
          <Alert variant="success" title="Success" message={success} />
        )}

        {/* =========================================================
            PROFILE SECTIONS FORM
        ========================================================== */}
        <form onSubmit={handleSave} noValidate className="space-y-6 sm:space-y-8">
          {/* Section 1: Personal & Academic Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Personal &amp; Academic Details</CardTitle>
                  <CardDescription>
                    Identification and basic enrollment information
                  </CardDescription>
                </div>
              </div>
              {editing && (
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  Editing
                </span>
              )}
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {/* Date of Birth */}
                {editing ? (
                  <Input
                    type="date"
                    label="Date of Birth"
                    required
                    value={form.dateOfBirth}
                    leftIcon={<Calendar className="h-4 w-4" />}
                    error={fieldErrors.dateOfBirth}
                    onChange={(e) =>
                      handleChange("dateOfBirth", e.target.value)
                    }
                  />
                ) : (
                  <ViewField
                    label="Date of Birth"
                    value={formatDate(form.dateOfBirth) || ""}
                    icon={<Calendar className="h-4 w-4" />}
                  />
                )}

                {/* Gender */}
                {editing ? (
                  <Select
                    label="Gender"
                    required
                    value={form.gender}
                    leftIcon={<Shield className="h-4 w-4" />}
                    error={fieldErrors.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                  >
                    <option value="">Select Gender...</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </Select>
                ) : (
                  <ViewField
                    label="Gender"
                    value={
                      form.gender
                        ? form.gender.charAt(0) +
                          form.gender.slice(1).toLowerCase()
                        : ""
                    }
                    icon={<Shield className="h-4 w-4" />}
                  />
                )}

                {/* Address */}
                {editing ? (
                  <Input
                    label="Residential Address"
                    required
                    value={form.address}
                    placeholder="e.g. 123 University Ave, Block B"
                    leftIcon={<MapPin className="h-4 w-4" />}
                    error={fieldErrors.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                ) : (
                  <ViewField
                    label="Residential Address"
                    value={form.address}
                    icon={<MapPin className="h-4 w-4" />}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Guardian & Emergency Contact */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Guardian &amp; Emergency Contact</CardTitle>
                  <CardDescription>
                    Authorized parent or guardian contact information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {editing ? (
                  <Input
                    label="Guardian Full Name"
                    required
                    value={form.guardianName}
                    placeholder="e.g. Robert Williams"
                    leftIcon={<User className="h-4 w-4" />}
                    onChange={(e) =>
                      handleChange("guardianName", e.target.value)
                    }
                    error={fieldErrors.guardianName}
                  />
                ) : (
                  <ViewField
                    label="Guardian Full Name"
                    value={form.guardianName}
                    icon={<User className="h-4 w-4" />}
                  />
                )}

                {editing ? (
                  <PhoneInput
                    label="Guardian Phone Number"
                    required
                    value={form.guardianPhone}
                    placeholder="+923001234567"
                    persistPrefix={true}
                    leftIcon={<Phone className="h-4 w-4" />}
                    onChange={(val) => handleChange("guardianPhone", val)}
                    error={fieldErrors.guardianPhone}
                    helperText="Pakistani mobile format (+923XXXXXXXXX)"
                  />
                ) : (
                  <ViewField
                    label="Guardian Phone Number"
                    value={form.guardianPhone}
                    icon={<Phone className="h-4 w-4" />}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 3: System & Affiliation Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Account &amp; Affiliation Details</CardTitle>
                  <CardDescription>
                    System identifiers and school registration status
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Assigned Role
                  </p>
                  <p className="mt-1 text-sm font-semibold text-indigo-700">
                    {user?.role === "STUDENT" ? "Student" : "Faculty"}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Institution
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800 truncate">
                    {school?.name}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sticky Bottom Save Action Bar when in Edit Mode */}
          {editing && (
            <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-white border border-slate-200 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-up">
              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-900">
                  Unsaved Changes:
                </span>{" "}
                Ensure all contact and personal fields are verified before
                saving.
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  loading={saving}
                  leftIcon={<Save className="h-3.5 w-3.5" />}
                >
                  Save Profile
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </UserLayout>
  );
};

interface ViewFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const ViewField: React.FC<ViewFieldProps> = ({ label, value, icon }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
      {label}
    </p>
    <div className="h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-sm">
      <span className="text-slate-400 shrink-0">{icon}</span>
      <span
        className={`truncate ${value ? "text-slate-900 font-medium" : "text-slate-400 italic"}`}
      >
        {value || "Not specified"}
      </span>
    </div>
  </div>
);

export default StudentProfile;
