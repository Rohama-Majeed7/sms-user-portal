import React from 'react';
import UserLayout from '../../layouts/UserLayout';
import {
  Users, Star, CheckSquare, BookOpen,
  MoreHorizontal, TrendingUp, Bell, ClipboardList
} from 'lucide-react';

const stats = [
  { label: 'My Students',   value: '142', sub: 'Across 4 classes', color: 'bg-emerald-500/15', iconColor: 'text-emerald-400', icon: <Users size={22} /> },
  { label: 'Avg. Score',    value: '78%', sub: 'Class average',    color: 'bg-sky-500/15',     iconColor: 'text-sky-400',     icon: <Star size={22} /> },
  { label: 'Attendance',    value: '91%', sub: 'This week',        color: 'bg-violet-500/15',  iconColor: 'text-violet-400',  icon: <CheckSquare size={22} /> },
  { label: 'Subjects',      value: '5',   sub: 'Teaching now',     color: 'bg-amber-500/15',   iconColor: 'text-amber-400',   icon: <BookOpen size={22} /> },
];

const classes = [
  { name: 'Form 4A – Mathematics', students: 38, avgScore: 82, status: 'Active' },
  { name: 'Form 3B – Mathematics', students: 35, avgScore: 74, status: 'Active' },
  { name: 'Form 4A – Physics',     students: 38, avgScore: 79, status: 'Active' },
  { name: 'Form 2C – Mathematics', students: 31, avgScore: 70, status: 'Active' },
];

const pendingTasks = [
  { task: 'Grade Form 4A Mid-Term Papers', due: 'Today',    priority: 'High' },
  { task: 'Submit Attendance – Form 3B',   due: 'Today',    priority: 'High' },
  { task: 'Prepare Form 2C Quiz',          due: 'Friday',   priority: 'Medium' },
  { task: 'Parent Meeting Preparation',    due: 'Monday',   priority: 'Low' },
];

const TeacherDashboard: React.FC = () => (
  <UserLayout role="TEACHER" pageTitle="Teacher Dashboard" activePath="/dashboard">
    <div className="space-y-6">

      {/* Welcome */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(52,211,153,0.1))', borderColor: 'rgba(16,185,129,0.3)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-xl mb-1">Good morning, Mrs. Williams 🌿</h2>
            <p className="text-slate-400 text-sm">You have 2 tasks to complete today. Stay on track!</p>
          </div>
          <TrendingUp size={42} className="text-emerald-400 opacity-30 hidden md:block" />
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

        {/* Classes Table */}
        <div className="xl:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold text-base">My Classes</h3>
              <p className="text-slate-500 text-xs">Current semester</p>
            </div>
            <button className="btn-primary text-xs py-1.5 px-3"><Users size={13} /> All Students</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Students</th>
                  <th>Avg. Score</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {classes.map((c) => (
                  <tr key={c.name}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--role-bg)' }}>
                          <BookOpen size={13} style={{ color: 'var(--role-accent)' }} />
                        </div>
                        <span className="text-sm font-medium text-white">{c.name}</span>
                      </div>
                    </td>
                    <td>{c.students}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{c.avgScore}%</span>
                        <div className="w-16 progress-bar">
                          <div className="progress-fill" style={{ width: `${c.avgScore}%` }} />
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-success">{c.status}</span></td>
                    <td><button className="text-slate-500 hover:text-white transition"><MoreHorizontal size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="card">
          <h3 className="text-white font-semibold text-base mb-1">Pending Tasks</h3>
          <p className="text-slate-500 text-xs mb-4">Action required</p>
          <div className="space-y-3">
            {pendingTasks.map((t) => (
              <div key={t.task} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--role-bg)' }}>
                  <ClipboardList size={14} style={{ color: 'var(--role-accent)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white leading-snug">{t.task}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Due: {t.due}</p>
                </div>
                <span className={`badge flex-shrink-0 ${t.priority === 'High' ? 'badge-danger' : t.priority === 'Medium' ? 'badge-warning' : 'badge-info'}`}>
                  {t.priority}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-xl" style={{ background: 'var(--role-bg)', border: '1px solid var(--role-border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Bell size={13} style={{ color: 'var(--role-accent)' }} />
              <p className="text-xs font-semibold" style={{ color: 'var(--role-accent)' }}>Reminder</p>
            </div>
            <p className="text-slate-300 text-xs">Staff meeting tomorrow at 8:00 AM in Room 12.</p>
          </div>
        </div>
      </div>
    </div>
  </UserLayout>
);

export default TeacherDashboard;
