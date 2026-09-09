import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  School,
  ShieldCheck,
  User,
  UserPlus,
} from 'lucide-react';
import type { UserRole } from '../../types/role';
import { signUp } from '../../apis/auth/auth.service';

const SESSION_KEY = 'sms_signup_draft';

interface SignupDraft {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  selectedRole?: UserRole;
}

interface SelectedSchool {
  id?: string | number;
  _id?: string;
  name?: string;
  schoolName?: string;
  username?: string;
  email?: string;
}

// interface LocationState {
//   from?: string;
// }

const getDraft = (): SignupDraft => {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);

    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const getSelectedSchool = (): SelectedSchool | null => {
  try {
    const saved = localStorage.getItem('sms_selected_school');

    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const SignupPage: React.FC = () => {
  const draft = useMemo(() => getDraft(), []);

  const [fullName, setFullName] = useState(draft.fullName || '');
  const [email, setEmail] = useState(draft.email || '');
  const [password, setPassword] = useState(draft.password || '');
  const [confirmPassword, setConfirmPassword] = useState(
    draft.confirmPassword || ''
  );

  const [selectedRole, setSelectedRole] = useState<UserRole>(
    draft.selectedRole || 'STUDENT'
  );

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedSchool, setSelectedSchool] =
    useState<SelectedSchool | null>(getSelectedSchool);

  const navigate = useNavigate();
  const location = useLocation();

  // const locationState = location.state as LocationState | null;

  /*
   * Keep the selected school in sync if the user comes back
   * from the school selector.
   */
  useEffect(() => {
    setSelectedSchool(getSelectedSchool());
  }, [location.key]);

  /*
   * Persist signup draft.
   */
  useEffect(() => {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        fullName,
        email,
        password,
        confirmPassword,
        selectedRole,
      })
    );
  }, [
    fullName,
    email,
    password,
    confirmPassword,
    selectedRole,
  ]);

  const schoolName =
    selectedSchool?.schoolName ||
    selectedSchool?.name ||
    selectedSchool?.username ||
    selectedSchool?.email ||
    'Selected School';

  const roleLabel =
    selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase();

  const isTeacher = selectedRole === 'TEACHER';

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const passwordStrongEnough = password.length >= 6;

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError('');

    if (!selectedSchool) {
      setError('Please select your school before creating an account.');
      navigate('/select-school', {
        state: { from: 'signup' },
      });
      return;
    }

    if (!fullName.trim() || !email.trim() || !password) {
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

      const schoolId =
        selectedSchool.id ?? selectedSchool._id;

      const res = await signUp({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role: selectedRole,
        schoolId,
      });

      localStorage.setItem(
        'isVerified',
        String(res?.user?.isVerified)
      );

      sessionStorage.removeItem(SESSION_KEY);

      navigate('/verify-email', {
        state: {
          email: res?.user?.email || email.trim(),
        },
      });
    } catch (err: any) {
      console.error('Signup error:', err);

      setError(
        err?.response?.data?.message ||
          'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.18),transparent_38%),linear-gradient(180deg,#0f172a_0%,#020617_100%)]" />

      {/* Decorative glow */}
      <div
        className={`pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full blur-[130px] sm:h-[600px] sm:w-[600px] ${
          isTeacher
            ? 'bg-emerald-600/10'
            : 'bg-indigo-600/10'
        }`}
      />

      <div
        className={`pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full blur-[130px] sm:h-[600px] sm:w-[600px] ${
          isTeacher
            ? 'bg-teal-600/10'
            : 'bg-violet-600/10'
        }`}
      />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }}
      />

      {/* Page */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:py-12">
        <div className="w-full max-w-2xl">
          {/* Branding */}
          <div className="mb-6 text-center">
            <div
              className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-lg ${
                isTeacher
                  ? 'border-emerald-400/20 bg-emerald-500/10 shadow-emerald-950/30'
                  : 'border-indigo-400/20 bg-indigo-500/10 shadow-indigo-950/30'
              }`}
            >
              <UserPlus
                className={`h-7 w-7 ${
                  isTeacher
                    ? 'text-emerald-400'
                    : 'text-indigo-400'
                }`}
              />
            </div>

            <p
              className={`mb-1 text-[11px] font-bold uppercase tracking-[0.22em] ${
                isTeacher
                  ? 'text-emerald-400'
                  : 'text-indigo-400'
              }`}
            >
              Student Management System
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Create your portal account
            </h1>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">
              Register as a student or teacher and get access to
              your school portal.
            </p>
          </div>

          {/* Main Card */}
          <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/85 shadow-2xl shadow-black/30 backdrop-blur-2xl">
            {/* Accent */}
            <div
              className={`h-1 w-full bg-gradient-to-r ${
                isTeacher
                  ? 'from-emerald-500 via-teal-500 to-emerald-500'
                  : 'from-indigo-500 via-violet-500 to-indigo-500'
              }`}
            />

            <div className="p-5 sm:p-7 lg:p-8">
              {/* Selected school */}
              {selectedSchool ? (
                <div
                  className={`mb-6 flex items-center gap-3 rounded-2xl border p-3.5 ${
                    isTeacher
                      ? 'border-emerald-500/20 bg-emerald-500/[0.05]'
                      : 'border-indigo-500/20 bg-indigo-500/[0.05]'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isTeacher
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-indigo-500/10 text-indigo-400'
                    }`}
                  >
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Registering with
                    </p>

                    <p className="truncate text-sm font-semibold text-white">
                      {schoolName}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate('/select-school', {
                        state: { from: 'signup' },
                      })
                    }
                    className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    navigate('/select-school', {
                      state: { from: 'signup' },
                    })
                  }
                  className="mb-6 flex w-full items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-4 text-left transition hover:border-indigo-500/40 hover:bg-indigo-500/[0.04]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    <School className="h-5 w-5" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">
                      Select your school
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Choose your institution before registering.
                    </p>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </button>
              )}

              {/* Role selector */}
              <div className="mb-6">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Account Type
                  </span>

                  <span className="text-[10px] text-slate-600">
                    Choose one
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleRoleChange('STUDENT')
                    }
                    className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-semibold transition-all ${
                      selectedRole === 'STUDENT'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <GraduationCap className="h-4 w-4" />
                    Student
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleRoleChange('TEACHER')
                    }
                    className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-semibold transition-all ${
                      selectedRole === 'TEACHER'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <School className="h-4 w-4" />
                    Teacher
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-3.5">
                  <span className="mt-1 h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-400" />

                  <p className="text-xs leading-5 text-red-300 sm:text-sm">
                    {error}
                  </p>
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Name + Email */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="form-label"
                    >
                      Full Name
                    </label>

                    <div className="relative">
                      <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) =>
                          setFullName(e.target.value)
                        }
                        placeholder="John Doe"
                        required
                        autoComplete="name"
                        className="form-input pl-11"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="form-label"
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder={
                          isTeacher
                            ? 'teacher@school.edu'
                            : 'student@school.edu'
                        }
                        required
                        autoComplete="email"
                        className="form-input pl-11"
                      />
                    </div>
                  </div>
                </div>

                {/* Password + Confirm */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="form-label"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                      <input
                        id="password"
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        placeholder="••••••••"
                        required
                        minLength={6}
                        autoComplete="new-password"
                        className="form-input px-11"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
                        aria-label={
                          showPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Password strength */}
                    {password.length > 0 && (
                      <div className="mt-2">
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-[10px] text-slate-600">
                            Password requirement
                          </span>

                          <span
                            className={`text-[10px] font-medium ${
                              passwordStrongEnough
                                ? 'text-emerald-400'
                                : 'text-amber-400'
                            }`}
                          >
                            {passwordStrongEnough
                              ? 'Good'
                              : '6+ characters'}
                          </span>
                        </div>

                        <div className="h-1 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className={`h-full rounded-full transition-all ${
                              passwordStrongEnough
                                ? 'w-full bg-emerald-500'
                                : 'w-1/2 bg-amber-500'
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="form-label"
                    >
                      Confirm Password
                    </label>

                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                      <input
                        id="confirmPassword"
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(
                            e.target.value
                          )
                        }
                        placeholder="••••••••"
                        required
                        autoComplete="new-password"
                        className={`form-input pl-11 pr-10 ${
                          confirmPassword.length > 0
                            ? passwordsMatch
                              ? 'border-emerald-500/50'
                              : 'border-red-500/50'
                            : ''
                        }`}
                      />

                      {confirmPassword.length > 0 && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                          {passwordsMatch ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <span className="text-xs text-red-400">
                              !
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {confirmPassword.length > 0 && (
                      <p
                        className={`mt-2 text-[10px] ${
                          passwordsMatch
                            ? 'text-emerald-400'
                            : 'text-red-400'
                        }`}
                      >
                        {passwordsMatch
                          ? 'Passwords match'
                          : 'Passwords do not match'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Terms */}
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-transparent p-1 text-xs text-slate-400 transition hover:bg-white/[0.02]">
                  <input
                    type="checkbox"
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                  />

                  <span className="leading-5">
                    I agree to the{' '}
                    <a
                      href="#terms"
                      onClick={(e) =>
                        e.preventDefault()
                      }
                      className="font-medium text-indigo-400 transition hover:text-indigo-300 hover:underline"
                    >
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a
                      href="#privacy"
                      onClick={(e) =>
                        e.preventDefault()
                      }
                      className="font-medium text-indigo-400 transition hover:text-indigo-300 hover:underline"
                    >
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`group flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${
                    isTeacher
                      ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 shadow-emerald-950/40 hover:from-emerald-500 hover:to-teal-500'
                      : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 shadow-indigo-950/40 hover:from-indigo-500 hover:to-violet-500'
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create {roleLabel} Account

                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-800" />

                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
                  Already registered?
                </span>

                <div className="h-px flex-1 bg-slate-800" />
              </div>

              {/* Login */}
              <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row">
                <span className="text-xs text-slate-500 sm:text-sm">
                  Already have an account?
                </span>

                <Link
                  to="/login"
                  className={`text-xs font-semibold transition sm:text-sm ${
                    isTeacher
                      ? 'text-emerald-400 hover:text-emerald-300'
                      : 'text-indigo-400 hover:text-indigo-300'
                  }`}
                >
                  Sign In to Portal
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.06] bg-slate-950/30 px-5 py-4 sm:px-7">
              <div className="flex items-center justify-center gap-2 text-center">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-slate-600" />

                <p className="text-[10px] leading-5 text-slate-600 sm:text-[11px]">
                  Your registration information is securely
                  transmitted to your school portal.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <p className="mt-5 text-center text-[10px] text-slate-600">
            Secure school portal registration
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;