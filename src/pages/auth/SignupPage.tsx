import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, UserPlus, GraduationCap, School, Building2 } from 'lucide-react';
import type { UserRole } from '../../types/role';
import { signUp } from '../../apis/auth/auth.service';

const SESSION_KEY = 'sms_signup_draft';

const SignupPage: React.FC = () => {
  const getDraft = () => { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}'); } catch { return {}; } };
  const [fullName, setFullName] = useState(() => getDraft().fullName || '');
  const [email, setEmail] = useState(() => getDraft().email || '');
  const [password, setPassword] = useState(() => getDraft().password || '');
  const [confirmPassword, setConfirmPassword] = useState(() => getDraft().confirmPassword || '');
  const [selectedRole, setSelectedRole] = useState<UserRole>(() => getDraft().selectedRole || 'STUDENT');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedSchool: any = (() => {
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
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ fullName, email, password, confirmPassword, selectedRole }));
  }, [fullName, email, password, confirmPassword, selectedRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await signUp({ fullName, email, password, role: selectedRole, schoolId: selectedSchool?.id || selectedSchool?._id });
      localStorage.setItem('isVerified', String(res.user.isVerified));
      navigate('/verify-email', { state: { email: res.user.email } });
    } catch (err: any) {
      console.log(err);
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
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
        className="w-full max-w-md sm:max-w-xl lg:max-w-2xl bg-slate-900/90 backdrop-blur-2xl border border-indigo-500/20 rounded-3xl shadow-2xl shadow-slate-950 flex flex-col gap-6 z-20 my-auto"
        style={{ padding: '2.25rem 2rem' }}
      >
        {/* Card Header & Icon */}
        <div className="text-center flex flex-col items-center">
          {selectedSchool ? (
            <div
              className="inline-flex items-center gap-2 rounded-full bg-slate-950/80 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm mb-3.5 shadow-md"
              style={{ padding: '0.6rem 1.25rem' }}
            >
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold truncate max-w-[220px]">
                {selectedSchool.schoolName || selectedSchool.name || selectedSchool.username || selectedSchool.email}
              </span>
              <button
                type="button"
                onClick={() => navigate('/select-school', { state: { from: 'signup' } })}
                className="text-[11px] sm:text-xs text-slate-400 hover:text-white underline ml-1 font-medium bg-transparent border-0 cursor-pointer p-0"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-3 shadow-inner p-3">
              <UserPlus className="w-6 h-6 text-indigo-400" />
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Create Portal Account</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Register your portal account as a student or teacher.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <button
            type="button"
            onClick={() => setSelectedRole('STUDENT')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition cursor-pointer ${selectedRole === 'STUDENT'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
          >
            <GraduationCap className="w-3.5 h-3.5" /> Student
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('TEACHER')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition cursor-pointer ${selectedRole === 'TEACHER'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
          >
            <School className="w-3.5 h-3.5" /> Teacher
          </button>
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

          {/* Full Name & Email Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                FULL NAME
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 sm:w-5 sm:h-5 absolute left-4 text-slate-400 pointer-events-none z-10" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  style={{ paddingLeft: '3rem', paddingRight: '1rem', paddingTop: '0.85rem', paddingBottom: '0.85rem' }}
                  className="w-full bg-slate-950/90 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

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
                  placeholder={`${selectedRole}@school.edu`}
                  required
                  style={{ paddingLeft: '3rem', paddingRight: '1rem', paddingTop: '0.85rem', paddingBottom: '0.85rem' }}
                  className="w-full bg-slate-950/90 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

          </div>

          {/* Passwords Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

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
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                CONFIRM PASSWORD
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 absolute left-4 text-slate-400 pointer-events-none z-10" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ paddingLeft: '3rem', paddingRight: '1rem', paddingTop: '0.85rem', paddingBottom: '0.85rem' }}
                  className="w-full bg-slate-950/90 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-2.5 pt-1 text-xs text-slate-400">
            <input
              type="checkbox"
              required
              className="mt-0.5 w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0 cursor-pointer flex-shrink-0"
            />
            <span className="leading-relaxed">
              I agree to the <a href="#terms" onClick={e => e.preventDefault()} className="text-indigo-400 hover:underline">Terms of Service</a> and <a href="#privacy" onClick={e => e.preventDefault()} className="text-indigo-400 hover:underline">Privacy Policy</a>.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem' }}
            className={`w-full active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1 ${selectedRole === 'TEACHER'
              ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 shadow-emerald-600/25'
              : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 shadow-indigo-600/25'
              }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Register as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Login Redirect Link */}
        <p className="text-center text-xs sm:text-sm text-slate-400 pt-2 border-t border-slate-800/60">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition">
            Sign In to Portal
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
