import React from 'react';
import UserLayout from '../../layouts/UserLayout';
import {
  User, Calendar, Award, BookOpen, Hash, Shield
} from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Profile fields from the Teacher model
  const profileFields = [
    { icon: <User size={18} />, label: 'Full Name', value: user.name || '—' },
    { icon: <Hash size={18} />, label: 'Employee Number', value: user.employeeNumber || '—' },
    { icon: <Award size={18} />, label: 'Qualification', value: user.qualification || '—' },
    { icon: <BookOpen size={18} />, label: 'Specialization', value: user.specialization || '—' },
    { icon: <Calendar size={18} />, label: 'Joining Date', value: user.joiningDate ? new Date(user.joiningDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
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

        {/* Profile Details */}
        <div className="card">
          <h3 className="text-white font-semibold text-base mb-1">Professional Information</h3>
          <p className="text-slate-500 text-xs mb-5">Your teacher profile details</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profileFields.map((field) => (
              <div key={field.label} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--role-bg)' }}>
                  <span style={{ color: 'var(--role-accent)' }}>{field.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 mb-0.5">{field.label}</p>
                  <p className="text-sm font-medium text-white truncate">{field.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Info */}
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
