import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Users,
  User,
  ShieldCheck,
  Building2,
  BookOpen,
} from 'lucide-react';
import type { UserRole } from '../types/role';
import { logout } from '../apis/auth/auth.service';
import { useNavigate, Link, useLocation } from 'react-router-dom';

// ─── Role nav configs ────────────────────────────────────────────

const studentNav = [
  {
    title: 'Academics',
    items: [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        href: '/student-dashboard',
      },
      {
        icon: User,
        label: 'My Profile',
        href: '/student-profile',
      },
    ],
  },
];

const teacherNav = [
  {
    title: 'Faculty Portal',
    items: [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        href: '/teacher-dashboard',
      },
      {
        icon: User,
        label: 'Faculty Profile',
        href: '/teacher-profile',
      },
    ],
  },
];

const roleNavMap: Record<UserRole, typeof studentNav> = {
  STUDENT: studentNav,
  TEACHER: teacherNav,
};

const roleMeta: Record<
  UserRole,
  {
    label: string;
    icon: React.ElementType;
    badgeBg: string;
    badgeText: string;
    activeBg: string;
    activeText: string;
    accentColor: string;
  }
> = {
  STUDENT: {
    label: 'Student',
    icon: GraduationCap,
    badgeBg: 'bg-indigo-50 border-indigo-200/80',
    badgeText: 'text-indigo-700',
    activeBg: 'bg-indigo-50 text-indigo-700',
    activeText: 'text-indigo-700',
    accentColor: '#4f46e5',
  },
  TEACHER: {
    label: ' Faculty',
    icon: Users,
    badgeBg: 'bg-emerald-50 border-emerald-200/80',
    badgeText: 'text-emerald-700',
    activeBg: 'bg-emerald-50 text-emerald-700',
    activeText: 'text-emerald-700',
    accentColor: '#059669',
  },
};

interface UserLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  pageTitle?: string;
  activePath?: string;
}

export const UserLayout: React.FC<UserLayoutProps> = ({
  children,
  role,
  pageTitle = 'Dashboard',
  activePath,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = activePath || location.pathname;

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const school = JSON.parse(localStorage.getItem('sms_selected_school') || 'null');
  const schoolName = school?.name || school?.schoolName || school?.username || school?.email || '';

  const nav = roleNavMap[role];
  const meta = roleMeta[role];
  const RoleIcon = meta.icon;

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Prevent scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    try {
      await logout(user.email, user.schoolId);
    } catch {
      // ignore API errors — we still clear local state
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('sms_selected_school');
      navigate('/login');
    }
  };

  const userInitials =
    user.initials ||
    (user.name
      ? user.name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : 'U');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
        aria-label={`${meta.label} navigation`}
      >
        {/* Sidebar Header / Logo */}
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <BookOpen className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h1 className="text-sm font-bold tracking-tight text-slate-900 truncate">
                SMS Portal
              </h1>
              <p className="text-[11px] font-medium text-slate-500 truncate">
                School Management
              </p>
            </div>
          </div>

          <button
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Role pill indicator */}
        <div className="px-4 pt-4 pb-2">
          <div className={`flex items-center justify-between px-3 py-2 rounded-xl border ${meta.badgeBg}`}>
            <div className="flex items-center gap-2 min-w-0">
              <RoleIcon className={`h-4 w-4 shrink-0 ${meta.badgeText}`} />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Active Role
                </p>
                <p className={`text-xs font-semibold truncate ${meta.badgeText}`}>
                  {meta.label}
                </p>
              </div>
            </div>
            <ShieldCheck className={`h-4 w-4 shrink-0 ${meta.badgeText} opacity-80`} />
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
          {nav.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </p>

              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => {
                  const isActive = currentPath === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-150 ${
                        isActive
                          ? `${meta.activeBg} shadow-2xs`
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? meta.activeText : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                      {isActive && (
                        <span
                          className="ml-auto h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: meta.accentColor }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer / User Account & Logout */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold">
              {userInitials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {user.name || 'User Account'}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {user.email || ''}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Page Context */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                {pageTitle}
              </h2>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                <span>SMS Portal</span>
                <span>/</span>
                <span className="font-medium text-slate-700">{meta.label}</span>
              </div>
            </div>
          </div>

          {/* Right: Search, School Switcher, Notifications & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Search */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 text-xs text-slate-400 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/15 transition">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-36 bg-transparent text-slate-800 placeholder:text-slate-400 outline-none text-xs"
              />
            </div>

            {/* Connected School Pill */}
            {schoolName && (
              <Link
                to="/select-school"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-700 hover:bg-white hover:border-slate-300 transition shadow-2xs"
                title="Connected School • Click to switch institution"
              >
                <Building2 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span className="max-w-[140px] truncate">{schoolName}</span>
              </Link>
            )}

            {/* Notifications */}
            

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 border border-slate-200/80 transition cursor-pointer"
                aria-label="User menu"
                aria-expanded={profileOpen}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold">
                  {userInitials}
                </div>

                <div className="hidden md:block text-left pr-1">
                  <p className="text-xs font-semibold text-slate-900 truncate max-w-[110px]">
                    {user.name || 'Account'}
                  </p>
                </div>

                <ChevronDown
                  className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-150 ${
                    profileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 animate-fade-in">
                  {/* Account overview */}
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {user.name || 'User Account'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {user.email || ''}
                    </p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${meta.badgeBg} ${meta.badgeText}`}>
                        <RoleIcon className="h-3 w-3" />
                        {meta.label}
                      </span>
                    </div>
                  </div>

                  {/* Navigation links */}
                  <div className="py-1 px-1.5">
                    <Link
                      to={role === 'TEACHER' ? '/teacher-profile' : '/student-profile'}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      View Profile
                    </Link>

                    <Link
                      to={role === 'TEACHER' ? '/teacher-dashboard' : '/student-dashboard'}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                    >
                      <LayoutDashboard className="h-4 w-4 text-slate-400" />
                      Dashboard
                    </Link>

                    <Link
                      to="/select-school"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                    >
                      <Building2 className="h-4 w-4 text-slate-400" />
                      Switch School
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="pt-1 px-1.5 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in-up">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
