import React from "react";
import UserLayout from "../../layouts/UserLayout";
import { Users, Star, CheckSquare, BookOpen, Calendar } from "lucide-react";
import { StatCard } from "../../components/ui/StatCard";

const stats = [
  {
    label: "Enrolled Students",
    value: "142",
    sub: "Across 4 active sections",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    icon: Users,
  },
  {
    label: "Class Average",
    value: "78.4%",
    sub: "+3.2% vs previous term",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    icon: Star,
  },
  {
    label: "Weekly Attendance",
    value: "91.8%",
    sub: "Consistent across classes",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    icon: CheckSquare,
  },
  {
    label: "Assigned Courses",
    value: "5",
    sub: "Mathematics & Sciences",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    icon: BookOpen,
  },
];

export const TeacherDashboard: React.FC = () => {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const firstName = user?.name ? user.name.split(" ")[0] : "Teacher";

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
      </div>
    </UserLayout>
  );
};

export default TeacherDashboard;
