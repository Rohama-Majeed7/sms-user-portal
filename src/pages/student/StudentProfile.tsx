import React, { useState } from 'react';
import UserLayout from '../../layouts/UserLayout';
import {
  User, Calendar, MapPin, Phone, Shield, Hash, Pencil, X, Save, Loader2,
  Mail, CheckCircle2, AlertCircle, Building2, UserCheck, Sparkles
} from 'lucide-react';
import { updateStudentProfile } from '../../apis/student/student.service';

const StudentProfile: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const school = JSON.parse(localStorage.getItem('sms_selected_school') || '{}');
  const schoolName = school.name || school.schoolName || user.schoolName || 'SMS Portal';

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    gender: user.gender || '',
    address: user.address || '',
    guardianName: user.guardianName || '',
    guardianPhone: user.guardianPhone || '',
    admissionNumber: user.admissionNumber || '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setForm({
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      gender: user.gender || '',
      address: user.address || '',
      guardianName: user.guardianName || '',
      guardianPhone: user.guardianPhone || '',
      admissionNumber: user.admissionNumber || '',
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
      const res = await updateStudentProfile({
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
        address: form.address || undefined,
        guardianName: form.guardianName || undefined,
        guardianPhone: form.guardianPhone || undefined,
        admissionNumber: form.admissionNumber || undefined,
      });

      const updated = { ...user, ...res?.user, ...res?.student, ...form };
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
    <UserLayout role="STUDENT" pageTitle="Student Profile" activePath="/student-profile">
      <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">

        {/* ─── Hero Profile Header Banner ─── */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 p-5 sm:p-7 md:p-8 shadow-2xl backdrop-blur-xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-xl shadow-indigo-600/25 border-2 border-white/10">
                  {user.initials || user.name?.charAt(0) || 'S'}
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 bg-slate-900 rounded-full border border-slate-700">
                  <span className="block w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" title="Active Account" />
                </div>
              </div>

              {/* Title & Badges */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight truncate">
                    {user.name || 'Student Profile'}
                  </h2>
                  <span className="role-badge">Student</span>
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

                {form.admissionNumber && (
                  <p className="text-xs font-mono text-indigo-300/80 pt-0.5">
                    Admission ID: <span className="font-semibold">{form.admissionNumber}</span>
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
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition cursor-pointer"
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
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
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

          {/* Section 1: Academic & Personal Info */}
          <div className="card">
            <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-slate-800/80 mb-5 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Personal & Academic Details</h3>
                  <p className="text-xs text-slate-400">Basic identification and student enrollment details</p>
                </div>
              </div>
              {editing && (
                <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20 hidden sm:inline-block">
                  Editing Mode
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Admission Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Admission Number
                </label>
                {editing ? (
                  <div className="relative">
                    <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      value={form.admissionNumber}
                      onChange={(e) => handleChange('admissionNumber', e.target.value)}
                      placeholder="e.g. ADM-2026-0042"
                      className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-600 outline-none transition"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 min-h-[48px]">
                    <Hash size={16} className="text-indigo-400/80 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-200 truncate">
                      {form.admissionNumber || <span className="text-slate-500 italic">Not specified</span>}
                    </span>
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Date of Birth
                </label>
                {editing ? (
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-100 outline-none transition scheme-dark"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 min-h-[48px]">
                    <Calendar size={16} className="text-indigo-400/80 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-200 truncate">
                      {formatDate(form.dateOfBirth) || <span className="text-slate-500 italic">Not specified</span>}
                    </span>
                  </div>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Gender
                </label>
                {editing ? (
                  <div className="relative">
                    <Shield size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <select
                      value={form.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl pl-10 pr-8 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-100 outline-none transition appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-slate-900 text-slate-400">Select Gender...</option>
                      <option value="MALE" className="bg-slate-900 text-slate-100">Male</option>
                      <option value="FEMALE" className="bg-slate-900 text-slate-100">Female</option>
                      <option value="OTHER" className="bg-slate-900 text-slate-100">Other</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 min-h-[48px]">
                    <Shield size={16} className="text-indigo-400/80 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-200 capitalize">
                      {form.gender ? form.gender.toLowerCase() : <span className="text-slate-500 italic">Not specified</span>}
                    </span>
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Residential Address
                </label>
                {editing ? (
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="e.g. 123 University Ave, Block B"
                      className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-600 outline-none transition"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 min-h-[48px]">
                    <MapPin size={16} className="text-indigo-400/80 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-200 truncate">
                      {form.address || <span className="text-slate-500 italic">Not specified</span>}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Guardian Information */}
          <div className="card">
            <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-slate-800/80 mb-5 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                  <UserCheck size={18} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Guardian & Emergency Contact</h3>
                  <p className="text-xs text-slate-400">Authorized parent or guardian contact information</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Guardian Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Guardian Full Name
                </label>
                {editing ? (
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      value={form.guardianName}
                      onChange={(e) => handleChange('guardianName', e.target.value)}
                      placeholder="e.g. Robert Williams"
                      className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-600 outline-none transition"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 min-h-[48px]">
                    <User size={16} className="text-violet-400/80 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-200 truncate">
                      {form.guardianName || <span className="text-slate-500 italic">Not specified</span>}
                    </span>
                  </div>
                )}
              </div>

              {/* Guardian Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Guardian Phone Number
                </label>
                {editing ? (
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="tel"
                      value={form.guardianPhone}
                      onChange={(e) => handleChange('guardianPhone', e.target.value)}
                      placeholder="e.g. +1 (555) 123-4567"
                      className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-600 outline-none transition"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 min-h-[48px]">
                    <Phone size={16} className="text-violet-400/80 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-200 truncate">
                      {form.guardianPhone || <span className="text-slate-500 italic">Not specified</span>}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Account & Security Overview (Read-Only) */}
          <div className="card">
            <div className="flex items-center gap-3 pb-4 sm:pb-5 border-b border-slate-800/80 mb-5 sm:mb-6">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                <Shield size={18} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Account & System Information</h3>
                <p className="text-xs text-slate-400">System credentials and school affiliation details</p>
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
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Assigned Role</span>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-sm font-semibold text-indigo-400">Student</span>
                  <Sparkles size={14} className="text-indigo-400" />
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
            <div className="sticky bottom-4 z-20 flex items-center justify-end gap-3 p-4 rounded-2xl bg-slate-900/95 border border-indigo-500/30 backdrop-blur-xl shadow-2xl animate-in slide-in-from-bottom-3">
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
                className="inline-flex items-center gap-2 px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 transition cursor-pointer disabled:opacity-50"
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

export default StudentProfile;
