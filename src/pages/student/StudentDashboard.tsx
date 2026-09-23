import React from 'react';
import UserLayout from '../../layouts/UserLayout';
import {
  Star,
  CheckSquare,
  BookOpen,
  Clock,
  Calendar,
  
} from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';

type Stat = {
  label: string;
  value: string;
  sub: string;
  iconBg: string;
  iconColor: string;
  icon: React.ElementType;
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

              {/* <p className="mt-2.5 text-sm sm:text-base text-indigo-100/90 leading-relaxed max-w-xl">
                Track your academic progress, classes, and upcoming deadlines. You have{' '}
                <span className="font-bold text-white underline decoration-white/40 underline-offset-2">
                  2 assignments due
                </span>{' '}
                this week.
              </p> */}

              {/* <div className="mt-6 flex flex-wrap items-center gap-3">
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
              </div> */}
            </div>

            {/* Semester progress highlight card */}
            
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
        
      </div>
    </UserLayout>
  );
};

export default StudentDashboard;