import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap, Bell, LayoutDashboard,
  Search, Menu, X, ChevronDown, LogOut,
  Users, User
} from 'lucide-react';
import type { UserRole } from '../types/role';
import { logout } from '../apis/auth/auth.service';
import { useNavigate, Link } from 'react-router-dom';

// ─── Role nav configs ───────────────────────────────────────────
const studentNav = [
  {
    title: 'Navigation',
    items: [
      { icon: <LayoutDashboard size={18} />, label: 'Dashboard', href: '/student-dashboard' },
      { icon: <User size={18} />, label: 'Profile', href: '/student-profile' },
    ],
  },
];

const teacherNav = [
  {
    title: 'Navigation',
    items: [
      { icon: <LayoutDashboard size={18} />, label: 'Dashboard', href: '/teacher-dashboard' },
      { icon: <User size={18} />, label: 'Profile', href: '/teacher-profile' },
    ],
  },
];

const roleNavMap: Record<UserRole, typeof studentNav> = {
  STUDENT: studentNav,
  TEACHER: teacherNav,
};

const roleMeta: Record<UserRole, { theme: string; label: string; icon: React.ReactNode; color: string }> = {
  STUDENT: { theme: 'theme-student', label: 'Student', icon: <GraduationCap size={20} />, color: '#818cf8' },
  TEACHER: { theme: 'theme-teacher', label: 'Teacher', icon: <Users size={20} />, color: '#34d399' },
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    <div className={`relative min-h-screen bg-slate-950 text-slate-100 ${meta.theme}`}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <span className="text-white">{meta.icon}</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-tight leading-tight">SMS Portal</p>
            <p className="text-xs font-medium" style={{ color: meta.color }}>{meta.label} Access</p>
          </div>
          <button
            type="button"
            className="ml-auto p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Role Badge inside sidebar */}
        <div className="px-4 py-3">
          <span className="role-badge">
            <span style={{ color: meta.color }}>{meta.icon && React.cloneElement(meta.icon as React.ReactElement<{ size?: number }>, { size: 12 })}</span>
            {meta.label}
          </span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {nav.map((section) => (
            <div key={section.title} className="mb-4">
              <p className="nav-section-title">{section.title}</p>
              {section.items.map((item) => {
                const isActive = activePath === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-3.5 border-t" style={{ borderColor: 'var(--role-border)' }}>
          <div
            onClick={handleLogout}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition group"
            title="Click to sign out"
          >
            <div className="avatar flex-shrink-0">{user.initials || user.name?.charAt(0) || 'U'}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name || 'Account'}</p>
              <p className="text-xs text-slate-400 truncate">{user.email || ''}</p>
            </div>
            <LogOut size={16} className="text-slate-500 group-hover:text-red-400 transition flex-shrink-0" />
          </div>
        </div>
      </aside>

      {/* ── Header ── */}
      <header className="main-header">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            type="button"
            className="p-2 -ml-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>
          <div className="min-w-0">
            <h1 className="text-white font-bold text-base sm:text-lg tracking-tight truncate leading-tight">{pageTitle}</h1>
            <p className="text-slate-500 text-xs truncate hidden sm:block">
              {user.name ? `${user.name} • ${meta.label}` : `${meta.label} Portal`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5 focus-within:border-indigo-500 transition">
            <Search size={15} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-xs sm:text-sm text-slate-300 placeholder-slate-500 outline-none w-36 lg:w-44"
            />
          </div>

          {/* Notifications */}
          <button
            type="button"
            className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--role-primary)' }} />
          </button>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="flex items-center gap-2 p-1 rounded-full sm:rounded-xl bg-slate-900/80 border border-slate-800 sm:px-2 sm:py-1.5 hover:border-slate-700 transition cursor-pointer"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="User menu"
            >
              <div className="avatar flex-shrink-0">{user.initials || user.name?.charAt(0) || 'U'}</div>
              <span className="text-xs font-medium text-slate-200 hidden md:inline-block max-w-[120px] truncate">
                {user.name || 'My Profile'}
              </span>
              <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3.5 border-b border-slate-800/80 bg-slate-950/40">
                  <p className="text-sm font-semibold text-white truncate">{user.name || 'User'}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email || ''}</p>
                  <span className="role-badge mt-2">{meta.label}</span>
                </div>

                <div className="p-1.5">
                  <Link
                    to={role === 'TEACHER' ? '/teacher-profile' : '/student-profile'}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm text-slate-300 hover:text-white hover:bg-white/5 transition"
                  >
                    <User size={15} /> My Profile
                  </Link>
                  <Link
                    to={role === 'TEACHER' ? '/teacher-dashboard' : '/student-dashboard'}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm text-slate-300 hover:text-white hover:bg-white/5 transition"
                  >
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                </div>

                <div className="p-1.5 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="main-content fade-in max-w-7xl w-full mx-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
};

export default UserLayout;
