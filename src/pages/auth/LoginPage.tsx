import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, UserCheck, Building2 } from 'lucide-react';
import type { School } from '../../types/school';
import { login } from '../../apis/auth/auth.service';

const SESSION_KEY = 'sms_login_draft';
const REMEMBER_KEY = 'sms_remember_email';

const LoginPage: React.FC = () => {
  const [rememberMe, setRememberMe] = useState<boolean>(() => !!localStorage.getItem(REMEMBER_KEY));
  const [email, setEmail] = useState(() => {
    // Priority: remembered email (localStorage) > session draft
    const remembered = localStorage.getItem(REMEMBER_KEY);
    if (remembered) return remembered;
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}').email || ''; } catch { return ''; }
  });
  const [password, setPassword] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}').password || ''; } catch { return ''; }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isVerified = JSON.parse(localStorage.getItem('isVerified') || 'null');

  const selectedSchool: School | null = (() => {
    try {
      const saved = localStorage.getItem('sms_selected_school');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const navigate = useNavigate();

  // Persist draft to sessionStorage whenever fields change
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email, password }));
  }, [email, password]);

  // Remember Me: persist / clear email in localStorage
  useEffect(() => {
    if (rememberMe && email) {
      localStorage.setItem(REMEMBER_KEY, email);
    } else if (!rememberMe) {
      localStorage.removeItem(REMEMBER_KEY);
    }
  }, [rememberMe, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (isVerified !== null && !isVerified) {
      setError('Please verify your email.');
      setTimeout(() => {
        navigate('/verify-email', { state: { email } });
      }, 2000);
      return;
    }

    try {
      setLoading(true);
      // Default to student role or user email domain detection if needed
      const res = await login({
        email,
        password,
        schoolId: selectedSchool?.id
      });
      console.log("login res", res)
      localStorage.setItem('accessToken', res.accessToken)
      localStorage.setItem('user', JSON.stringify(res.user))
      if (res.user.role === "STUDENT") {
        navigate('/student-dashboard');
      } else if (res.user.role === "TEACHER") {
        navigate('/teacher-dashboard');
      } else if (res.user.role === "PARENT") {
        navigate('/parent-dashboard');
      }
    } catch (err: any) {
      const message: string = err?.response?.data?.message || '';
      // Backend throws an error when the email is not verified — detect and redirect
      if (
        message.toLowerCase().includes('not verified') ||
        message.toLowerCase().includes('verify your email') ||
        message.toLowerCase().includes('email verification')
      ) {
        localStorage.setItem('isVerified', 'false');
        setTimeout(() => {
          navigate('/verify-email', { state: { email } });
        }, 2000);
        return;
      }
      setError(message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.22) 0%, rgba(15,23,42,0.98) 65%, #020617 100%)',
        padding: '1.25rem'
      }}
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-[-10%] left-[25%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[25%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Auth Card Container */}
      <div
        className="w-full max-w-md sm:max-w-lg bg-slate-900/90 backdrop-blur-2xl border border-indigo-500/20 rounded-3xl shadow-2xl shadow-slate-950 flex flex-col gap-6 z-20 my-auto"
        style={{ padding: '2.25rem 2rem' }}
      >
        {/* Card Header & Icon */}
        <div className="text-center flex flex-col items-center">
          {selectedSchool ? (
            <div
              className="inline-flex items-center gap-2 rounded-full bg-slate-950/80 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm mb-3 shadow-md"
              style={{ padding: '0.6rem 1.25rem' }}
            >
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold truncate max-w-[220px]">
                {selectedSchool?.schoolName}
              </span>
              <button
                type="button"
                onClick={() => navigate('/select-school', { state: { from: 'login' } })}
                className="text-[11px] sm:text-xs text-slate-400 hover:text-white underline ml-1 font-medium bg-transparent border-0 cursor-pointer p-0"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-3 shadow-inner p-3">
              <UserCheck className="w-6 h-6 text-indigo-400" />
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Portal Sign In</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Sign in to access your portal dashboard and account settings.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 animate-pulse" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              EMAIL ADDRESS
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 absolute left-4 text-slate-400 pointer-events-none z-10" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@school.edu"
                required
                style={{ paddingLeft: '3rem', paddingRight: '1rem', paddingTop: '0.85rem', paddingBottom: '0.85rem' }}
                className="w-full bg-slate-950/90 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              PASSWORD
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 absolute left-4 text-slate-400 pointer-events-none z-10" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ paddingLeft: '3rem', paddingRight: '3rem', paddingTop: '0.85rem', paddingBottom: '0.85rem' }}
                className="w-full bg-slate-950/90 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-200 transition p-1.5 rounded-lg hover:bg-slate-800/60 z-10 cursor-pointer"
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Remember Me Checkbox (Left) & Forgot Password Link (Right) */}
            <div className="flex items-center justify-between pt-1.5">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-400 hover:text-slate-300 transition">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem' }}
            className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In to Portal <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Signup Redirect Link */}
        <p className="text-center text-xs sm:text-sm text-slate-400 pt-2 border-t border-slate-800/60">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-400 font-semibold hover:text-indigo-300 transition">
            Create Portal Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
