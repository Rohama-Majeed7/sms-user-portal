import React, { useMemo, useState } from 'react';
import UserLayout from '../../layouts/UserLayout';
import {
  Calendar,
  Award,
  BookOpen,
  Hash,
  Shield,
  Pencil,
  X,
  Save,
  Loader2,
  Mail,
  CheckCircle2,
  AlertCircle,
  Building2,
  Briefcase,
  Sparkles,
  UserRound,
  BadgeCheck,
} from 'lucide-react';
import { updateTeacherProfile } from '../../apis/teacher/teacher.service';

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  initials?: string;
  schoolName?: string;
  employeeNumber?: string;
  qualification?: string;
  specialization?: string;
  joiningDate?: string;
  role?: string;
}

interface ProfileForm {
  employeeNumber: string;
  qualification: string;
  specialization: string;
  joiningDate: string;
}

const safeParseStorage = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const TeacherProfile: React.FC = () => {
  const user = useMemo(
    () => safeParseStorage<UserData>('user', {}),
    []
  );

  const school = useMemo(
    () => safeParseStorage<Record<string, string>>('sms_selected_school', {}),
    []
  );

  const schoolName =
    school?.name ||
    school?.schoolName ||
    user?.schoolName ||
    'SMS Portal';

  const getInitialForm = (): ProfileForm => ({
    employeeNumber: user?.employeeNumber || '',
    qualification: user?.qualification || '',
    specialization: user?.specialization || '',
    joiningDate: user?.joiningDate
      ? new Date(user.joiningDate).toISOString().split('T')[0]
      : '',
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

    if (saving) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      setSaving(true);

      const res = await updateTeacherProfile({
        employeeNumber: form.employeeNumber || undefined,
        qualification: form.qualification || undefined,
        specialization: form.specialization || undefined,
        joiningDate: form.joiningDate || undefined,
      });

      const updatedUser: UserData = {
        ...user,
        ...res?.user,
        ...res?.teacher,
        ...form,
      };

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      );

      setSuccess('Your faculty profile has been updated successfully.');
      setEditing(false);

      window.setTimeout(() => {
        setSuccess('');
      }, 4000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Failed to update your profile. Please check your connection and try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (value: string) => {
    if (!value) {
      return null;
    }

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

  const displayName = user?.name || 'Teacher Profile';

  const initials =
    user?.initials ||
    user?.name
      ?.split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase() ||
    'T';

  return (
    <UserLayout
      role="TEACHER"
      pageTitle="Teacher Profile"
      activePath="/teacher-profile"
    >
      <div className="mx-auto max-w-5xl space-y-6 pb-8 sm:space-y-8">
        {/* =========================================================
            PROFILE HERO
        ========================================================= */}
        <section className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 shadow-2xl sm:rounded-3xl">
          {/* Ambient effects */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />

          {/* Top accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

          <div className="relative z-10 p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              {/* Identity */}
              <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
                {/* Avatar */}
                <div className="relative mx-auto shrink-0 sm:mx-0">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-2xl font-bold text-white shadow-xl shadow-emerald-600/20 sm:h-24 sm:w-24 sm:rounded-3xl sm:text-3xl">
                    {initials}
                  </div>

                  <div className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border-4 border-slate-950 bg-emerald-500">
                    <BadgeCheck
                      size={13}
                      className="text-white"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="min-w-0 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <h1 className="max-w-full truncate text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                      {displayName}
                    </h1>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                      <Sparkles size={11} />
                      Faculty
                    </span>
                  </div>

                  <div className="mt-2 flex flex-col items-center gap-2 text-xs text-slate-400 sm:flex-row sm:flex-wrap sm:justify-start sm:gap-x-4">
                    <span className="inline-flex max-w-full items-center gap-1.5 truncate">
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

                    <span className="inline-flex max-w-full items-center gap-1.5 truncate">
                      <Building2
                        size={14}
                        className="shrink-0 text-slate-500"
                      />
                      <span className="truncate">
                        {schoolName}
                      </span>
                    </span>
                  </div>

                  {form.employeeNumber && (
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/10 bg-emerald-500/5 px-2.5 py-1">
                      <Hash
                        size={12}
                        className="text-emerald-400/80"
                      />
                      <span className="font-mono text-[11px] text-emerald-300/90">
                        Faculty ID:
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-emerald-200">
                        {form.employeeNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Header Actions */}
              <div className="w-full lg:w-auto">
                {!editing ? (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/25 active:scale-[0.98] sm:w-auto sm:text-sm"
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
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:text-sm"
                    >
                      <X size={15} />
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSave()}
                      disabled={saving}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:from-emerald-500 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:text-sm"
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

            {/* Editing indicator */}
            {editing && (
              <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-3.5 py-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />

                <span className="text-[11px] font-medium text-emerald-300">
                  Editing faculty profile information
                </span>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================
            ALERTS
        ========================================================= */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-300 shadow-lg"
          >
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-400"
            />

            <div className="min-w-0">
              <p className="text-xs font-semibold sm:text-sm">
                Update failed
              </p>

              <p className="mt-0.5 text-xs leading-5 text-red-300/80">
                {error}
              </p>
            </div>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-300 shadow-lg"
          >
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0 text-emerald-400"
            />

            <div className="min-w-0">
              <p className="text-xs font-semibold sm:text-sm">
                Profile updated
              </p>

              <p className="mt-0.5 text-xs leading-5 text-emerald-300/80">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* =========================================================
            FORM
        ========================================================= */}
        <form
          onSubmit={handleSave}
          className="space-y-6 sm:space-y-8"
        >
          {/* =======================================================
              PROFESSIONAL INFORMATION
          ======================================================= */}
          <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60 shadow-xl">
            <div className="border-b border-slate-800/80 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                  <Briefcase size={18} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">
                      Faculty & Employment
                    </h2>

                    {editing && (
                      <span className="hidden rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-emerald-400 sm:inline-block">
                        Editing
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Professional credentials and academic qualifications
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:gap-6 sm:p-6">
              {/* Employee Number */}
              <ProfileField
                label="Employee Number"
                icon={<Hash size={16} />}
                editing={editing}
                value={form.employeeNumber}
                placeholder="e.g. EMP-2024-019"
                onChange={(value) =>
                  handleChange('employeeNumber', value)
                }
                emptyText="Not specified"
              />

              {/* Joining Date */}
              <ProfileField
                label="Joining Date"
                icon={<Calendar size={16} />}
                editing={editing}
                type="date"
                value={form.joiningDate}
                displayValue={
                  formatDate(form.joiningDate) || undefined
                }
                onChange={(value) =>
                  handleChange('joiningDate', value)
                }
                emptyText="Not specified"
              />

              {/* Qualification */}
              <ProfileField
                label="Highest Qualification"
                icon={<Award size={16} />}
                editing={editing}
                value={form.qualification}
                placeholder="e.g. M.Sc. Mathematics, B.Ed"
                onChange={(value) =>
                  handleChange('qualification', value)
                }
                emptyText="Not specified"
              />

              {/* Specialization */}
              <ProfileField
                label="Subject Specialization"
                icon={<BookOpen size={16} />}
                editing={editing}
                value={form.specialization}
                placeholder="e.g. Advanced Calculus, Mechanics"
                onChange={(value) =>
                  handleChange('specialization', value)
                }
                emptyText="Not specified"
              />
            </div>
          </section>

          {/* =======================================================
              ACCOUNT INFORMATION
          ======================================================= */}
          <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60 shadow-xl">
            <div className="border-b border-slate-800/80 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/10 text-teal-400">
                  <Shield size={18} />
                </div>

                <div>
                  <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">
                    Account & Department
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Institutional system credentials and account status
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:p-6">
              {/* Account ID */}
              <InfoCard
                label="Account ID"
                value={user?.id || 'System Generated'}
                icon={<Hash size={15} />}
                mono={Boolean(user?.id)}
              />

              {/* Portal Role */}
              <InfoCard
                label="Portal Role"
                value="Teacher / Faculty"
                icon={<UserRound size={15} />}
                accent
              />

              {/* Institution */}
              <InfoCard
                label="Institution"
                value={schoolName}
                icon={<Building2 size={15} />}
              />
            </div>
          </section>

          {/* =======================================================
              EDITING SAVE BAR
          ======================================================= */}
          {editing && (
            <div className="sticky bottom-4 z-30">
              <div className="flex flex-col gap-3 rounded-2xl border border-emerald-500/20 bg-slate-900/95 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-4">
                <div className="hidden items-center gap-2 sm:flex">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Pencil size={14} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-200">
                      Unsaved changes
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Review your information before saving.
                    </p>
                  </div>
                </div>

                <div className="flex w-full gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:from-emerald-500 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
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
      </div>
    </UserLayout>
  );
};

/* ===============================================================
   REUSABLE PROFILE FIELD
================================================================ */

interface ProfileFieldProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  displayValue?: string;
  placeholder?: string;
  emptyText?: string;
  type?: 'text' | 'date';
  editing: boolean;
  onChange: (value: string) => void;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  icon,
  value,
  displayValue,
  placeholder,
  emptyText = 'Not specified',
  type = 'text',
  editing,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">
        {label}
      </label>

      {editing ? (
        <div className="group relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-600 transition group-focus-within:text-emerald-400">
            {icon}
          </span>

          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            aria-label={label}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3 pl-10 pr-4 text-xs text-slate-100 outline-none transition placeholder:text-slate-700 hover:border-slate-700 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10 sm:text-sm"
          />
        </div>
      ) : (
        <div className="flex min-h-[48px] items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-900/50 p-3.5">
          <span className="shrink-0 text-emerald-400/70">
            {icon}
          </span>

          <span className="min-w-0 truncate text-sm font-medium text-slate-200">
            {displayValue || value || (
              <span className="italic text-slate-600">
                {emptyText}
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

/* ===============================================================
   REUSABLE INFO CARD
================================================================ */

interface InfoCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: boolean;
  mono?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({
  label,
  value,
  icon,
  accent = false,
  mono = false,
}) => {
  return (
    <div className="group rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 transition hover:border-slate-700 hover:bg-slate-900/80">
      <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-600">
        <span className="text-slate-500">
          {icon}
        </span>

        {label}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p
          title={value}
          className={`min-w-0 truncate text-sm font-semibold ${
            accent ? 'text-emerald-400' : 'text-slate-200'
          } ${mono ? 'font-mono text-xs' : ''}`}
        >
          {value}
        </p>

        {accent && (
          <Sparkles
            size={14}
            className="shrink-0 text-emerald-400/70"
          />
        )}
      </div>
    </div>
  );
};

export default TeacherProfile;