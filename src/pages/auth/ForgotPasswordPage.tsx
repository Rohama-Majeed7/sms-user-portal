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
  Building2,
} from 'lucide-react';
import {
  sendOtp,
  verifyOtp,
  resetPassword,
} from '../../apis/auth/auth.service';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';

type Step = 'email' | 'otp' | 'reset' | 'done';

const OTP_TTL = 120;

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

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
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatCountdown = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const selectedSchool = (() => {
    try {
      return JSON.parse(localStorage.getItem('sms_selected_school') || 'null');
    } catch {
      return null;
    }
  })();

  // ── Step 1: Send OTP ─────────────────────────────────────────
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your portal email address.');
      return;
    }

    try {
      setLoading(true);
      await sendOtp(email.trim(), selectedSchool?.id);
      setStep('otp');
      startCountdown();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Failed to send recovery code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: OTP Handlers ─────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
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
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    try {
      setLoading(true);
      await verifyOtp(email.trim(), code, selectedSchool?.id);
      setStep('reset');
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Invalid or expired code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setOtp(Array(6).fill(''));

    try {
      setResendLoading(true);
      await sendOtp(email.trim(), selectedSchool?.id);
      startCountdown();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Failed to resend code. Please try again.'
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
      setError('Please fill in both password fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email.trim(), password, selectedSchool?.id);
      setStep('done');
      setTimeout(() => navigate('/login'), 2200);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Failed to reset password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <KeyRound className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {step === 'email' && 'Reset Password'}
            {step === 'otp' && 'Verify Code'}
            {step === 'reset' && 'Create New Password'}
            {step === 'done' && 'Password Updated!'}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            {step === 'email' && 'Enter your portal email to receive a recovery code'}
            {step === 'otp' && `A 6-digit code was sent to ${email}`}
            {step === 'reset' && 'Choose a secure password for your account'}
            {step === 'done' && 'Your credentials have been securely refreshed'}
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          {/* Step indicator */}
          {step !== 'done' && (
            <div className="flex items-center justify-center gap-2 mb-6">
              {[
                { s: 'email', label: '1' },
                { s: 'otp', label: '2' },
                { s: 'reset', label: '3' },
              ].map((item, idx) => {
                const isCurrent = step === item.s;
                const isPast =
                  (item.s === 'email' && (step === 'otp' || step === 'reset')) ||
                  (item.s === 'otp' && step === 'reset');

                return (
                  <React.Fragment key={item.s}>
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-50'
                          : isPast
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="h-4 w-4" /> : item.label}
                    </div>
                    {idx < 2 && (
                      <div
                        className={`h-0.5 w-8 sm:w-10 rounded-full transition-all ${
                          isPast ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* School Badge */}
          {selectedSchool?.schoolName && step === 'email' && (
            <div className="mb-5 flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600 border border-slate-200/60">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                <span>{selectedSchool.schoolName}</span>
              </span>
            </div>
          )}

          {/* Error alert */}
          {error && (
            <div className="mb-5">
              <Alert variant="danger" title="Error" message={error} />
            </div>
          )}

          {/* ── STEP 1: Enter Email ── */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <Input
                id="reset-email"
                label="Portal Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@school.edu"
                required
                autoComplete="email"
                leftIcon={<Mail className="h-4 w-4" />}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="w-full"
              >
                Send Verification Code
              </Button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}

          {/* ── STEP 2: Enter 6-digit OTP ── */}
          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label className="block text-center text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Enter 6-Digit Code
                </label>

                <div
                  className="flex items-center justify-center gap-2 sm:gap-2.5"
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
                      maxLength={1}
                      autoComplete="one-time-code"
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-3 focus:ring-indigo-500/15 transition shadow-2xs"
                    />
                  ))}
                </div>
              </div>

              {/* Countdown & Resend */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
                {countdown > 0 ? (
                  <p>
                    Code expires in{' '}
                    <span className="font-bold text-slate-700 font-mono">
                      {formatCountdown(countdown)}
                    </span>
                  </p>
                ) : (
                  <p className="text-amber-600 font-medium">Code expired</p>
                )}

                <div className="mt-2 flex items-center justify-center gap-1">
                  <span>Didn't receive it?</span>
                  <button
                    type="button"
                    disabled={countdown > 0 || resendLoading}
                    onClick={handleResend}
                    className="font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {resendLoading ? 'Sending...' : 'Resend Code'}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
              >
                Verify Code
              </Button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setOtp(Array(6).fill(''));
                    setError('');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Change email address
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 3: Reset Password ── */}
          {step === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-5">
              <Input
                id="new-password"
                label="New Password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                leftIcon={<Lock className="h-4 w-4" />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />

              <Input
                id="confirm-password"
                label="Confirm New Password"
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter new password"
                required
                leftIcon={<Lock className="h-4 w-4" />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 leading-relaxed">
                Use at least 8 characters with a mix of letters, numbers, and symbols.
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
              >
                Reset Password
              </Button>
            </form>
          )}

          {/* ── STEP 4: Done ── */}
          {step === 'done' && (
            <div className="py-6 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">Success!</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Your password has been reset. Redirecting you to sign in...
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                >
                  <span>Click here if not redirected automatically</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Subfooter */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4" />
          <span>Encrypted account recovery</span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
