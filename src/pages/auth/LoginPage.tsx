import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

import type { School } from '../../types/school';
import { login } from '../../apis/auth/auth.service';

const SESSION_KEY = 'sms_login_draft';
const REMEMBER_KEY = 'sms_remember_email';
const SCHOOL_KEY = 'sms_selected_school';
const VERIFIED_KEY = 'isVerified';

interface LoginDraft {
  email?: string;
}

interface LoginUser {
  role?: string;
  email?: string;
  isVerified?: boolean;
  [key: string]: unknown;
}

interface LoginResponse {
  accessToken: string;
  user: LoginUser;
}

const getSessionDraft = (): LoginDraft => {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const getSelectedSchool = (): School | null => {
  try {
    const saved = localStorage.getItem(SCHOOL_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const getStoredVerificationStatus = (): boolean | null => {
  try {
    const saved = localStorage.getItem(VERIFIED_KEY);

    if (saved === null) return null;

    return JSON.parse(saved);
  } catch {
    return null;
  }
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const sessionDraft = useMemo(() => getSessionDraft(), []);
  const rememberedEmail = localStorage.getItem(REMEMBER_KEY);

  const [email, setEmail] = useState(
    rememberedEmail || sessionDraft.email || ''
  );
  const [password, setPassword] = useState('');

  const [rememberMe, setRememberMe] = useState(Boolean(rememberedEmail));
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationNotice, setVerificationNotice] = useState(false);

  const selectedSchool = useMemo(() => getSelectedSchool(), []);

  const selectedSchoolId =
    selectedSchool?.id || (selectedSchool as any)?._id;

  const schoolName =
    (selectedSchool as any)?.schoolName ||
    (selectedSchool as any)?.name ||
    (selectedSchool as any)?.username ||
    (selectedSchool as any)?.email ||
    'Selected School';

  // const isTeacher = false;

  /**
   * Persist only non-sensitive login data.
   *
   * Passwords should not be stored in sessionStorage because
   * browser storage is accessible to JavaScript running on the page.
   */
  useEffect(() => {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        email,
      })
    );
  }, [email]);

  /**
   * Remember email preference.
   */
  useEffect(() => {
    const trimmedEmail = email.trim();

    if (rememberMe && trimmedEmail) {
      localStorage.setItem(REMEMBER_KEY, trimmedEmail);
    } else if (!rememberMe) {
      localStorage.removeItem(REMEMBER_KEY);
    }
  }, [rememberMe, email]);

  const redirectToVerification = () => {
    localStorage.setItem(VERIFIED_KEY, 'false');

    setVerificationNotice(true);

    window.setTimeout(() => {
      navigate('/verify-email', {
        state: {
          email: email.trim(),
        },
      });
    }, 1200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setError('');
    setVerificationNotice(false);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    if (!selectedSchoolId) {
      setError('Please select your school before signing in.');
      return;
    }

    const storedVerificationStatus = getStoredVerificationStatus();

    if (storedVerificationStatus !== null && !storedVerificationStatus) {
      redirectToVerification();
      return;
    }

    try {
      setLoading(true);

      const res: LoginResponse = await login({
        email: normalizedEmail,
        password,
        schoolId: selectedSchoolId,
      });

      const user = res?.user;

      if (!res?.accessToken || !user) {
        throw new Error('Invalid login response.');
      }

      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      if (typeof user.isVerified === 'boolean') {
        localStorage.setItem(
          VERIFIED_KEY,
          String(user.isVerified)
        );
      }

      /*
       * Login succeeded, so the password should no longer
       * remain in React state after navigation.
       */
      setPassword('');

      sessionStorage.removeItem(SESSION_KEY);

      if (user.role === 'STUDENT') {
        navigate('/student-dashboard');
        return;
      }

      if (user.role === 'TEACHER') {
        navigate('/teacher-dashboard');
        return;
      }

      setError('Your account role is not supported.');
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        '';

      const normalizedMessage = message.toLowerCase();

      const isVerificationError =
        normalizedMessage.includes('not verified') ||
        normalizedMessage.includes('verify your email') ||
        normalizedMessage.includes('email verification') ||
        normalizedMessage.includes('email is not verified');

      if (isVerificationError) {
        redirectToVerification();
        return;
      }

      setError(
        message || 'Invalid credentials. Please check your details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeSchool = () => {
    navigate('/select-school', {
      state: {
        from: 'login',
      },
    });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% -10%, rgba(99,102,241,0.20) 0%, rgba(15,23,42,0.94) 45%, #020617 100%)',
        }}
      />

      {/* Decorative glow */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-indigo-600/10 blur-[100px] sm:h-[500px] sm:w-[500px]" />

      <div className="pointer-events-none absolute -bottom-40 -right-32 h-80 w-80 rounded-full bg-violet-600/10 blur-[110px] sm:h-[550px] sm:w-[550px]" />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Main */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
        <div className="w-full max-w-lg">
          {/* Brand / Top Label */}
          <div className="mb-5 flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10">
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Student Management System
            </span>
          </div>

          {/* Auth Card */}
          <section className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-slate-900/85 shadow-2xl shadow-black/40 backdrop-blur-2xl">
            {/* Top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600" />

            <div className="p-6 sm:p-8 lg:p-9">
              {/* Header */}
              <div className="mb-7 text-center">
                {selectedSchool ? (
                  <div className="mb-5 flex justify-center">
                    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-indigo-500/20 bg-slate-950/70 px-3.5 py-2 shadow-lg">
                      <Building2 className="h-4 w-4 shrink-0 text-indigo-400" />

                      <span className="max-w-[190px] truncate text-xs font-semibold text-indigo-200 sm:max-w-[260px] sm:text-sm">
                        {schoolName}
                      </span>

                      <span className="h-3.5 w-px bg-slate-700" />

                      <button
                        type="button"
                        onClick={handleChangeSchool}
                        className="shrink-0 text-[11px] font-semibold text-slate-400 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-5 flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 shadow-inner">
                      <UserCheck className="h-6 w-6 text-indigo-400" />
                    </div>
                  </div>
                )}

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Welcome Back
                </h1>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-slate-400 sm:text-sm">
                  Sign in to securely access your portal dashboard and account.
                </p>
              </div>

              {/* Verification Notice */}
              {verificationNotice && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-300 sm:text-sm"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />

                  <div>
                    <p className="font-semibold">
                      Email verification required
                    </p>
                    <p className="mt-0.5 text-amber-300/70">
                      Redirecting you to email verification...
                    </p>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && !verificationNotice && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="mb-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-300 sm:text-sm"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

                  <span className="leading-relaxed">
                    {error}
                  </span>
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
              >
                {/* Email */}
                <div>
                  <label
                    htmlFor="login-email"
                    className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300"
                  >
                    Email Address
                  </label>

                  <div className="group relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-focus-within:text-indigo-400 sm:h-5 sm:w-5" />

                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                        if (verificationNotice) {
                          setVerificationNotice(false);
                        }
                      }}
                      placeholder="you@school.edu"
                      autoComplete="email"
                      inputMode="email"
                      required
                      aria-label="Email address"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3.5 pl-11 pr-4 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 hover:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:py-4 sm:pl-12"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="login-password"
                      className="block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-indigo-400 transition hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="group relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-focus-within:text-indigo-400 sm:h-5 sm:w-5" />

                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      aria-label="Password"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3.5 pl-11 pr-12 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 hover:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:py-4 sm:pl-12"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-800/70 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember */}
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer select-none items-center gap-2.5 text-xs text-slate-400 transition hover:text-slate-300 sm:text-sm">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) =>
                        setRememberMe(e.target.checked)
                      }
                      className="h-4 w-4 cursor-pointer rounded border-slate-700 bg-slate-950 text-indigo-600 accent-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                    />

                    <span>Remember my email</span>
                  </label>

                  <div className="hidden items-center gap-1.5 text-[11px] text-slate-500 sm:flex">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Secure sign in
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 transition-all hover:from-indigo-500 hover:via-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:py-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing you in...
                    </>
                  ) : (
                    <>
                      Sign In to Portal
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-600">
                  Portal Access
                </span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>

              {/* Signup */}
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 text-center">
                <p className="text-xs text-slate-400 sm:text-sm">
                  Don't have an account?
                </p>

                <Link
                  to="/signup"
                  className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-indigo-400 transition hover:text-indigo-300 sm:text-sm"
                >
                  Create Portal Account
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </section>

          {/* Footer */}
          <p className="mt-5 text-center text-[10px] leading-relaxed text-slate-600 sm:text-xs">
            Secure access to your Student Management System
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
