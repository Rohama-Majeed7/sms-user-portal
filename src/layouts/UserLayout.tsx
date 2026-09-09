import React, { useState } from 'react';
import {
  GraduationCap, Bell, LayoutDashboard,
  Search, Menu, X, ChevronDown, LogOut,
  Users, User
} from 'lucide-react';
import type { UserRole } from '../types/role';
import { logout } from '../apis/auth/auth.service';
import { useNavigate } from 'react-router-dom';

// ─── Role nav configs ───────────────────────────────────────────
const studentNav = [
  {
    title: 'Menu',
    items: [
      { icon: <LayoutDashboard size={18} />, label: 'Dashboard', href: '/student-dashboard' },
      { icon: <User size={18} />, label: 'Profile', href: '/student-profile' },
    ],
  },
];

const teacherNav = [
  {
    title: 'Menu',
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
  activePath = '/dashboard',
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const nav = roleNavMap[role];
  const meta = roleMeta[role];

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
  }

  return (
    <div className={`relative ${meta.theme}`}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
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
            <p className="text-white font-bold text-sm leading-tight">SMS Portal</p>
            <p className="text-xs" style={{ color: meta.color }}>{meta.label} Access</p>
          </div>
          <button
            className="ml-auto text-slate-400 hover:text-white md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Role Badge inside sidebar */}
        <div className="px-4 py-2.5">
          <span className="role-badge">
            <span style={{ color: meta.color }}>{meta.icon && React.cloneElement(meta.icon as React.ReactElement<{ size?: number }>, { size: 12 })}</span>
            {meta.label}
          </span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {nav.map((section) => (
            <div key={section.title}>
              <p className="nav-section-title">{section.title}</p>
              {section.items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${activePath === item.href ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-3 border-t" style={{ borderColor: 'var(--role-border)' }}>
          <div onClick={handleLogout} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition">
            <div className="avatar">{user.initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
            <LogOut size={16} className="text-slate-500 hover:text-red-400 transition flex-shrink-0" />
          </div>
        </div>
      </aside>

      {/* ── Header ── */}
      <header className="main-header">
        <div className="flex items-center gap-4">
          <button
            className="text-slate-400 hover:text-white transition md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">{pageTitle}</h1>
            <p className="text-slate-500 text-xs">{user.name} &mdash; {meta.label}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-36"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white transition">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--role-primary)' }}></span>
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-opacity-50 transition"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="avatar">{user.initials}</div>
              <ChevronDown size={14} className="text-slate-400 hidden md:block" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-3 border-b border-slate-700">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                  <span className="role-badge mt-1.5">{meta.label}</span>
                </div>

                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-slate-800 transition">
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="main-content fade-in max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default UserLayout;
