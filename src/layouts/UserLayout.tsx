import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  Bell,
  LayoutDashboard,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Users,
  User,
  ShieldCheck,
} from 'lucide-react';
import type { UserRole } from '../types/role';
import { logout } from '../apis/auth/auth.service';
import { useNavigate, Link } from 'react-router-dom';

// ─── Role nav configs ────────────────────────────────────────────

const studentNav = [
  {
    title: 'Navigation',
    items: [
      {
        icon: <LayoutDashboard size={18} />,
        label: 'Dashboard',
        href: '/student-dashboard',
      },
      {
        icon: <User size={18} />,
        label: 'Profile',
        href: '/student-profile',
      },
    ],
  },
];

const teacherNav = [
  {
    title: 'Navigation',
    items: [
      {
        icon: <LayoutDashboard size={18} />,
        label: 'Dashboard',
        href: '/teacher-dashboard',
      },
      {
        icon: <User size={18} />,
        label: 'Profile',
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
    theme: string;
    label: string;
    icon: React.ReactNode;
    color: string;
  }
> = {
  STUDENT: {
    theme: 'theme-student',
    label: 'Student',
    icon: <GraduationCap size={20} />,
    color: '#818cf8',
  },
  TEACHER: {
    theme: 'theme-teacher',
    label: 'Teacher',
    icon: <Users size={20} />,
    color: '#34d399',
  },
};

// ─── Layout Component ────────────────────────────────────────────

interface UserLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  pageTitle?: string;
  activePath?: string;
}

const UserLayout: React.FC<UserLayoutProps> = ({
  children,
  role,
  pageTitle = 'Dashboard',
  activePath = '/student-dashboard',
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const nav = roleNavMap[role];
  const meta = roleMeta[role];

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

  const handleLogout = async () => {
    try {
      await logout(user.email, user.schoolId);
    } catch {
      // ignore API errors — we still clear local state
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100 ${meta.theme}`}
    >
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full blur-3xl opacity-[0.08]"
          style={{ background: meta.color }}
        />

        <div
          className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-[0.06]"
          style={{ background: meta.color }}
        />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />
      </div>

      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        aria-label={`${meta.label} navigation`}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div
            className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${meta.color}, ${meta.color}99)`,
              boxShadow: `0 8px 24px ${meta.color}22`,
            }}
          >
            <div className="absolute inset-0 bg-white/10" />
            <span className="relative text-white">{meta.icon}</span>
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight text-white">
              SMS Portal
            </p>

            <p
              className="truncate text-[11px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: meta.color }}
            >
              {meta.label} Access
            </p>
          </div>

          <button
            type="button"
            className="ml-auto rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        {/* Role Badge */}
        <div className="px-4 py-4">
          <div
            className="flex items-center justify-between rounded-xl border px-3 py-2.5"
            style={{
              background: `${meta.color}08`,
              borderColor: `${meta.color}18`,
            }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{
                  background: `${meta.color}15`,
                  color: meta.color,
                }}
              >
                {React.cloneElement(
                  meta.icon as React.ReactElement<{ size?: number }>,
                  { size: 14 }
                )}
              </span>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Current role
                </p>

                <p className="text-xs font-semibold text-slate-200">
                  {meta.label}
                </p>
              </div>
            </div>

            <ShieldCheck
              size={15}
              style={{ color: meta.color }}
              className="opacity-70"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav flex-1">
          {nav.map((section) => (
            <div key={section.title} className="mb-5">
              <p className="nav-section-title mb-2 px-3">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = activePath === item.href;

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`nav-item group relative ${
                        isActive ? 'active' : ''
                      }`}
                    >
                      {isActive && (
                        <span
                          className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full"
                          style={{ background: meta.color }}
                        />
                      )}

                      <span
                        className="nav-icon transition-transform duration-200 group-hover:scale-105"
                        style={isActive ? { color: meta.color } : undefined}
                      >
                        {item.icon}
                      </span>

                      <span className="font-medium">{item.label}</span>

                      {isActive && (
                        <span
                          className="ml-auto h-1.5 w-1.5 rounded-full"
                          style={{ background: meta.color }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div
          className="border-t p-3.5"
          style={{ borderColor: 'var(--role-border)' }}
        >
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-white/5"
            title="Click to sign out"
          >
            <div className="avatar shrink-0">
              {user.initials || user.name?.charAt(0) || 'U'}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {user.name || 'Account'}
              </p>

              <p className="truncate text-xs text-slate-500">
                {user.email || ''}
              </p>
            </div>

            <LogOut
              size={16}
              className="shrink-0 text-slate-600 transition group-hover:text-red-400"
            />
          </button>
        </div>
      </aside>

      {/* ── Header ── */}
      <header className="main-header">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          {/* Mobile Menu */}
          <button
            type="button"
            className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-2 text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          {/* Page Heading */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base font-bold tracking-tight text-white sm:text-lg">
                {pageTitle}
              </h1>

              <span
                className="hidden h-1.5 w-1.5 rounded-full sm:block"
                style={{ background: meta.color }}
              />
            </div>

            <p className="hidden truncate text-xs text-slate-500 sm:block">
              {user.name
                ? `${user.name} • ${meta.label}`
                : `${meta.label} Portal`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 transition focus-within:border-slate-700 lg:flex">
            <Search size={15} className="text-slate-500" />

            <input
              type="text"
              placeholder="Search..."
              className="w-36 bg-transparent text-xs text-slate-300 outline-none placeholder:text-slate-600 lg:w-44"
            />
          </div>

          {/* Notifications */}
          <button
            type="button"
            className="relative rounded-xl border border-slate-800 bg-slate-900/70 p-2.5 text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
            aria-label="Notifications"
          >
            <Bell size={18} />

            <span
              className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full ring-2 ring-slate-900"
              style={{ background: meta.color }}
            />
          </button>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-1.5 pr-2 transition hover:border-slate-700 hover:bg-slate-800 sm:gap-2.5 sm:pl-2"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="User menu"
              aria-expanded={profileOpen}
            >
              <div className="avatar shrink-0">
                {user.initials || user.name?.charAt(0) || 'U'}
              </div>

              <span className="hidden max-w-[120px] truncate text-xs font-medium text-slate-200 md:inline-block">
                {user.name || 'My Profile'}
              </span>

              <ChevronDown
                size={14}
                className={`hidden text-slate-500 transition-transform duration-200 sm:block ${
                  profileOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-[calc(100vw-2rem)] max-w-64 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 shadow-2xl shadow-black/30 backdrop-blur-xl sm:w-60">
                {/* User Info */}
                <div className="border-b border-slate-800/80 bg-slate-950/50 p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${meta.color}, ${meta.color}88)`,
                      }}
                    >
                      {user.initials || user.name?.charAt(0) || 'U'}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {user.name || 'User'}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {user.email || ''}
                      </p>
                    </div>
                  </div>

                  <span className="role-badge mt-3">
                    <span style={{ color: meta.color }}>
                      {React.cloneElement(
                        meta.icon as React.ReactElement<{ size?: number }>,
                        { size: 12 }
                      )}
                    </span>
                    {meta.label}
                  </span>
                </div>

                {/* Links */}
                <div className="p-1.5">
                  <Link
                    to={
                      role === 'TEACHER'
                        ? '/teacher-profile'
                        : '/student-profile'
                    }
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <User size={15} />
                    My Profile
                  </Link>

                  <Link
                    to={
                      role === 'TEACHER'
                        ? '/teacher-dashboard'
                        : '/student-dashboard'
                    }
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <LayoutDashboard size={15} />
                    Dashboard
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-slate-800/80 p-1.5">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="main-content fade-in mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
};

export default UserLayout;
