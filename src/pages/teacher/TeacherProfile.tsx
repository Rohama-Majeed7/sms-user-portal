import React, { useState } from 'react';
import UserLayout from '../../layouts/UserLayout';
import {
  Calendar, Award, BookOpen, Hash, Shield, Pencil, X, Save, Loader2,
  Mail, CheckCircle2, AlertCircle, Building2, Briefcase, Sparkles
} from 'lucide-react';
import { updateTeacherProfile } from '../../apis/teacher/teacher.service';

const TeacherProfile: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const school = JSON.parse(localStorage.getItem('sms_selected_school') || '{}');
  const schoolName = school.name || school.schoolName || user.schoolName || 'SMS Portal';

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    employeeNumber: user.employeeNumber || '',
    qualification: user.qualification || '',
    specialization: user.specialization || '',
    joiningDate: user.joiningDate ? new Date(user.joiningDate).toISOString().split('T')[0] : '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setForm({
      employeeNumber: user.employeeNumber || '',
      qualification: user.qualification || '',
      specialization: user.specialization || '',
      joiningDate: user.joiningDate ? new Date(user.joiningDate).toISOString().split('T')[0] : '',
    });
    setEditing(false);
    setError('');
    setSuccess('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const updated = { ...user, ...res?.user, ...res?.teacher, ...form };
      localStorage.setItem('user', JSON.stringify(updated));
      setSuccess('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update profile. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (val: string) => {
    if (!val) return null;
    try {
      const date = new Date(val);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return null;
    }
  };

  return (
    <UserLayout role="TEACHER" pageTitle="Teacher Profile" activePath="/teacher-profile">
      <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">

        {/* ─── Hero Profile Header Banner ─── */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 p-5 sm:p-7 md:p-8 shadow-2xl backdrop-blur-xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-xl shadow-emerald-600/25 border-2 border-white/10">
                  {user.initials || user.name?.charAt(0) || 'T'}
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 bg-slate-900 rounded-full border border-slate-700">
                  <span className="block w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" title="Active Faculty Member" />
                </div>
              </div>

              {/* Title & Badges */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight truncate">
                    {user.name || 'Teacher Profile'}
                  </h2>
                  <span className="role-badge">Faculty</span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-400">
                  <span className="flex items-center gap-1.5 truncate">
                    <Mail size={14} className="text-slate-500" />
                    {user.email || 'No email specified'}
                  </span>
                  <span className="hidden sm:inline text-slate-700">•</span>
                  <span className="flex items-center gap-1.5 truncate">
                    <Building2 size={14} className="text-slate-500" />
                    {schoolName}
                  </span>
                </div>

                {form.employeeNumber && (
                  <p className="text-xs font-mono text-emerald-300/80 pt-0.5">
                    Faculty ID: <span className="font-semibold">{form.employeeNumber}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Header Action Button */}
            <div className="flex items-center gap-3 pt-2 md:pt-0">
              {!editing ? (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition cursor-pointer"
                >
                  <Pencil size={15} /> Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer disabled:opacity-50"
                  >
                    <X size={15} /> Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Notification Alerts ─── */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs sm:text-sm flex items-start gap-3 shadow-lg animate-in fade-in">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}
        {success && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs sm:text-sm flex items-start gap-3 shadow-lg animate-in fade-in">
            <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{success}</span>
          </div>
        )}

        {/* ─── Form / View Sections ─── */}
        <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">

          {/* Section 1: Professional Information */}
          <div className="card">
            <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-slate-800/80 mb-5 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Briefcase size={18} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Faculty & Employment Credentials</h3>
                  <p className="text-xs text-slate-400">Institutional records, credentials, and academic qualifications</p>
                </div>
              </div>
              {editing && (
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 hidden sm:inline-block">
                  Editing Mode
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Employee Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Employee Number
                </label>
                {editing ? (
                  <div className="relative">
                    <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      value={form.employeeNumber}
                      onChange={(e) => handleChange('employeeNumber', e.target.value)}
                      placeholder="e.g. EMP-2024-019"
                      className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-600 outline-none transition"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 min-h-[48px]">
                    <Hash size={16} className="text-emerald-400/80 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-200 truncate">
                      {form.employeeNumber || <span className="text-slate-500 italic">Not specified</span>}
                    </span>
                  </div>
                )}
              </div>

              {/* Joining Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Joining Date
                </label>
                {editing ? (
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="date"
                      value={form.joiningDate}
                      onChange={(e) => handleChange('joiningDate', e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-100 outline-none transition scheme-dark"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 min-h-[48px]">
                    <Calendar size={16} className="text-emerald-400/80 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-200 truncate">
                      {formatDate(form.joiningDate) || <span className="text-slate-500 italic">Not specified</span>}
                    </span>
                  </div>
                )}
              </div>

              {/* Qualification */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Highest Qualification
                </label>
                {editing ? (
                  <div className="relative">
                    <Award size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      value={form.qualification}
                      onChange={(e) => handleChange('qualification', e.target.value)}
                      placeholder="e.g. M.Sc. Mathematics, B.Ed"
                      className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-600 outline-none transition"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 min-h-[48px]">
                    <Award size={16} className="text-emerald-400/80 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-200 truncate">
                      {form.qualification || <span className="text-slate-500 italic">Not specified</span>}
                    </span>
                  </div>
                )}
              </div>

              {/* Specialization */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Subject Specialization
                </label>
                {editing ? (
                  <div className="relative">
                    <BookOpen size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      value={form.specialization}
                      onChange={(e) => handleChange('specialization', e.target.value)}
                      placeholder="e.g. Advanced Calculus, Mechanics"
                      className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-600 outline-none transition"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 min-h-[48px]">
                    <BookOpen size={16} className="text-emerald-400/80 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-200 truncate">
                      {form.specialization || <span className="text-slate-500 italic">Not specified</span>}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Account & System Information (Read-Only) */}
          <div className="card">
            <div className="flex items-center gap-3 pb-4 sm:pb-5 border-b border-slate-800/80 mb-5 sm:mb-6">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
                <Shield size={18} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Account & Department Information</h3>
                <p className="text-xs text-slate-400">Institutional system credentials and profile status</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-1.5">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Account ID</span>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <p className="text-xs font-mono text-slate-300 truncate" title={user.id || 'N/A'}>
                    {user.id || 'System Generated'}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Portal Role</span>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-sm font-semibold text-emerald-400">Teacher / Faculty</span>
                  <Sparkles size={14} className="text-emerald-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Institution</span>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <p className="text-sm font-medium text-slate-200 truncate">{schoolName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Save bar in editing mode */}
          {editing && (
            <div className="sticky bottom-4 z-20 flex items-center justify-end gap-3 p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/30 backdrop-blur-xl shadow-2xl animate-in slide-in-from-bottom-3">
              <span className="text-xs text-slate-400 hidden sm:inline">You have unsaved changes</span>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30 transition cursor-pointer disabled:opacity-50"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          )}
        </form>

      </div>
    </UserLayout>
  );
};

export default TeacherProfile;
