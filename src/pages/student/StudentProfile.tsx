import React, { useMemo, useState } from 'react';
import UserLayout from '../../layouts/UserLayout';
import {
  User,
  Calendar,
  MapPin,
  Phone,
  Shield,
  Hash,
  Pencil,
  X,
  Save,
  Loader2,
  Mail,
  CheckCircle2,
  AlertCircle,
  Building2,
  UserCheck,
  Sparkles,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';
import { updateStudentProfile } from '../../apis/student/student.service';

type ProfileForm = {
  dateOfBirth: string;
  gender: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  admissionNumber: string;
};

const StudentProfile: React.FC = () => {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  const school = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem('sms_selected_school') || '{}'
      );
    } catch {
      return {};
    }
  }, []);

  const schoolName =
    school?.name ||
    school?.schoolName ||
    user?.schoolName ||
    'SMS Portal';

  const getInitialForm = (): ProfileForm => ({
    dateOfBirth: user?.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split('T')[0]
      : '',
    gender: user?.gender || '',
    address: user?.address || '',
    guardianName: user?.guardianName || '',
    guardianPhone: user?.guardianPhone || '',
    admissionNumber: user?.admissionNumber || '',
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState<ProfileForm>(getInitialForm);

  const handleChange = (
    field: keyof ProfileForm,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (error) {
      setError('');
    }

    if (success) {
      setSuccess('');
    }
  };

  const handleEdit = () => {
    setError('');
    setSuccess('');
    setForm(getInitialForm());
    setEditing(true);
  };

  const handleCancel = () => {
    setForm(getInitialForm());
    setEditing(false);
    setError('');
    setSuccess('');
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();

    setError('');
    setSuccess('');

    try {
      setSaving(true);

      const res = await updateStudentProfile({
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
        address: form.address || undefined,
        guardianName: form.guardianName || undefined,
        guardianPhone: form.guardianPhone || undefined,
        admissionNumber: form.admissionNumber || undefined,
      });

      const updated = {
        ...user,
        ...res?.user,
        ...res?.student,
        ...form,
      };

      localStorage.setItem('user', JSON.stringify(updated));

      setSuccess('Your profile has been updated successfully.');
      setEditing(false);

      setTimeout(() => {
        setSuccess('');
      }, 4000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Unable to update your profile. Please check your connection and try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (value: string) => {
    if (!value) return null;

    try {
      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        return null;
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return null;
    }
  };

  // const displayValue = (
  //   value: string | undefined,
  //   fallback = 'Not specified'
  // ) => {
  //   if (!value) {
  //     return (
  //       <span className="italic text-slate-600">
  //         {fallback}
  //       </span>
  //     );
  //   }

  //   return value;
  // };

  return (
    <UserLayout
      role="STUDENT"
      pageTitle="Student Profile"
      activePath="/student-profile"
    >
      <div className="mx-auto w-full max-w-6xl space-y-6 pb-10 sm:space-y-8">

        {/* =========================================================
            PROFILE HERO
        ========================================================== */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950 shadow-2xl shadow-black/10 sm:rounded-3xl">

          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-slate-950 to-slate-950" />

          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative z-10 p-5 sm:p-7 lg:p-8">

            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              {/* Profile information */}
              <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">

                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-white/10 bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 text-2xl font-bold text-white shadow-xl shadow-indigo-600/20 sm:h-24 sm:w-24 sm:rounded-3xl sm:text-3xl">
                    {user?.initials ||
                      user?.name?.charAt(0)?.toUpperCase() ||
                      'S'}
                  </div>

                  {/* Online indicator */}
                  <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-950 bg-slate-900">
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50"
                      title="Active Account"
                    />
                  </div>
                </div>

                {/* Identity */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="truncate text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {user?.name || 'Student Profile'}
                    </h1>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                      <GraduationCap size={12} />
                      Student
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">

                    <span className="flex min-w-0 items-center gap-2">
                      <Mail
                        size={14}
                        className="shrink-0 text-slate-500"
                      />

                      <span className="truncate">
                        {user?.email || 'No email specified'}
                      </span>
                    </span>

                    <span className="hidden text-slate-700 sm:inline">
                      •
                    </span>

                    <span className="flex min-w-0 items-center gap-2">
                      <Building2
                        size={14}
                        className="shrink-0 text-slate-500"
                      />

                      <span className="truncate">
                        {schoolName}
                      </span>
                    </span>
                  </div>

                  {form.admissionNumber && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-indigo-500/10 bg-indigo-500/5 px-2.5 py-1.5 font-mono text-[10px] text-indigo-300 sm:text-xs">
                      <Hash size={12} />

                      <span className="text-slate-500">
                        Admission ID
                      </span>

                      <span className="font-semibold text-indigo-300">
                        {form.admissionNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit / Save controls */}
              <div className="w-full lg:w-auto">

                {!editing ? (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-600/30 active:scale-[0.98] sm:w-auto"
                  >
                    <Pencil size={15} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex w-full gap-2 sm:w-auto">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                    >
                      <X size={15} />
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSave()}
                      disabled={saving}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                    >
                      {saving ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <Save size={15} />
                      )}

                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            ALERTS
        ========================================================== */}
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300 shadow-lg shadow-red-950/10">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
              <AlertCircle size={17} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-red-300">
                Update failed
              </p>

              <p className="mt-0.5 text-xs leading-5 text-red-400/80">
                {error}
              </p>
            </div>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300 shadow-lg shadow-emerald-950/10">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
              <CheckCircle2 size={17} />
            </div>

            <div>
              <p className="font-semibold text-emerald-300">
                Profile updated
              </p>

              <p className="mt-0.5 text-xs text-emerald-400/80">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* =========================================================
            PROFILE FORM
        ========================================================== */}
        <form
          onSubmit={handleSave}
          className="space-y-6 sm:space-y-8"
        >

          {/* =======================================================
              PERSONAL & ACADEMIC INFORMATION
          ======================================================== */}
          <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl shadow-black/5">

            {/* Header */}
            <div className="flex items-start gap-3 border-b border-slate-800/80 p-5 sm:p-6">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                <User size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">
                    Personal & Academic Details
                  </h2>

                  {editing && (
                    <span className="hidden rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-indigo-300 sm:inline-flex">
                      Editing Mode
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Basic identification and student enrollment details
                </p>
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:gap-6 sm:p-6">

              {/* Admission Number */}
              <ProfileField
                label="Admission Number"
                icon={<Hash size={16} />}
                editing={editing}
                value={form.admissionNumber}
                placeholder="e.g. ADM-2026-0042"
                onChange={(value) =>
                  handleChange('admissionNumber', value)
                }
              />

              {/* Date of Birth */}
              <ProfileField
                label="Date of Birth"
                icon={<Calendar size={16} />}
                editing={editing}
                value={form.dateOfBirth}
                type="date"
                displayValue={
                  formatDate(form.dateOfBirth) || undefined
                }
                onChange={(value) =>
                  handleChange('dateOfBirth', value)
                }
              />

              {/* Gender */}
              <ProfileSelectField
                label="Gender"
                icon={<Shield size={16} />}
                editing={editing}
                value={form.gender}
                onChange={(value) =>
                  handleChange('gender', value)
                }
                options={[
                  { value: 'MALE', label: 'Male' },
                  { value: 'FEMALE', label: 'Female' },
                  { value: 'OTHER', label: 'Other' },
                ]}
              />

              {/* Address */}
              <ProfileField
                label="Residential Address"
                icon={<MapPin size={16} />}
                editing={editing}
                value={form.address}
                placeholder="e.g. 123 University Ave, Block B"
                onChange={(value) =>
                  handleChange('address', value)
                }
              />
            </div>
          </section>

          {/* =======================================================
              GUARDIAN INFORMATION
          ======================================================== */}
          <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl shadow-black/5">

            <div className="flex items-start gap-3 border-b border-slate-800/80 p-5 sm:p-6">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
                <UserCheck size={18} />
              </div>

              <div>
                <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">
                  Guardian & Emergency Contact
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Authorized parent or guardian contact information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:gap-6 sm:p-6">

              {/* Guardian Name */}
              <ProfileField
                label="Guardian Full Name"
                icon={<User size={16} />}
                editing={editing}
                value={form.guardianName}
                placeholder="e.g. Robert Williams"
                accent="violet"
                onChange={(value) =>
                  handleChange('guardianName', value)
                }
              />

              {/* Guardian Phone */}
              <ProfileField
                label="Guardian Phone Number"
                icon={<Phone size={16} />}
                editing={editing}
                value={form.guardianPhone}
                type="tel"
                placeholder="e.g. +1 (555) 123-4567"
                accent="violet"
                onChange={(value) =>
                  handleChange('guardianPhone', value)
                }
              />
            </div>
          </section>

          {/* =======================================================
              ACCOUNT INFORMATION
          ======================================================== */}
          <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl shadow-black/5">

            <div className="flex items-start gap-3 border-b border-slate-800/80 p-5 sm:p-6">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400">
                <Shield size={18} />
              </div>

              <div>
                <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">
                  Account & System Information
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  System credentials and school affiliation details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:p-6">

              {/* Account ID */}
              <InfoCard
                label="Account ID"
                icon={<Hash size={15} />}
              >
                <span
                  className="block truncate font-mono text-xs text-slate-300"
                  title={user?.id || 'N/A'}
                >
                  {user?.id || 'System Generated'}
                </span>
              </InfoCard>

              {/* Assigned Role */}
              <InfoCard
                label="Assigned Role"
                icon={<Sparkles size={15} />}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-indigo-400">
                    Student
                  </span>

                  <Sparkles
                    size={14}
                    className="text-indigo-400"
                  />
                </div>
              </InfoCard>

              {/* Institution */}
              <InfoCard
                label="Institution"
                icon={<Building2 size={15} />}
              >
                <span className="block truncate text-sm font-medium text-slate-200">
                  {schoolName}
                </span>
              </InfoCard>
            </div>
          </section>

          {/* =======================================================
              EDITING FOOTER
          ======================================================== */}
          {editing && (
            <div className="sticky bottom-4 z-30 rounded-2xl border border-indigo-500/20 bg-slate-950/90 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-4">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  You have unsaved changes
                </div>

                <div className="flex w-full gap-2 sm:w-auto">

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white disabled:opacity-50 sm:flex-none sm:text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:text-sm"
                  >
                    {saving ? (
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                    ) : (
                      <Save size={15} />
                    )}

                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* =========================================================
            FOOTER NOTE
        ========================================================== */}
        <div className="flex items-center justify-center gap-2 px-4 text-center text-[11px] text-slate-600">
          <Shield size={12} />
          Your profile information is securely associated with your
          student account.
        </div>
      </div>
    </UserLayout>
  );
};

/* =================================================================
   REUSABLE PROFILE FIELD
================================================================= */

type ProfileFieldProps = {
  label: string;
  icon: React.ReactNode;
  value: string;
  editing: boolean;
  type?: string;
  placeholder?: string;
  displayValue?: string;
  accent?: 'indigo' | 'violet';
  onChange: (value: string) => void;
};

const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  icon,
  value,
  editing,
  type = 'text',
  placeholder,
  displayValue,
  accent = 'indigo',
  onChange,
}) => {
  const iconColor =
    accent === 'violet'
      ? 'text-violet-400'
      : 'text-indigo-400';

  if (editing) {
    return (
      <div className="space-y-2">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </label>

        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </span>

          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3 pl-10 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-700 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <div className="flex min-h-[48px] items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-950/40 px-3.5 py-3">
        <span className={`${iconColor} shrink-0`}>
          {icon}
        </span>

        <span className="min-w-0 truncate text-sm font-medium text-slate-200">
          {displayValue || value || (
            <span className="italic text-slate-600">
              Not specified
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

/* =================================================================
   REUSABLE SELECT FIELD
================================================================= */

type ProfileSelectFieldProps = {
  label: string;
  icon: React.ReactNode;
  value: string;
  editing: boolean;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (value: string) => void;
};

const ProfileSelectField: React.FC<ProfileSelectFieldProps> = ({
  label,
  icon,
  value,
  editing,
  options,
  onChange,
}) => {
  if (editing) {
    return (
      <div className="space-y-2">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </label>

        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-500">
            {icon}
          </span>

          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-xl border border-slate-800 bg-slate-950/80 py-3 pl-10 pr-10 text-sm text-slate-100 outline-none transition hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option
              value=""
              className="bg-slate-900 text-slate-500"
            >
              Select Gender...
            </option>

            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-slate-900 text-slate-100"
              >
                {option.label}
              </option>
            ))}
          </select>

          <ChevronRight
            size={15}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 text-slate-500"
          />
        </div>
      </div>
    );
  }

  const selectedOption = options.find(
    (option) => option.value === value
  );

  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <div className="flex min-h-[48px] items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-950/40 px-3.5 py-3">
        <span className="shrink-0 text-indigo-400">
          {icon}
        </span>

        <span className="text-sm font-medium capitalize text-slate-200">
          {selectedOption?.label || (
            <span className="italic text-slate-600">
              Not specified
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

/* =================================================================
   REUSABLE INFORMATION CARD
================================================================= */

type InfoCardProps = {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

const InfoCard: React.FC<InfoCardProps> = ({
  label,
  icon,
  children,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
        <span className="text-slate-600">
          {icon}
        </span>

        {label}
      </div>

      <div className="min-h-[48px] rounded-xl border border-slate-800/80 bg-slate-950/40 px-3.5 py-3">
        {children}
      </div>
    </div>
  );
};

export default StudentProfile;