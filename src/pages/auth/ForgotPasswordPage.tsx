import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';

import { useNavigate, Link } from 'react-router-dom';

import {
  Mail,
  ArrowRight,
  KeyRound,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

import {
  sendOtp,
  verifyOtp,
  resetPassword,
} from '../../apis/auth/auth.service';

// ─── Types ────────────────────────────────────────────────────────

type Step = 'email' | 'otp' | 'reset' | 'done';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  // ── Shared state ──────────────────────────────────────────────

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Countdown helpers ─────────────────────────────────────────

  const OTP_TTL = 120;

  const startCountdown = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setCountdown(OTP_TTL);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    if (step === 'otp') {
      startCountdown();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [step, startCountdown]);

  const formatCountdown = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const selectedSchool = (() => {
    try {
      return JSON.parse(
        localStorage.getItem('sms_selected_school') || 'null'
      );
    } catch {
      return null;
    }
  })();

  // ── Step 1: Send OTP ─────────────────────────────────────────

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your portal email address.');
      return;
    }

    try {
      setLoading(true);

      await sendOtp(email, selectedSchool?.id);

      setStep('otp');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Failed to send code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ───────────────────────────────────────

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...otp];
    next[index] = value;

    setOtp(next);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent
  ) => {
    if (
      e.key === 'Backspace' &&
      !otp[index] &&
      index > 0
    ) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);

    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const code = otp.join('');

    if (code.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    try {
      setLoading(true);

      await verifyOtp(
        email,
        code,
        selectedSchool?.id
      );

      setStep('reset');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Invalid or expired code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ───────────────────────────────────────────────

  const handleResend = async () => {
    setError('');
    setOtp(Array(6).fill(''));

    try {
      setResendLoading(true);

      await sendOtp(email, selectedSchool?.id);

      startCountdown();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Failed to resend code. Please try again.'
      );
    } finally {
      setResendLoading(false);
    }
  };

  // ── Step 3: Reset Password ───────────────────────────────────

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirm) {
      setError('Please fill in both fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      await resetPassword(
        email,
        password,
        selectedSchool?.id
      );

      setStep('done');

      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Failed to reset password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ── UI ───────────────────────────────────────────────────────

  return (
    <div className="min-h-screen w-full bg-[#070b16] text-slate-100 flex items-center justify-center relative overflow-hidden px-4 py-8 sm:px-6">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[420px] h-[420px] sm:w-[650px] sm:h-[650px] rounded-full bg-indigo-600/10 blur-[130px]" />

        <div className="absolute -bottom-40 -right-20 w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] rounded-full bg-violet-600/10 blur-[130px]" />

        <div className="absolute top-1/3 -left-40 w-[300px] h-[300px] rounded-full bg-blue-600/5 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg">

        {/* Brand */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/25">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>

            <span className="text-sm sm:text-base font-bold tracking-tight text-white">
              Student Management System
            </span>
          </div>

          <div className="mt-3 h-px w-12 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        </div>

        {/* Main card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/85 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.45)]">

          {/* Top gradient */}
          <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600" />

          <div className="p-6 sm:p-8 md:p-10">

            {/* ── STEP 1: Email ─────────────────────────────── */}

            {step === 'email' && (
              <>
                <PageHeader
                  icon={<KeyRound />}
                  title="Reset Password"
                  description="Enter your portal email and we'll send a 6-digit verification code."
                />

                {selectedSchool?.schoolName && (
                  <SchoolBadge
                    name={selectedSchool.schoolName}
                  />
                )}

                {error && <ErrorAlert message={error} />}

                <form
                  onSubmit={handleEmailSubmit}
                  className="mt-6 space-y-5"
                >
                  <FormField
                    label="Portal Email Address"
                    icon={<Mail />}
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="user@school.edu"
                  />

                  <SubmitButton
                    loading={loading}
                    label="Send Verification Code"
                  />
                </form>

                <BackToLogin />
              </>
            )}

            {/* ── STEP 2: OTP ──────────────────────────────── */}

            {step === 'otp' && (
              <>
                <PageHeader
                  icon={<ShieldCheck />}
                  title="Verify Code"
                  description={
                    <>
                      We sent a 6-digit code to{' '}
                      <span className="text-indigo-300 font-semibold break-all">
                        {email}
                      </span>
                    </>
                  }
                />

                <StepIndicator currentStep={2} />

                {error && <ErrorAlert message={error} />}

                <form
                  onSubmit={handleOtpSubmit}
                  className="mt-7 space-y-6"
                >
                  <div
                    className="flex justify-center gap-1.5 xs:gap-2 sm:gap-3"
                    onPaste={handleOtpPaste}
                  >
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          otpRefs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOtpChange(
                            i,
                            e.target.value
                          )
                        }
                        onKeyDown={(e) =>
                          handleOtpKeyDown(i, e)
                        }
                        aria-label={`Verification digit ${i + 1}`}
                        className="w-10 h-12 xs:w-11 xs:h-13 sm:w-13 sm:h-14 text-center text-lg sm:text-xl font-bold bg-slate-950/90 border border-slate-700/80 hover:border-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-white outline-none transition-all shadow-inner"
                      />
                    ))}
                  </div>

                  <SubmitButton
                    loading={loading}
                    label="Verify Code"
                  />
                </form>

                <div className="mt-6 pt-5 border-t border-slate-800/70 flex flex-col items-center gap-3">
                  {countdown > 0 ? (
                    <p className="text-xs text-slate-500">
                      Code expires in{' '}
                      <span className="font-semibold text-indigo-400 tabular-nums">
                        {formatCountdown(countdown)}
                      </span>
                    </p>
                  ) : (
                    <p className="text-xs text-amber-400">
                      Your code has expired.
                    </p>
                  )}

                  <button
                    type="button"
                    disabled={
                      countdown > 0 ||
                      resendLoading
                    }
                    onClick={handleResend}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition disabled:opacity-40 disabled:cursor-not-allowed bg-transparent border-0 cursor-pointer"
                  >
                    {resendLoading
                      ? 'Sending…'
                      : 'Resend Code'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setOtp(Array(6).fill(''));
                      setError('');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-300 transition flex items-center gap-1.5 bg-transparent border-0 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Change email
                  </button>
                </div>
              </>
            )}

            {/* ── STEP 3: New Password ─────────────────────── */}

            {step === 'reset' && (
              <>
                <PageHeader
                  icon={<Lock />}
                  title="New Password"
                  description="Choose a strong password for your portal account."
                />

                <StepIndicator currentStep={3} />

                {error && <ErrorAlert message={error} />}

                <form
                  onSubmit={handleResetSubmit}
                  className="mt-7 space-y-5"
                >
                  <PasswordField
                    label="New Password"
                    value={password}
                    onChange={setPassword}
                    show={showPw}
                    onToggle={() =>
                      setShowPw(!showPw)
                    }
                    placeholder="Minimum 8 characters"
                  />

                  <PasswordField
                    label="Confirm Password"
                    value={confirm}
                    onChange={setConfirm}
                    show={showConfirm}
                    onToggle={() =>
                      setShowConfirm(!showConfirm)
                    }
                    placeholder="Re-enter your new password"
                  />

                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3">
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                      Use at least 8 characters and avoid
                      using passwords you already use on
                      other accounts.
                    </p>
                  </div>

                  <SubmitButton
                    loading={loading}
                    label="Reset Password"
                  />
                </form>
              </>
            )}

            {/* ── STEP 4: Done ─────────────────────────────── */}

            {step === 'done' && (
              <div className="flex flex-col items-center text-center py-5 sm:py-8">

                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl" />

                  <div className="relative w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Password Reset!
                  </h2>

                  <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                    Your password has been updated
                    successfully.
                    <br />
                    Redirecting you to sign in…
                  </p>
                </div>

                <div className="mt-7 flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-4 h-4 border-2 border-indigo-400/20 border-t-indigo-400 rounded-full animate-spin" />
                  Please wait
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] sm:text-xs text-slate-600 mt-6">
          Secure account recovery • Student Management System
        </p>
      </div>
    </div>
  );
};

