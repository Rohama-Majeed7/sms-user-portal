import React, { useState } from 'react';
import UserLayout from '../../layouts/UserLayout';
import {
  User, Calendar, Award, BookOpen, Hash, Shield, Pencil, X, Save, Loader2
} from 'lucide-react';
import { updateTeacherProfile } from '../../apis/teacher/teacher.service';

const TeacherDashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editable form state
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

  const handleSave = async () => {
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
      // Update localStorage with new data
      const updated = { ...user, ...res.user, ...res.teacher, ...form };
      localStorage.setItem('user', JSON.stringify(updated));
      setSuccess('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (val: string) => {
    if (!val) return '—';
    return new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const profileFields = [
    { icon: <Hash size={18} />, label: 'Employee Number', key: 'employeeNumber', type: 'text' },
    { icon: <Award size={18} />, label: 'Qualification', key: 'qualification', type: 'text' },
    { icon: <BookOpen size={18} />, label: 'Specialization', key: 'specialization', type: 'text' },
    { icon: <Calendar size={18} />, label: 'Joining Date', key: 'joiningDate', type: 'date' },
  ];

  return (
    <UserLayout role="TEACHER" pageTitle="My Profile" activePath="/profile">
      <div className="space-y-6">

        {/* Profile Header Card */}
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(52,211,153,0.1))', borderColor: 'rgba(16,185,129,0.3)' }}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white" style={{ background: 'linear-gradient(135deg, var(--role-primary), var(--role-accent))' }}>
              {user.initials || user.name?.charAt(0) || 'T'}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-bold text-xl mb-0.5">{user.name || 'Teacher'}</h2>
              <p className="text-slate-400 text-sm">{user.email || '—'}</p>
              <span className="role-badge mt-1.5">Teacher</span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 animate-pulse" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Profile Details */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-white font-semibold text-base mb-1">Professional Information</h3>
              <p className="text-slate-500 text-xs">Your teacher profile details</p>
            </div>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-xl transition cursor-pointer"
                style={{ background: 'var(--role-bg)', color: 'var(--role-accent)', border: '1px solid var(--role-border)' }}
              >
                <Pencil size={14} /> Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition cursor-pointer disabled:opacity-50"
                >
                  <X size={14} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-xl text-white transition cursor-pointer disabled:opacity-50"
                  style={{ background: 'var(--role-primary)' }}
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profileFields.map((field) => (
              <div key={field.key} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--role-bg)' }}>
                  <span style={{ color: 'var(--role-accent)' }}>{field.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 mb-1">{field.label}</p>
                  {editing ? (
                    <input
                      type={field.type}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-emerald-500 transition"
                    />
                  ) : (
                    <p className="text-sm font-medium text-white truncate">
                      {field.type === 'date'
                        ? formatDate(form[field.key as keyof typeof form])
                        : (form[field.key as keyof typeof form] || '—')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Info (read-only) */}
        <div className="card">
          <h3 className="text-white font-semibold text-base mb-1">Account Information</h3>
          <p className="text-slate-500 text-xs mb-5">Your portal account details</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--role-bg)' }}>
                <span style={{ color: 'var(--role-accent)' }}><User size={18} /></span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 mb-0.5">User ID</p>
                <p className="text-sm font-medium text-white truncate">{user.id || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--role-bg)' }}>
                <span style={{ color: 'var(--role-accent)' }}><Shield size={18} /></span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 mb-0.5">Role</p>
                <p className="text-sm font-medium text-white">Teacher</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </UserLayout>
  );
};

export default TeacherDashboard;
