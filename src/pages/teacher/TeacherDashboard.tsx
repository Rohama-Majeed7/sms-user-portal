import React from 'react';
import UserLayout from '../../layouts/UserLayout';
import {
  Users, Star, CheckSquare, BookOpen,
  Bell, ClipboardList,
  Calendar, User, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Enrolled Students', value: '142', sub: 'Across 4 active sections', color: 'bg-emerald-500/15', iconColor: 'text-emerald-400', icon: <Users size={22} /> },
  { label: 'Class Average', value: '78.4%', sub: '+3.2% vs previous term', color: 'bg-sky-500/15', iconColor: 'text-sky-400', icon: <Star size={22} /> },
  { label: 'Weekly Attendance', value: '91.8%', sub: 'Consistent across classes', color: 'bg-violet-500/15', iconColor: 'text-violet-400', icon: <CheckSquare size={22} /> },
  { label: 'Assigned Courses', value: '5', sub: 'Mathematics & Sciences', color: 'bg-amber-500/15', iconColor: 'text-amber-400', icon: <BookOpen size={22} /> },
];

const classes = [
  { name: 'Form 4A – Mathematics', room: 'Hall B, Rm 102', students: 38, avgScore: 82, status: 'Active' },
  { name: 'Form 3B – Mathematics', room: 'Building A, Rm 204', students: 35, avgScore: 74, status: 'Active' },
  { name: 'Form 4A – Physics', room: 'Science Lab 2', students: 38, avgScore: 79, status: 'Active' },
  { name: 'Form 2C – Mathematics', room: 'Building C, Rm 110', students: 31, avgScore: 70, status: 'Active' },
];

const pendingTasks = [
  { task: 'Grade Form 4A Mid-Term Papers', due: 'Today at 5:00 PM', priority: 'High', badge: 'badge-danger' },
  { task: 'Submit Attendance – Form 3B', due: 'Today before 3:00 PM', priority: 'High', badge: 'badge-danger' },
  { task: 'Prepare Form 2C Weekly Quiz', due: 'Friday, 10:00 AM', priority: 'Medium', badge: 'badge-warning' },
  { task: 'Departmental Faculty Meeting', due: 'Next Monday, 9:00 AM', priority: 'Normal', badge: 'badge-info' },
];

const TeacherDashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <UserLayout role="TEACHER" pageTitle="Faculty Dashboard" activePath="/teacher-dashboard">
      <div className="space-y-6 sm:space-y-8">

        {/* ─── Welcome Hero Banner ─── */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 p-6 sm:p-8 shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                <Calendar size={14} />
                <span>{today}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Good day, {user.name ? `${user.name}` : 'Teacher'} 🌿
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                You have <span className="text-emerald-300 font-semibold">2 priority tasks</span> pending submission today. Check your classroom roster and task deadlines below.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/teacher-profile"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition cursor-pointer"
              >
                <User size={15} /> View Faculty Profile <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Stats Cards Grid ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div className={`stat-icon ${s.color}`}>
                <span className={s.iconColor}>{s.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-400 text-xs font-medium mb-1 truncate">{s.label}</p>
                <p className="text-white font-bold text-xl sm:text-2xl tracking-tight leading-none">{s.value}</p>
                <p className="text-slate-500 text-[11px] sm:text-xs mt-1.5 truncate">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Main Content Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* Classes Table Card (2 Columns on Large) */}
          <div className="lg:col-span-2 card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Active Classroom Sections</h3>
                  <p className="text-xs text-slate-400">Current courses and section performance metrics</p>
                </div>
                <span className="badge badge-success text-xs font-semibold hidden sm:inline-flex">
                  4 Active Sections
                </span>
              </div>

              {/* Table Wrapper with Clean Scroll */}
              <div className="overflow-x-auto rounded-xl border border-slate-800/80">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Class / Subject</th>
                      <th>Room</th>
                      <th>Students</th>
                      <th>Avg. Score</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((c) => (
                      <tr key={c.name}>
                        <td>
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--role-bg)' }}>
                              <BookOpen size={14} style={{ color: 'var(--role-accent)' }} />
                            </div>
                            <span className="text-sm font-semibold text-white truncate max-w-[200px]">{c.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="text-xs text-slate-400">{c.room}</span>
                        </td>
                        <td>
                          <span className="text-sm font-medium text-slate-300">{c.students}</span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm font-semibold text-white">{c.avgScore}%</span>
                            <div className="w-16 sm:w-20 progress-bar">
                              <div className="progress-fill" style={{ width: `${c.avgScore}%` }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-success text-xs">{c.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span>Updated in real-time</span>
              <span className="text-emerald-400 font-medium cursor-pointer hover:underline">Download Attendance Sheet &rarr;</span>
            </div>
          </div>

          {/* Right Column: Pending Action Items & Reminders */}
          <div className="space-y-6">

            {/* Pending Tasks Card */}
            <div className="card">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Faculty Task List</h3>
                  <p className="text-xs text-slate-400">Action items requiring attention</p>
                </div>
                <span className="badge badge-danger text-xs font-semibold">2 Urgent</span>
              </div>

              <div className="space-y-3">
                {pendingTasks.map((t) => (
                  <div key={t.task} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--role-bg)' }}>
                      <ClipboardList size={15} style={{ color: 'var(--role-accent)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-white truncate leading-snug">{t.task}</p>
                      <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">{t.due}</p>
                    </div>
                    <span className={`badge ${t.badge} text-[10px] sm:text-xs font-semibold flex-shrink-0`}>
                      {t.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Faculty Reminder Box */}
            <div className="rounded-2xl p-4 sm:p-5 border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 to-slate-900">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Bell size={14} />
                </div>
                <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Faculty Notice</p>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Staff meeting tomorrow at 8:00 AM in Conference Room 12. Please have all section attendance records updated prior to the session.
              </p>
            </div>

          </div>

        </div>
      </div>
    </UserLayout>
  );
};

export default TeacherDashboard;