// ─── Shared UI Components ─────────────────────────────────────────

const PageHeader = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}) => (
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-lg shadow-indigo-950/20 mb-5">
      {React.cloneElement(
        icon as React.ReactElement<{ className?: string }>,
        {
          className: 'w-6 h-6',
        }
      )}
    </div>

    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
      {title}
    </h2>

    <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed max-w-sm mx-auto">
      {description}
    </p>
  </div>
);

const SchoolBadge = ({
  name,
}: {
  name: string;
}) => (
  <div className="mt-5 flex items-center justify-center">
    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-indigo-500/[0.07] border border-indigo-500/15">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

      <span className="text-[11px] sm:text-xs text-slate-400">
        {name}
      </span>
    </div>
  </div>
);

const StepIndicator = ({
  currentStep,
}: {
  currentStep: number;
}) => (
  <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6 mb-1">
    {[1, 2, 3].map((item) => (
      <React.Fragment key={item}>
        <div
          className={`flex items-center justify-center w-7 h-7 rounded-full text-[10px] sm:text-xs font-bold border transition-all ${
            item <= currentStep
              ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900 border-slate-700 text-slate-500'
          }`}
        >
          {item < currentStep ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            item
          )}
        </div>

        {item < 3 && (
          <div
            className={`w-8 sm:w-12 h-px transition-all ${
              item < currentStep
                ? 'bg-indigo-500'
                : 'bg-slate-800'
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

const ErrorAlert = ({
  message,
}: {
  message: string;
}) => (
  <div
    role="alert"
    className="mt-5 p-3.5 rounded-2xl bg-red-500/[0.07] border border-red-500/15 text-red-400 text-xs sm:text-sm flex items-start gap-3"
  >
    <span className="mt-1 w-2 h-2 rounded-full bg-red-400 flex-shrink-0 animate-pulse" />

    <span className="leading-relaxed">
      {message}
    </span>
  </div>
);

const SubmitButton = ({
  loading,
  label,
}: {
  loading: boolean;
  label: string;
}) => (
  <button
    type="submit"
    disabled={loading}
    className="group w-full min-h-[48px] sm:min-h-[52px] bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:via-indigo-500 hover:to-violet-500 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
  >
    {loading ? (
      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    ) : (
      <>
        <span>{label}</span>

        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </>
    )}
  </button>
);

const FormField = ({
  label,
  icon,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) => (
  <div className="space-y-2">
    <label className="block text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-[0.12em]">
      {label}
    </label>

    <div className="relative">
      <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none text-slate-500">
        {React.cloneElement(
          icon as React.ReactElement<{ className?: string }>,
          {
            className: 'w-4 h-4 sm:w-5 sm:h-5',
          }
        )}
      </div>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        required
        autoComplete="email"
        className="w-full h-12 sm:h-[52px] bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-600 outline-none transition-all pl-12 pr-4"
      />
    </div>
  </div>
);

const PasswordField = ({
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder: string;
}) => (
  <div className="space-y-2">
    <label className="block text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-[0.12em]">
      {label}
    </label>

    <div className="relative">
      <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none text-slate-500">
        <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>

      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        required
        autoComplete={
          label === 'New Password'
            ? 'new-password'
            : 'new-password'
        }
        className="w-full h-12 sm:h-[52px] bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-600 outline-none transition-all pl-12 pr-12"
      />

      <button
        type="button"
        onClick={onToggle}
        aria-label={
          show
            ? `Hide ${label.toLowerCase()}`
            : `Show ${label.toLowerCase()}`
        }
        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition p-2 rounded-lg hover:bg-slate-800/70 cursor-pointer"
      >
        {show ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
    </div>
  </div>
);

const BackToLogin = () => (
  <div className="mt-6 pt-5 border-t border-slate-800/70">
    <p className="text-center text-xs sm:text-sm text-slate-500 flex items-center justify-center gap-1.5">
      <ArrowLeft className="w-4 h-4" />

      <Link
        to="/login"
        className="text-indigo-400 font-semibold hover:text-indigo-300 transition"
      >
        Back to Sign In
      </Link>
    </p>
  </div>
);

export default ForgotPasswordPage;
