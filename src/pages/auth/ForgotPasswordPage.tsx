import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail, ArrowRight, KeyRound, ArrowLeft,
  ShieldCheck, Lock, Eye, EyeOff, CheckCircle2
} from 'lucide-react';
import { sendOtp, verifyOtp, resetPassword } from '../../apis/auth/auth.service';

// ─── Types ────────────────────────────────────────────────────────
type Step = 'email' | 'otp' | 'reset' | 'done';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  // ── shared state ──────────────────────────────────────────────
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);   // seconds remaining
  const [resendLoading, setResendLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Countdown helpers ─────────────────────────────────────────
  const OTP_TTL = 120; // 2 minutes

  const startCountdown = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(OTP_TTL);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Start timer as soon as OTP step is shown; clear on unmount
  useEffect(() => {
    if (step === 'otp') startCountdown();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step, startCountdown]);

  const formatCountdown = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;


  const selectedSchool = (() => {
    try { return JSON.parse(localStorage.getItem('sms_selected_school') || 'null'); }
    catch { return null; }
  })();

  // ── Step 1: Send OTP ─────────────────────────────────────────
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Please enter your portal email address.'); return; }
    try {
      setLoading(true);
      await sendOtp(email, selectedSchool?.id);
      setStep('otp');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to send code. Please try again.');
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
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter all 6 digits.'); return; }
    try {
      setLoading(true);
      await verifyOtp(email, code, selectedSchool?.id);
      setStep('reset');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────
  const handleResend = async () => {
    setError('');
    setOtp(Array(6).fill(''));
    try {
      setResendLoading(true);
      await sendOtp(email, selectedSchool?.id);
      startCountdown();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  // ── Step 3: Reset Password ────────────────────────────────────
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!password || !confirm) { setError('Please fill in both fields.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    try {
      setLoading(true);
      await resetPassword(email, password, selectedSchool?.id);
      setStep('done');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Shared card shell ─────────────────────────────────────────
  const cardStyle: React.CSSProperties = {
    background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.22) 0%, rgba(15,23,42,0.98) 65%, #020617 100%)',
    padding: '1.25rem',
  };

  return (
    <div
      className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center relative overflow-hidden"
      style={cardStyle}
    >
      {/* Background glows */}
      <div className="absolute top-[-10%] left-[25%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[25%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div
        className="w-full max-w-md sm:max-w-lg bg-slate-900/90 backdrop-blur-2xl border border-indigo-500/20 rounded-3xl shadow-2xl shadow-slate-950 flex flex-col gap-6 z-20 my-auto"
        style={{ padding: '2.25rem 2rem' }}
      >

        {/* ── STEP 1: Email ───────────────────────────────────── */}
        {step === 'email' && (
          <>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-3 shadow-inner p-3">
                <KeyRound className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Reset Password</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                Enter your portal email and we'll send a 6-digit verification code.
              </p>
            </div>

            {error && <ErrorAlert message={error} />}

            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  PORTAL EMAIL ADDRESS
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

              <SubmitButton loading={loading} label="Send Verification Code" />
            </form>

            <BackToLogin />
          </>
        )}

        {/* ── STEP 2: OTP ─────────────────────────────────────── */}
        {step === 'otp' && (
          <>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-3 shadow-inner p-3">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Verify Code</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                We sent a 6-digit code to <span className="text-indigo-300 font-medium">{email}</span>
              </p>
            </div>

            {error && <ErrorAlert message={error} />}

            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6">
              {/* OTP boxes */}
              <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-13 sm:w-13 sm:h-14 text-center text-lg sm:text-xl font-bold bg-slate-950/90 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-slate-100 outline-none transition-all"
                    style={{ padding: '0.6rem 0' }}
                  />
                ))}
              </div>

              <SubmitButton loading={loading} label="Verify Code" />
            </form>

            {/* Countdown + Resend row */}
            <div className="flex flex-col items-center gap-2 pt-2 border-t border-slate-800/60">
              {countdown > 0 ? (
                <p className="text-xs text-slate-500">
                  Code expires in{' '}
                  <span className="font-semibold text-indigo-400 tabular-nums">{formatCountdown(countdown)}</span>
                </p>
              ) : (
                <p className="text-xs text-amber-400">Your code has expired.</p>
              )}
              <button
                type="button"
                disabled={countdown > 0 || resendLoading}
                onClick={handleResend}
                className="text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-transparent border-0 text-indigo-400 hover:text-indigo-300 disabled:hover:text-indigo-400"
              >
                {resendLoading ? 'Sending…' : 'Resend Code'}
              </button>
              <button
                type="button"
                onClick={() => { setStep('email'); setOtp(Array(6).fill('')); setError(''); }}
                className="text-xs text-slate-500 hover:text-slate-300 transition flex items-center gap-1 bg-transparent border-0 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" /> Change email
              </button>
            </div>
          </>
        )}

        {/* ── STEP 3: New Password ─────────────────────────────── */}
        {step === 'reset' && (
          <>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-3 shadow-inner p-3">
                <Lock className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">New Password</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                Choose a strong password for your portal account.
              </p>
            </div>

            {error && <ErrorAlert message={error} />}

            <form onSubmit={handleResetSubmit} className="flex flex-col gap-5">
              <PasswordField
                label="NEW PASSWORD"
                value={password}
                onChange={setPassword}
                show={showPw}
                onToggle={() => setShowPw(!showPw)}
                placeholder="Min. 8 characters"
              />
              <PasswordField
                label="CONFIRM PASSWORD"
                value={confirm}
                onChange={setConfirm}
                show={showConfirm}
                onToggle={() => setShowConfirm(!showConfirm)}
                placeholder="Re-enter new password"
              />
              <SubmitButton loading={loading} label="Reset Password" />
            </form>
          </>
        )}

        {/* ── STEP 4: Done ────────────────────────────────────── */}
        {step === 'done' && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Password Reset!</h2>
            <p className="text-slate-400 text-xs sm:text-sm text-center leading-relaxed">
              Your password has been updated successfully.<br />Redirecting you to sign in…
            </p>
            <div className="w-5 h-5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin mt-2" />
          </div>
        )}

      </div>
    </div>
  );
};

