import React from 'react';
import UserLayout from '../../layouts/UserLayout';
import {
  GraduationCap, Star, CheckSquare, CreditCard,
  TrendingUp, Bell, MessageSquare, Calendar
} from 'lucide-react';

const stats = [
  { label: "Child's GPA",    value: '3.6',  sub: 'This semester',   color: 'bg-amber-500/15',   iconColor: 'text-amber-400',  icon: <Star size={22} /> },
  { label: 'Attendance',     value: '96%',  sub: 'Current term',    color: 'bg-emerald-500/15', iconColor: 'text-emerald-400', icon: <CheckSquare size={22} /> },
  { label: 'Fee Balance',    value: '$240', sub: 'Outstanding',     color: 'bg-red-500/15',     iconColor: 'text-red-400',    icon: <CreditCard size={22} /> },
  { label: 'Rank in Class',  value: '5th',  sub: 'Out of 38',       color: 'bg-violet-500/15',  iconColor: 'text-violet-400', icon: <GraduationCap size={22} /> },
];

const grades = [
  { subject: 'Mathematics',   grade: 'A-', score: 89, teacher: 'Mrs. Williams' },
  { subject: 'Physics',       grade: 'B+', score: 86, teacher: 'Mr. Omondi' },
  { subject: 'English',       grade: 'A',  score: 91, teacher: 'Ms. Kamau' },
  { subject: 'History',       grade: 'B',  score: 82, teacher: 'Mr. Mutua' },
  { subject: 'Computer Sci.', grade: 'A+', score: 97, teacher: 'Mr. Njiru' },
];

const events = [
  { title: 'Parent-Teacher Meeting', date: 'Sep 20, 2024', type: 'Meeting' },
  { title: 'Mid-Term Exams Begin',   date: 'Oct 15, 2024', type: 'Exam' },
  { title: 'Sports Day',             date: 'Oct 25, 2024', type: 'Event' },
];

const ParentDashboard: React.FC = () => (
  <UserLayout role="PARENT" pageTitle="Parent Dashboard" activePath="/dashboard">
    <div className="space-y-6">

      {/* Welcome */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(251,191,36,0.1))', borderColor: 'rgba(245,158,11,0.3)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-xl mb-1">Hello, Mr. Johnson 🌟</h2>
            <p className="text-slate-400 text-sm">Alex is doing great! A top 5 student this term.</p>
          </div>
          <TrendingUp size={42} className="text-amber-400 opacity-30 hidden md:block" />
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

        {/* Grades Table */}
        <div className="xl:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold text-base">Alex's Academic Report</h3>
              <p className="text-slate-500 text-xs">Current semester grades</p>
            </div>
            <button className="btn-primary text-xs py-1.5 px-3"><Star size={13} /> Full Report</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Teacher</th>
                  <th>Score</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g) => (
                  <tr key={g.subject}>
                    <td className="font-medium text-white">{g.subject}</td>
                    <td className="text-slate-400">{g.teacher}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span>{g.score}%</span>
                        <div className="w-16 progress-bar">
                          <div className="progress-fill" style={{ width: `${g.score}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${g.score >= 90 ? 'badge-success' : g.score >= 80 ? 'badge-info' : 'badge-warning'}`}>
                        {g.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fee notice */}
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <CreditCard size={16} className="text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-300 text-sm font-semibold">Outstanding Fee: $240</p>
              <p className="text-slate-400 text-xs">Due by October 1, 2024. Please settle to avoid late charges.</p>
            </div>
            <button className="sm:ml-auto btn-primary text-xs py-1 px-3" style={{ background: 'linear-gradient(135deg,#ef4444,#f87171)' }}>Pay Now</button>
          </div>
        </div>

        {/* Events & Messages */}
        <div className="card">
          <h3 className="text-white font-semibold text-base mb-1">Upcoming Events</h3>
          <p className="text-slate-500 text-xs mb-4">School calendar</p>
          <div className="space-y-3">
            {events.map((e) => (
              <div key={e.title} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--role-bg)' }}>
                  <Calendar size={14} style={{ color: 'var(--role-accent)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{e.title}</p>
                  <p className="text-xs text-slate-500">{e.date}</p>
                </div>
                <span className="badge badge-info text-xs">{e.type}</span>
              </div>
            ))}
          </div>

          {/* Message shortcut */}
          <div className="mt-4 p-3 rounded-xl" style={{ background: 'var(--role-bg)', border: '1px solid var(--role-border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={13} style={{ color: 'var(--role-accent)' }} />
              <p className="text-xs font-semibold" style={{ color: 'var(--role-accent)' }}>New Message</p>
            </div>
            <p className="text-slate-300 text-xs mb-3">Mrs. Williams sent you a message about Math progress.</p>
            <button className="btn-primary text-xs py-1.5 w-full justify-center">
              <MessageSquare size={13} /> View Message
            </button>
          </div>

          {/* School notification */}
          <div className="mt-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <Bell size={13} className="text-slate-400" />
              <p className="text-xs font-semibold text-slate-400">School Notice</p>
            </div>
            <p className="text-slate-400 text-xs">Mid-term break: Oct 21–25. School resumes Oct 28.</p>
          </div>
        </div>
      </div>
    </div>
  </UserLayout>
);

export default ParentDashboard;
