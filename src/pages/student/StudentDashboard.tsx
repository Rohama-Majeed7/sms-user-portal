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
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';

type Stat = {
  label: string;
  value: string;
  sub: string;
  iconBg: string;
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
  badgeVariant: 'warning' | 'danger' | 'info';
};

const stats: Stat[] = [
  {
    label: 'Cumulative GPA',
    value: '3.8',
    sub: 'Top 10% of class rank',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    icon: Star,
  },
  {
    label: 'Attendance Rate',
    value: '94.2%',
    sub: '+2.1% from last month',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
    icon: CheckSquare,
  },
  {
    label: 'Active Courses',
    value: '7',
    sub: 'Semester 1 enrolled',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    icon: BookOpen,
  },
  {
    label: 'Pending Tasks',
    value: '2',
    sub: 'Due in next 48 hours',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
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
    badgeVariant: 'warning',
  },
  {
    title: 'Thermodynamics Mid-Quiz',
    due: 'Friday, 10:00 AM',
    type: 'Quiz',
    badgeVariant: 'danger',
  },
  {
    title: 'Shakespeare Essay Draft',
    due: 'Next Monday',
    type: 'Essay',
    badgeVariant: 'info',
  },
];

const getGradeBadge = (grade: string) => {
  if (grade.startsWith('A')) {
    return <Badge variant="success">{grade}</Badge>;
  }
  if (grade.startsWith('B')) {
    return <Badge variant="info">{grade}</Badge>;
  }
  return <Badge variant="neutral">{grade}</Badge>;
};

export const StudentDashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const userName = user?.name ? user.name.split(' ')[0] : 'Student';

  return (
    <UserLayout
      role="STUDENT"
      pageTitle="Student Dashboard"
      activePath="/student-dashboard"
    >
      <div className="space-y-6 sm:space-y-8">
        {/* =========================================================
            WELCOME HERO BANNER
        ========================================================== */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white p-6 sm:p-8 shadow-sm">
          {/* Subtle decorative circles */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 right-1/3 h-56 w-56 rounded-full bg-violet-400/20 blur-2xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-indigo-100 mb-3">
                <Calendar className="h-3.5 w-3.5" />
                <span>{today}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                Welcome back, {userName} 👋
              </h1>

              <p className="mt-2.5 text-sm sm:text-base text-indigo-100/90 leading-relaxed max-w-xl">
                Track your academic progress, classes, and upcoming deadlines. You have{' '}
                <span className="font-bold text-white underline decoration-white/40 underline-offset-2">
                  2 assignments due
                </span>{' '}
                this week.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/student-profile"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 text-xs sm:text-sm font-semibold hover:bg-indigo-50 active:scale-[0.99] transition shadow-xs"
                >
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>

                <div className="inline-flex items-center gap-2 text-xs text-indigo-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Academic term active
                </div>
              </div>
            </div>

            {/* Semester progress highlight card */}
            <div className="hidden lg:block shrink-0">
              <div className="w-56 rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/15">
                <div className="flex items-center justify-between text-xs font-medium text-indigo-200 mb-2">
                  <span>Semester Progress</span>
                  <TrendingUp className="h-4 w-4 text-emerald-300" />
                </div>
                <div className="text-2xl font-black text-white">78%</div>
                <div className="mt-2.5 h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '78%' }} />
                </div>
                <p className="mt-2 text-[11px] text-indigo-200">9 weeks remaining</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            KEY STAT CARDS
        ========================================================== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                subtext={stat.sub}
                icon={<Icon className="h-5 w-5" />}
                iconBg={stat.iconBg}
                iconColor={stat.iconColor}
              />
            );
          })}
        </section>

        {/* =========================================================
            MAIN DASHBOARD CONTENT
        ========================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Subject Performance Table */}
          <Card className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <CardHeader>
                <div>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>
                    Current semester grades and academic progress milestones
                  </CardDescription>
                </div>
                <Badge variant="success" dot>
                  <Award className="h-3.5 w-3.5 mr-1" />
                  Honor Roll
                </Badge>
              </CardHeader>

              {/* Course rows */}
              <div className="p-4 sm:p-6 space-y-3">
                {subjects.map((subject) => (
                  <div
                    key={subject.name}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition duration-150"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 truncate">
                            {subject.name}
                          </span>
                          {subject.score >= 90 && (
                            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                              Top Grade
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{subject.teacher}</p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        {getGradeBadge(subject.grade)}
                        <div className="flex items-center gap-1 text-sm font-bold text-emerald-600">
                          <ArrowUpRight className="h-4 w-4" />
                          <span>{subject.score}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
                        <span>Course Completion</span>
                        <span>{subject.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-200/80 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                          style={{ width: `${subject.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <CardFooter>
              <span className="text-slate-500">Updated today</span>
              <span className="font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">
                View Academic Transcript →
              </span>
            </CardFooter>
          </Card>

          {/* Right Column: Deadlines & Announcements */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                  <CardDescription>Assignments & scheduled quizzes</CardDescription>
                </div>
                <Badge variant="warning" dot>
                  3 Active
                </Badge>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                {upcoming.map((task) => (
                  <div
                    key={task.title}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <FileText className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{task.due}</p>
                    </div>

                    <Badge variant={task.badgeVariant}>{task.type}</Badge>
                  </div>
                ))}

                <button
                  type="button"
                  className="w-full mt-2 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  View All Assignments
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </CardContent>
            </Card>

            {/* Campus Announcement Card */}
            <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-100">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider mb-2">
                <Bell className="h-4 w-4 text-indigo-600" />
                <span>Campus Announcement</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Mid-Term Examinations Schedule
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                Examinations are scheduled for October 15–20. Please verify that all coursework
                submissions are finalized before the testing window begins.
              </p>
              <div className="mt-3.5 pt-3 border-t border-indigo-100/80 flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Exam Office Updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default StudentDashboard;