// ─── Shared sub-components ────────────────────────────────────────
const ErrorAlert = ({ message }: { message: string }) => (
  <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm flex items-center gap-2.5">
    <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 animate-pulse" />
    <span>{message}</span>
  </div>
);

const SubmitButton = ({ loading, label }: { loading: boolean; label: string }) => (
  <button
    type="submit"
    disabled={loading}
    style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem' }}
    className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
  >
    {loading ? (
      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    ) : (
      <>{label} <ArrowRight className="w-4 h-4" /></>
    )}
  </button>
);

const PasswordField = ({
  label, value, onChange, show, onToggle, placeholder
}: {
  label: string; value: string; onChange: (v: string) => void;
  show: boolean; onToggle: () => void; placeholder: string;
}) => (
  <div className="flex flex-col gap-2">
    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">{label}</label>
    <div className="relative flex items-center">
      <Lock className="w-4 h-4 sm:w-5 sm:h-5 absolute left-4 text-slate-400 pointer-events-none z-10" />
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        style={{ paddingLeft: '3rem', paddingRight: '3rem', paddingTop: '0.85rem', paddingBottom: '0.85rem' }}
        className="w-full bg-slate-950/90 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 text-slate-400 hover:text-slate-200 transition p-1.5 rounded-lg hover:bg-slate-800/60 z-10 cursor-pointer"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  </div>
);

const BackToLogin = () => (
  <p className="text-center text-xs sm:text-sm text-slate-400 pt-2 border-t border-slate-800/60 flex items-center justify-center gap-1.5">
    <ArrowLeft className="w-4 h-4 text-slate-400" />
    <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition">
      Back to Sign In
    </Link>
  </p>
);

export default ForgotPasswordPage;
