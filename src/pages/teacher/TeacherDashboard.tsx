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
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';

const stats = [
  {
    label: 'Enrolled Students',
    value: '142',
    sub: 'Across 4 active sections',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    icon: Users,
  },
  {
    label: 'Class Average',
    value: '78.4%',
    sub: '+3.2% vs previous term',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
    icon: Star,
  },
  {
    label: 'Weekly Attendance',
    value: '91.8%',
    sub: 'Consistent across classes',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    icon: CheckSquare,
  },
  {
    label: 'Assigned Courses',
    value: '5',
    sub: 'Mathematics & Sciences',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
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
    badgeVariant: 'danger' as const,
  },
  {
    task: 'Submit Attendance – Form 3B',
    due: 'Today before 3:00 PM',
    priority: 'High',
    badgeVariant: 'danger' as const,
  },
  {
    task: 'Prepare Form 2C Weekly Quiz',
    due: 'Friday, 10:00 AM',
    priority: 'Medium',
    badgeVariant: 'warning' as const,
  },
  {
    task: 'Departmental Faculty Meeting',
    due: 'Next Monday, 9:00 AM',
    priority: 'Normal',
    badgeVariant: 'info' as const,
  },
];

export const TeacherDashboard: React.FC = () => {
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

  const firstName = user?.name ? user.name.split(' ')[0] : 'Teacher';

  return (
    <UserLayout
      role="TEACHER"
      pageTitle="Faculty Dashboard"
      activePath="/teacher-dashboard"
    >
      <div className="space-y-6 sm:space-y-8">
        {/* =========================================================
            FACULTY HERO BANNER
        ========================================================== */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 shadow-sm">
          {/* Ambient lighting */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 right-1/3 h-56 w-56 rounded-full bg-teal-400/20 blur-2xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-emerald-100 mb-3">
                <Calendar className="h-3.5 w-3.5" />
                <span>{today}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                Good day, {firstName} 🌿
              </h1>

              <p className="mt-2.5 text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xl">
                Stay on top of your classroom sections, grading duties, and faculty commitments. You have{' '}
                <span className="font-bold text-white underline decoration-white/40 underline-offset-2">
                  2 high-priority tasks
                </span>{' '}
                due today.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/teacher-profile"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-800 text-xs sm:text-sm font-semibold hover:bg-emerald-50 active:scale-[0.99] transition shadow-xs"
                >
                  <User className="h-4 w-4" />
                  <span>Faculty Profile</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>

                <div className="inline-flex items-center gap-2 text-xs text-emerald-200">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  All 4 sections in session
                </div>
              </div>
            </div>

            {/* Quick summary metric pill */}
            <div className="hidden lg:grid grid-cols-2 gap-3 w-72 shrink-0">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="flex items-center justify-between text-xs text-emerald-100 mb-2">
                  <span>Sections</span>
                  <GraduationCap className="h-4 w-4 text-emerald-300" />
                </div>
                <div className="text-2xl font-black text-white">4</div>
                <p className="text-[11px] text-emerald-200 mt-1">Active sections</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="flex items-center justify-between text-xs text-emerald-100 mb-2">
                  <span>Avg. Grade</span>
                  <TrendingUp className="h-4 w-4 text-emerald-300" />
                </div>
                <div className="text-2xl font-black text-white">78.4%</div>
                <p className="text-[11px] text-emerald-200 mt-1">+3.2% vs term</p>
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
            MAIN TEACHER DASHBOARD CONTENT
        ========================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Classroom Sections Table */}
          <Card className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <CardHeader>
                <div>
                  <CardTitle>Active Classroom Sections</CardTitle>
                  <CardDescription>
                    Current courses, room allocations, and section performance
                  </CardDescription>
                </div>
                <Badge variant="teacher" dot>
                  4 Sections Active
                </Badge>
              </CardHeader>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      <th className="px-6 py-3.5">Course / Section</th>
                      <th className="px-4 py-3.5">Room</th>
                      <th className="px-4 py-3.5">Students</th>
                      <th className="px-4 py-3.5">Avg. Score</th>
                      <th className="px-6 py-3.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {classes.map((item) => (
                      <tr key={item.name} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                              <BookOpen className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                              <p className="text-xs text-slate-500">Sciences &amp; Math</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span>{item.room}</span>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                            <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span>{item.students} students</span>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3 min-w-[140px]">
                            <span className="text-xs font-bold text-slate-900 w-9">
                              {item.avgScore}%
                            </span>
                            <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${item.avgScore}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <Badge variant="success" dot>
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile stacked cards */}
              <div className="p-4 space-y-3 md:hidden">
                {classes.map((item) => (
                  <div
                    key={item.name}
                    className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {item.room}
                        </p>
                      </div>
                      <Badge variant="success" dot>
                        {item.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Enrolled</p>
                        <p className="text-xs font-bold text-slate-800 mt-0.5">{item.students} students</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Average</p>
                        <p className="text-xs font-bold text-emerald-600 mt-0.5">{item.avgScore}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <CardFooter>
              <span>Synchronized with central gradebook</span>
              <button
                type="button"
                className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
              >
                Export Attendance Sheet
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </CardFooter>
          </Card>

          {/* Right Column: Faculty Tasks & Department Notice */}
          <div className="space-y-6">
            {/* Faculty Task List */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Faculty Task List</CardTitle>
                  <CardDescription>Action items requiring grading or attendance</CardDescription>
                </div>
                <Badge variant="danger" dot>
                  2 Urgent
                </Badge>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                {pendingTasks.map((task) => (
                  <div
                    key={task.task}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <ClipboardList className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 leading-snug">
                        {task.task}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                        <Clock3 className="h-3 w-3" />
                        <span>{task.due}</span>
                      </div>
                    </div>

                    <Badge variant={task.badgeVariant}>{task.priority}</Badge>
                  </div>
                ))}

                <button
                  type="button"
                  className="w-full mt-2 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  View All Faculty Tasks
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </CardContent>
            </Card>

            {/* Faculty Notice */}
            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider mb-2">
                <Bell className="h-4 w-4 text-emerald-600" />
                <span>Department Reminder</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Faculty Council Meeting Tomorrow
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                All department staff are requested at 8:00 AM in Conference Room 12. Please
                verify that section attendance registers are updated in the portal prior to the
                session.
              </p>
              <div className="mt-3.5 pt-3 border-t border-emerald-100/80 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <Clock3 className="h-3.5 w-3.5" />
                <span>Tomorrow • 8:00 AM – 9:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default TeacherDashboard;