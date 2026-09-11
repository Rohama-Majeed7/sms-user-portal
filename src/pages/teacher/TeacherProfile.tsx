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
  Mail,
  Building2,
  Briefcase,
  UserRound,
} from 'lucide-react';
import { updateTeacherProfile } from '../../apis/teacher/teacher.service';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';

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
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const TeacherProfile: React.FC = () => {
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

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError('');
    if (success) setSuccess('');
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
    if (saving) return;

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

      localStorage.setItem('user', JSON.stringify(updatedUser));
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
    if (!value) return null;
    try {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return null;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return null;
    }
  };

  const displayName = user?.name || 'Faculty Profile';

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
      pageTitle="Faculty Profile"
      activePath="/teacher-profile"
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
                <div className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl bg-emerald-600 text-white text-2xl font-bold flex items-center justify-center shadow-md shadow-emerald-500/20">
                  {initials}
                </div>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 ring-4 ring-white" />
              </div>

              {/* Faculty Identity */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight truncate">
                    {displayName}
                  </h1>
                  <Badge variant="teacher">
                    <Briefcase className="h-3.5 w-3.5 mr-1" />
                    Faculty Member
                  </Badge>
                </div>

                <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 truncate">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    {user?.email || 'No email specified'}
                  </span>
                  <span className="hidden sm:inline text-slate-300">•</span>
                  <span className="flex items-center gap-1.5 truncate">
                    <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    {schoolName}
                  </span>
                </div>

                {form.employeeNumber && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 font-mono text-xs font-semibold text-emerald-800">
                    <Hash className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Faculty ID: {form.employeeNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            {!editing ? (
              <Button
                variant="success"
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
                  variant="success"
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
        <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
          {/* Section 1: Faculty & Employment */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Faculty &amp; Employment Details</CardTitle>
                  <CardDescription>
                    Professional qualifications, employment registration, and subject areas
                  </CardDescription>
                </div>
              </div>
              {editing && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Editing
                </span>
              )}
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {/* Employee Number */}
                {editing ? (
                  <Input
                    label="Employee Number"
                    value={form.employeeNumber}
                    placeholder="e.g. EMP-2024-019"
                    leftIcon={<Hash className="h-4 w-4" />}
                    onChange={(e) => handleChange('employeeNumber', e.target.value)}
                  />
                ) : (
                  <ViewField
                    label="Employee Number"
                    value={form.employeeNumber}
                    icon={<Hash className="h-4 w-4" />}
                  />
                )}

                {/* Joining Date */}
                {editing ? (
                  <Input
                    type="date"
                    label="Joining Date"
                    value={form.joiningDate}
                    leftIcon={<Calendar className="h-4 w-4" />}
                    onChange={(e) => handleChange('joiningDate', e.target.value)}
                  />
                ) : (
                  <ViewField
                    label="Joining Date"
                    value={formatDate(form.joiningDate) || ''}
                    icon={<Calendar className="h-4 w-4" />}
                  />
                )}

                {/* Qualification */}
                {editing ? (
                  <Input
                    label="Highest Qualification"
                    value={form.qualification}
                    placeholder="e.g. M.Sc. Mathematics, B.Ed"
                    leftIcon={<Award className="h-4 w-4" />}
                    onChange={(e) => handleChange('qualification', e.target.value)}
                  />
                ) : (
                  <ViewField
                    label="Highest Qualification"
                    value={form.qualification}
                    icon={<Award className="h-4 w-4" />}
                  />
                )}

                {/* Specialization */}
                {editing ? (
                  <Input
                    label="Subject Specialization"
                    value={form.specialization}
                    placeholder="e.g. Advanced Calculus, Mechanics"
                    leftIcon={<BookOpen className="h-4 w-4" />}
                    onChange={(e) => handleChange('specialization', e.target.value)}
                  />
                ) : (
                  <ViewField
                    label="Subject Specialization"
                    value={form.specialization}
                    icon={<BookOpen className="h-4 w-4" />}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Account & Department */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Account &amp; Department Information</CardTitle>
                  <CardDescription>
                    Institutional credentials and role status
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Account ID
                  </p>
                  <p className="mt-1 font-mono text-xs font-semibold text-slate-800 truncate">
                    {user?.id || 'System Generated'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Portal Role
                  </p>
                  <p className="mt-1 text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                    <UserRound className="h-4 w-4" />
                    <span>Teacher / Faculty</span>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Institution
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800 truncate">
                    {schoolName}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sticky Bottom Save Action Bar when in Edit Mode */}
          {editing && (
            <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-white border border-slate-200 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-up">
              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-900">Unsaved Changes:</span> Verify all
                faculty registration details before saving.
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel} disabled={saving}>
                  Cancel
                </Button>
                <Button
                  variant="success"
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
      <span className={`truncate ${value ? 'text-slate-900 font-medium' : 'text-slate-400 italic'}`}>
        {value || 'Not specified'}
      </span>
    </div>
  </div>
);

export default TeacherProfile;