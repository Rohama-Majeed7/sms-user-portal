import React from 'react';
import UserLayout from '../../layouts/UserLayout';
import {
  Star, CheckSquare, BookOpen, Clock,
  ArrowUpRight, FileText, Bell,
  Calendar, User, ChevronRight, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Cumulative GPA', value: '3.8', sub: 'Top 10% of class', color: 'bg-indigo-500/15', iconColor: 'text-indigo-400', icon: <Star size={22} /> },
  { label: 'Attendance Rate', value: '94.2%', sub: '+2.1% from last month', color: 'bg-sky-500/15', iconColor: 'text-sky-400', icon: <CheckSquare size={22} /> },
  { label: 'Active Courses', value: '7', sub: 'Semester 1 enrolled', color: 'bg-violet-500/15', iconColor: 'text-violet-400', icon: <BookOpen size={22} /> },
  { label: 'Pending Tasks', value: '2', sub: 'Due in next 48 hours', color: 'bg-amber-500/15', iconColor: 'text-amber-400', icon: <Clock size={22} /> },
];

const subjects = [
  { name: 'Advanced Mathematics', teacher: 'Dr. Henderson', grade: 'A', score: 92, progress: 92 },
  { name: 'Quantum Physics', teacher: 'Prof. Miller', grade: 'B+', score: 87, progress: 87 },
  { name: 'English Literature', teacher: 'Mrs. Davis', grade: 'A-', score: 89, progress: 89 },
  { name: 'World History', teacher: 'Mr. Clarke', grade: 'B', score: 83, progress: 83 },
  { name: 'Computer Science', teacher: 'Ms. Zhang', grade: 'A+', score: 97, progress: 97 },
];

const upcoming = [
  { title: 'Calculus Assignment 4', due: 'Tomorrow at 11:59 PM', type: 'Assignment', badgeColor: 'badge-warning' },
  { title: 'Thermodynamics Mid-Quiz', due: 'Friday, 10:00 AM', type: 'Quiz', badgeColor: 'badge-danger' },
  { title: 'Shakespeare Essay Draft', due: 'Next Monday', type: 'Essay', badgeColor: 'badge-info' },
];

const StudentDashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <UserLayout role="STUDENT" pageTitle="Student Dashboard" activePath="/student-dashboard">
      <div className="space-y-6 sm:space-y-8">

        {/* ─── Welcome Hero Banner ─── */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-8 shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 tracking-wider uppercase">
                <Calendar size={14} />
                <span>{today}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Welcome back, {user.name || 'Student'} 👋
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                You have <span className="text-indigo-300 font-semibold">2 assignments due</span> this week. Keep up the great pace and review your academic progress below.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/student-profile"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 transition cursor-pointer"
              >
                <User size={15} /> View Profile <ChevronRight size={14} />
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

          {/* Subject Performance Card (2 Columns on Large) */}
          <div className="lg:col-span-2 card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Subject Performance</h3>
                  <p className="text-xs text-slate-400">Current semester grading and milestones</p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <Award size={14} /> Honor Roll Standing
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {subjects.map((s) => (
                  <div key={s.name} className="p-3.5 sm:p-4 rounded-xl bg-slate-900/50 border border-slate-800/70 hover:border-slate-700/80 transition">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <span className="text-sm sm:text-base font-semibold text-white truncate block">{s.name}</span>
                        <span className="text-xs text-slate-500">{s.teacher}</span>
                      </div>
                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        <span className="badge badge-info text-xs font-bold px-2.5 py-0.5">{s.grade}</span>
                        <div className="flex items-center gap-0.5 text-emerald-400 text-xs sm:text-sm font-semibold">
                          <ArrowUpRight size={15} />{s.score}%
                        </div>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${s.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span>Updated 2 hours ago</span>
              <span className="text-indigo-400 font-medium cursor-pointer hover:underline">Academic Records &rarr;</span>
            </div>
          </div>

          {/* Right Column: Upcoming Tasks & Notice Board */}
          <div className="space-y-6">

            {/* Upcoming Tasks Card */}
            <div className="card">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Upcoming Deadlines</h3>
                  <p className="text-xs text-slate-400">Assignments & examinations due</p>
                </div>
                <span className="badge badge-warning text-xs font-semibold">3 Active</span>
              </div>

              <div className="space-y-3">
                {upcoming.map((t) => (
                  <div key={t.title} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--role-bg)' }}>
                      <FileText size={15} style={{ color: 'var(--role-accent)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-white truncate leading-snug">{t.title}</p>
                      <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">{t.due}</p>
                    </div>
                    <span className={`badge ${t.badgeColor} text-[10px] sm:text-xs font-semibold flex-shrink-0`}>
                      {t.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements Notice Card */}
            <div className="rounded-2xl p-4 sm:p-5 border border-indigo-500/20 bg-gradient-to-br from-indigo-950/30 to-slate-900">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Bell size={14} />
                </div>
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Campus Announcement</p>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Mid-term examinations scheduled for October 15–20. Please ensure all coursework submissions are complete.
              </p>
            </div>

          </div>

        </div>
      </div>
    </UserLayout>
  );
};

export default StudentDashboard;
