import React from 'react';
import UserLayout from '../../layouts/UserLayout';
import {
  Star, CheckSquare, BookOpen, Clock,
  ArrowUpRight, TrendingUp, FileText, Bell
} from 'lucide-react';

const stats = [
  { label: 'GPA', value: '3.8', sub: 'Out of 4.0', color: 'bg-indigo-500/15', iconColor: 'text-indigo-400', icon: <Star size={22} /> },
  { label: 'Attendance', value: '94%', sub: 'This semester', color: 'bg-sky-500/15', iconColor: 'text-sky-400', icon: <CheckSquare size={22} /> },
  { label: 'Subjects', value: '7', sub: 'Active courses', color: 'bg-violet-500/15', iconColor: 'text-violet-400', icon: <BookOpen size={22} /> },
  { label: 'Due Tasks', value: '2', sub: 'Assignments due', color: 'bg-amber-500/15', iconColor: 'text-amber-400', icon: <Clock size={22} /> },
];

const subjects = [
  { name: 'Mathematics', grade: 'A', score: 92, progress: 92 },
  { name: 'Physics', grade: 'B+', score: 87, progress: 87 },
  { name: 'English', grade: 'A-', score: 89, progress: 89 },
  { name: 'History', grade: 'B', score: 83, progress: 83 },
  { name: 'Computer Sci.', grade: 'A+', score: 97, progress: 97 },
];

const upcoming = [
  { title: 'Math Assignment', due: 'Tomorrow', type: 'Assignment' },
  { title: 'Physics Quiz', due: 'Friday', type: 'Quiz' },
  { title: 'English Essay', due: 'Next Mon', type: 'Essay' },
];

const StudentDashboard: React.FC = () => (
  <UserLayout role="STUDENT" pageTitle="My Dashboard" activePath="/student-dashboard">
    <div className="space-y-6">

      {/* Welcome */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(129,140,248,0.1))', borderColor: 'rgba(99,102,241,0.3)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-xl mb-1">Welcome back 👋</h2>
            <p className="text-slate-400 text-sm">You have 2 assignments due this week. Keep it up!</p>
          </div>
          <TrendingUp size={42} className="text-indigo-400 opacity-30 hidden md:block" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.color}`}><span className={s.iconColor}>{s.icon}</span></div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-400 text-xs mb-0.5">{s.label}</p>
              <p className="text-white font-bold text-xl">{s.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Subject Progress */}
        <div className="xl:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-white font-semibold text-base">Subject Performance</h3>
              <p className="text-slate-500 text-xs">Current semester grades</p>
            </div>
            <button className="btn-primary text-xs py-1.5 px-3"><Star size={13} /> Full Report</button>
          </div>
          <div className="space-y-4">
            {subjects.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{s.name}</span>
                    <span className="badge badge-info text-xs">{s.grade}</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                    <ArrowUpRight size={13} />{s.score}%
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${s.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="card">
          <h3 className="text-white font-semibold text-base mb-1">Upcoming Tasks</h3>
          <p className="text-slate-500 text-xs mb-4">Due soon</p>
          <div className="space-y-3">
            {upcoming.map((t) => (
              <div key={t.title} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--role-bg)' }}>
                  <FileText size={14} style={{ color: 'var(--role-accent)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{t.title}</p>
                  <p className="text-xs text-slate-500">Due: {t.due}</p>
                </div>
                <span className="badge badge-warning text-xs">{t.type}</span>
              </div>
            ))}
          </div>

          {/* Announcements */}
          <div className="mt-4 p-3 rounded-xl" style={{ background: 'var(--role-bg)', border: '1px solid var(--role-border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Bell size={13} style={{ color: 'var(--role-accent)' }} />
              <p className="text-xs font-semibold" style={{ color: 'var(--role-accent)' }}>Announcement</p>
            </div>
            <p className="text-slate-300 text-xs">Mid-term exams scheduled for Oct 15–20. Check your timetable.</p>
          </div>
        </div>
      </div>
    </div>
  </UserLayout>
);

export default StudentDashboard;
