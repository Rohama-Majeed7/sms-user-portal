import React from 'react';
import UserLayout from '../../layouts/UserLayout';
import {
  Users,
  Star,
  CheckSquare,
  BookOpen,
  Bell,
  ClipboardList,
  Calendar,
  User,
  ChevronRight,
  ArrowUpRight,
  Clock3,
  MapPin,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  {
    label: 'Enrolled Students',
    value: '142',
    sub: 'Across 4 active sections',
    color: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    icon: Users,
  },
  {
    label: 'Class Average',
    value: '78.4%',
    sub: '+3.2% vs previous term',
    color: 'bg-sky-500/15',
    iconColor: 'text-sky-400',
    icon: Star,
  },
  {
    label: 'Weekly Attendance',
    value: '91.8%',
    sub: 'Consistent across classes',
    color: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
    icon: CheckSquare,
  },
  {
    label: 'Assigned Courses',
    value: '5',
    sub: 'Mathematics & Sciences',
    color: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    icon: BookOpen,
  },
];

const classes = [
  {
    name: 'Form 4A – Mathematics',
    room: 'Hall B, Rm 102',
    students: 38,
    avgScore: 82,
    status: 'Active',
  },
  {
    name: 'Form 3B – Mathematics',
    room: 'Building A, Rm 204',
    students: 35,
    avgScore: 74,
    status: 'Active',
  },
  {
    name: 'Form 4A – Physics',
    room: 'Science Lab 2',
    students: 38,
    avgScore: 79,
    status: 'Active',
  },
  {
    name: 'Form 2C – Mathematics',
    room: 'Building C, Rm 110',
    students: 31,
    avgScore: 70,
    status: 'Active',
  },
];

const pendingTasks = [
  {
    task: 'Grade Form 4A Mid-Term Papers',
    due: 'Today at 5:00 PM',
    priority: 'High',
    badge: 'badge-danger',
  },
  {
    task: 'Submit Attendance – Form 3B',
    due: 'Today before 3:00 PM',
    priority: 'High',
    badge: 'badge-danger',
  },
  {
    task: 'Prepare Form 2C Weekly Quiz',
    due: 'Friday, 10:00 AM',
    priority: 'Medium',
    badge: 'badge-warning',
  },
  {
    task: 'Departmental Faculty Meeting',
    due: 'Next Monday, 9:00 AM',
    priority: 'Normal',
    badge: 'badge-info',
  },
];

