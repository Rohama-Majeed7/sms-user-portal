import React from 'react';
import UserLayout from '../../layouts/UserLayout';
import {
  Star,
  CheckSquare,
  BookOpen,
  Clock,
  ArrowUpRight,
  FileText,
  Bell,
  Calendar,
  User,
  ChevronRight,
  Award,
  TrendingUp,
  MoreHorizontal,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type Stat = {
  label: string;
  value: string;
  sub: string;
  color: string;
  iconColor: string;
  icon: React.ElementType;
};

type Subject = {
  name: string;
  teacher: string;
  grade: string;
  score: number;
  progress: number;
};

type UpcomingTask = {
  title: string;
  due: string;
  type: string;
  badgeColor: string;
};

const stats: Stat[] = [
  {
    label: 'Cumulative GPA',
    value: '3.8',
    sub: 'Top 10% of class',
    color: 'bg-indigo-500/10',
    iconColor: 'text-indigo-400',
    icon: Star,
  },
  {
    label: 'Attendance Rate',
    value: '94.2%',
    sub: '+2.1% from last month',
    color: 'bg-sky-500/10',
    iconColor: 'text-sky-400',
    icon: CheckSquare,
  },
  {
    label: 'Active Courses',
    value: '7',
    sub: 'Semester 1 enrolled',
    color: 'bg-violet-500/10',
    iconColor: 'text-violet-400',
    icon: BookOpen,
  },
  {
    label: 'Pending Tasks',
    value: '2',
    sub: 'Due in next 48 hours',
    color: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    icon: Clock,
  },
];

const subjects: Subject[] = [
  {
    name: 'Advanced Mathematics',
    teacher: 'Dr. Henderson',
    grade: 'A',
    score: 92,
    progress: 92,
  },
  {
    name: 'Quantum Physics',
    teacher: 'Prof. Miller',
    grade: 'B+',
    score: 87,
    progress: 87,
  },
  {
    name: 'English Literature',
    teacher: 'Mrs. Davis',
    grade: 'A-',
    score: 89,
    progress: 89,
  },
  {
    name: 'World History',
    teacher: 'Mr. Clarke',
    grade: 'B',
    score: 83,
    progress: 83,
  },
  {
    name: 'Computer Science',
    teacher: 'Ms. Zhang',
    grade: 'A+',
    score: 97,
    progress: 97,
  },
];

const upcoming: UpcomingTask[] = [
  {
    title: 'Calculus Assignment 4',
    due: 'Tomorrow at 11:59 PM',
    type: 'Assignment',
    badgeColor:
      'bg-amber-500/10 text-amber-300 border-amber-500/20',
  },
  {
    title: 'Thermodynamics Mid-Quiz',
    due: 'Friday, 10:00 AM',
    type: 'Quiz',
    badgeColor:
      'bg-rose-500/10 text-rose-300 border-rose-500/20',
  },
  {
    title: 'Shakespeare Essay Draft',
    due: 'Next Monday',
    type: 'Essay',
    badgeColor:
      'bg-sky-500/10 text-sky-300 border-sky-500/20',
  },
];

const getGradeStyles = (grade: string) => {
  if (grade === 'A+' || grade === 'A') {
    return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
  }

  if (grade === 'A-') {
    return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
  }

  if (grade === 'B+') {
    return 'bg-sky-500/10 text-sky-300 border-sky-500/20';
  }

  return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
};

const StudentDashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const userName = user?.name || 'Student';

  return (
    <UserLayout
      role="STUDENT"
      pageTitle="Student Dashboard"
      activePath="/student-dashboard"
    >
      <div className="w-full space-y-6 pb-8 sm:space-y-8">

        {/* =========================================================
            WELCOME HERO
        ========================================================== */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950 shadow-xl shadow-black/10 sm:rounded-3xl">

          {/* Background decorations */}
          <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />

          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-950" />

          <div className="relative z-10 p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              {/* Hero content */}
              <div className="max-w-2xl">

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
                  <Calendar size={13} />
                  <span>{today}</span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  Welcome back, {userName}
                  <span className="ml-2">👋</span>
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-[15px]">
                  Stay on top of your academic journey. You have{' '}
                  <span className="font-semibold text-indigo-300">
                    2 assignments due
                  </span>{' '}
                  this week. Keep up the great work!
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    to="/student-profile"
                    className="group inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-xs font-semibold text-indigo-200 transition-all duration-200 hover:border-indigo-400/40 hover:bg-indigo-500/20 hover:text-white sm:text-sm"
                  >
                    <User size={15} />

                    <span>View Profile</span>

                    <ChevronRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>

                  <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    All systems operational
                  </div>
                </div>
              </div>

              {/* Hero right-side summary */}
              <div className="hidden shrink-0 lg:block">
                <div className="w-52 rounded-2xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      Semester progress
                    </span>

                    <TrendingUp
                      size={16}
                      className="text-emerald-400"
                    />
                  </div>

                  <div className="text-2xl font-bold text-white">
                    78%
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                      style={{ width: '78%' }}
                    />
                  </div>

                  <p className="mt-2 text-[11px] text-slate-500">
                    9 weeks remaining
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            STATS
        ========================================================== */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-lg shadow-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900 sm:p-5"
              >
                {/* Decorative glow */}
                <div
                  className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full ${stat.color} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div className="relative flex items-start gap-4">

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/5 ${stat.color}`}
                  >
                    <Icon
                      size={21}
                      className={stat.iconColor}
                      strokeWidth={2}
                    />
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

                  <button
                    type="button"
                    className="rounded-lg p-1 text-slate-600 transition hover:bg-slate-800 hover:text-slate-300"
                    aria-label={`More options for ${stat.label}`}
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        {/* =========================================================
            MAIN CONTENT
        ========================================================== */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* =======================================================
              SUBJECT PERFORMANCE
          ======================================================== */}
          <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl shadow-black/5 xl:col-span-2">

            {/* Header */}
            <div className="flex flex-col gap-3 border-b border-slate-800/80 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

              <div>
                <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">
                  Subject Performance
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Current semester grades and academic milestones
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-300">
                <Award size={14} />
                Honor Roll
              </div>
            </div>

            {/* Subjects */}
            <div className="space-y-3 p-4 sm:space-y-4 sm:p-6">

              {subjects.map((subject) => (
                <div
                  key={subject.name}
                  className="group rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 transition-all duration-200 hover:border-slate-700 hover:bg-slate-950/70"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    {/* Subject information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-white sm:text-[15px]">
                          {subject.name}
                        </span>

                        {subject.score >= 90 && (
                          <span className="hidden rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-400 sm:inline-flex">
                            Excellent
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        {subject.teacher}
                      </p>
                    </div>

                    {/* Grade + score */}
                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <span
                        className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${getGradeStyles(
                          subject.grade
                        )}`}
                      >
                        {subject.grade}
                      </span>

                      <div className="flex items-center gap-1 text-sm font-semibold text-emerald-400">
                        <ArrowUpRight size={15} />
                        {subject.score}%
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-3">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
                        Progress
                      </span>

                      <span className="text-[10px] font-medium text-slate-500">
                        {subject.progress}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 group-hover:from-indigo-400 group-hover:to-violet-400"
                        style={{
                          width: `${subject.progress}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-2 border-t border-slate-800/80 px-5 py-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <span className="text-slate-600">
                Updated 2 hours ago
              </span>

              <Link
                to="/academic-records"
                className="font-semibold text-indigo-400 transition hover:text-indigo-300"
              >
                View Academic Records →
              </Link>
            </div>
          </section>

          {/* =======================================================
              RIGHT COLUMN
          ======================================================== */}
          <aside className="space-y-6">

            {/* =====================================================
                UPCOMING DEADLINES
            ====================================================== */}
            <section className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-xl shadow-black/5 sm:p-6">

              <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-800/80 pb-4">

                <div>
                  <h2 className="text-base font-bold tracking-tight text-white">
                    Upcoming Deadlines
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Assignments & examinations
                  </p>
                </div>

                <span className="shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-300">
                  3 Active
                </span>
              </div>

              <div className="space-y-3">
                {upcoming.map((task) => (
                  <div
                    key={task.title}
                    className="group flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 transition-all duration-200 hover:border-slate-700 hover:bg-slate-950/70"
                  >
                    {/* Icon */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-500/10 bg-indigo-500/10 text-indigo-400">
                      <FileText size={16} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold leading-5 text-white sm:text-sm">
                        {task.title}
                      </p>

                      <p className="mt-0.5 text-[11px] leading-5 text-slate-500 sm:text-xs">
                        {task.due}
                      </p>
                    </div>

                    {/* Badge */}
                    <span
                      className={`shrink-0 rounded-md border px-2 py-1 text-[9px] font-bold uppercase tracking-wide sm:text-[10px] ${task.badgeColor}`}
                    >
                      {task.type}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950/50 py-2.5 text-xs font-semibold text-slate-400 transition hover:border-slate-700 hover:bg-slate-800/60 hover:text-white"
              >
                View all deadlines
                <ChevronRight size={14} />
              </button>
            </section>

            {/* =====================================================
                ANNOUNCEMENT
            ====================================================== */}
            <section className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-950 p-5 shadow-xl shadow-indigo-950/10 sm:p-6">

              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />

              <div className="relative">

                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                      <Bell size={15} />
                    </div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-300">
                      Campus Announcement
                    </p>
                  </div>

                  <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/40" />
                </div>

                <h3 className="text-sm font-semibold leading-5 text-white">
                  Mid-term examinations
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-400 sm:text-sm">
                  Mid-term examinations are scheduled for{' '}
                  <span className="font-semibold text-slate-200">
                    October 15–20
                  </span>
                  . Please ensure all coursework submissions are complete.
                </p>

                <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-indigo-400">
                  <Calendar size={13} />
                  October 15–20
                </div>
              </div>
            </section>

          </aside>
        </div>
      </div>
    </UserLayout>
  );
};

export default StudentDashboard;