const TeacherDashboard: React.FC = () => {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  })();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const firstName = user?.name?.split(' ')[0] || 'Teacher';

  return (
    <UserLayout
      role="TEACHER"
      pageTitle="Faculty Dashboard"
      activePath="/teacher-dashboard"
    >
      <div className="space-y-6 sm:space-y-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-950 via-emerald-950/30 to-slate-900 shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-emerald-400/5 blur-3xl" />

          <div className="relative z-10 p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                  <Calendar size={13} />
                  {today}
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  Good day, {firstName} 🌿
                </h1>

                <p className="mt-3 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm">
                  Stay on top of your classes, student performance, and
                  faculty responsibilities. You have{' '}
                  <span className="font-semibold text-emerald-300">
                    2 priority tasks
                  </span>{' '}
                  requiring attention today.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to="/teacher-profile"
                    className="group inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/15 px-4 py-2.5 text-xs font-semibold text-emerald-300 transition-all duration-200 hover:border-emerald-400/40 hover:bg-emerald-500/25 hover:text-emerald-200 sm:text-sm"
                  >
                    <User size={15} />
                    View Faculty Profile
                    <ChevronRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </div>

              {/* Hero summary */}
              <div className="grid grid-cols-2 gap-3 sm:max-w-sm lg:w-[310px]">
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-sm">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                    <GraduationCap size={18} />
                  </div>
                  <p className="text-xl font-bold text-white">4</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Active sections
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-sm">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                    <TrendingUp size={18} />
                  </div>
                  <p className="text-xl font-bold text-white">78.4%</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Overall average
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900/80 sm:p-5"
              >
                <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-white/[0.02] blur-2xl" />

                <div className="relative flex items-center gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon size={21} className={stat.iconColor} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-slate-500">
                      {stat.label}
                    </p>

                    <p className="mt-1 text-2xl font-bold tracking-tight text-white">
                      {stat.value}
                    </p>

                    <p className="mt-1 truncate text-[11px] text-slate-500">
                      {stat.sub}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Classes */}
          <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60 shadow-xl xl:col-span-2">
            <div className="border-b border-slate-800/80 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                      <BookOpen size={15} />
                    </div>

                    <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">
                      Active Classroom Sections
                    </h2>
                  </div>

                  <p className="mt-1 pl-10 text-xs text-slate-500">
                    Current courses and section performance metrics
                  </p>
                </div>

                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  4 Active Sections
                </span>
              </div>
            </div>

            {/* Desktop / tablet table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-900/30">
                    <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Class / Subject
                    </th>
                    <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Room
                    </th>
                    <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Students
                    </th>
                    <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Avg. Score
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {classes.map((item) => (
                    <tr
                      key={item.name}
                      className="border-b border-slate-800/50 transition-colors last:border-0 hover:bg-slate-900/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                            <BookOpen size={15} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {item.name}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-500">
                              Mathematics & Sciences
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <MapPin size={13} className="text-slate-600" />
                          {item.room}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-300">
                          <Users size={14} className="text-slate-600" />
                          {item.students}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex min-w-[145px] items-center gap-3">
                          <span className="w-9 text-sm font-bold text-white">
                            {item.avgScore}%
                          </span>

                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all"
                              style={{ width: `${item.avgScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 p-4 md:hidden">
              {classes.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 transition hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                        <BookOpen size={15} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {item.name}
                        </p>

                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                          <MapPin size={12} />
                          {item.room}
                        </div>
                      </div>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[9px] font-semibold text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-slate-950/60 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Students
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-200">
                        <Users size={13} className="text-slate-500" />
                        {item.students}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-950/60 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Average
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {item.avgScore}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${item.avgScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-800/80 px-5 py-4 text-xs sm:flex-row sm:items-center sm:justify-between">
              <span className="text-slate-600">
                Last synchronized with academic records
              </span>

              <button
                type="button"
                className="inline-flex items-center gap-1 font-semibold text-emerald-400 transition hover:text-emerald-300 hover:underline"
              >
                Download Attendance Sheet
                <ArrowUpRight size={13} />
              </button>
            </div>
          </section>

          {/* Right Column */}
          <aside className="space-y-6">
            {/* Tasks */}
            <section className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5 shadow-xl sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                      <ClipboardList size={15} />
                    </div>

                    <h2 className="text-base font-bold tracking-tight text-white">
                      Faculty Task List
                    </h2>
                  </div>

                  <p className="mt-1 pl-10 text-xs text-slate-500">
                    Action items requiring attention
                  </p>
                </div>

                <span className="inline-flex shrink-0 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold text-red-300">
                  2 Urgent
                </span>
              </div>

              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div
                    key={task.task}
                    className="group rounded-xl border border-slate-800/80 bg-slate-900/40 p-3.5 transition-all hover:border-slate-700 hover:bg-slate-900/70"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                        <ClipboardList size={14} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold leading-5 text-slate-200 sm:text-sm">
                          {task.task}
                        </p>

                        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-500 sm:text-[11px]">
                          <Clock3 size={12} />
                          {task.due}
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-semibold sm:text-[10px] ${task.badge}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/50 py-2.5 text-xs font-semibold text-slate-400 transition hover:border-slate-700 hover:bg-slate-900 hover:text-white"
              >
                View All Tasks
                <ChevronRight size={13} />
              </button>
            </section>

            {/* Faculty Notice */}
            <section className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-900 p-5 shadow-xl sm:p-6">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl" />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                      <Bell size={16} />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        Faculty Notice
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-600">
                        Important reminder
                      </p>
                    </div>
                  </div>

                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                </div>

                <p className="text-xs leading-6 text-slate-300 sm:text-sm">
                  Staff meeting tomorrow at{' '}
                  <span className="font-semibold text-white">8:00 AM</span> in{' '}
                  <span className="font-semibold text-white">
                    Conference Room 12
                  </span>
                  . Please have all section attendance records updated prior
                  to the session.
                </p>

                <div className="mt-4 flex items-center gap-2 border-t border-emerald-500/10 pt-4 text-[10px] font-medium text-emerald-400">
                  <Clock3 size={12} />
                  Tomorrow · 8:00 AM
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </UserLayout>
  );
};

export default TeacherDashboard;