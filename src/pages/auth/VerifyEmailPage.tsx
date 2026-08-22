import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, MailCheck, ArrowRight, ArrowLeft, CheckCircle2, RotateCw } from 'lucide-react';
import { sendOtp, verifyOtp } from '../../apis/auth/auth.service';

type Step = 'enter-email' | 'enter-otp';

const VerifyEmailPage: React.FC = () => {
  const location = useLocation();
  const emailFromState = (location.state as { email?: string })?.email || '';
  const selectedSchool = JSON.parse(localStorage.getItem('sms_selected_school') || '{}');
  // Step state
  const [step, setStep] = useState<Step>(emailFromState ? 'enter-email' : 'enter-email');

  // Step 1 – Email
  const [email, setEmail] = useState(emailFromState);
  const [sendLoading, setSendLoading] = useState(false);
  const [sendError, setSendError] = useState('');

  // Step 2 – OTP
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);


  /* ─── Step 1: Send OTP ─── */
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendError('');
    if (!email.trim()) {
      setSendError('Please enter your email address.');
      return;
    }
    try {
      setSendLoading(true);
      await sendOtp(email.trim(), selectedSchool.id);
      setStep('enter-otp');
      setResendTimer(120);
    } catch (err: any) {
      setSendError(err?.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setSendLoading(false);
    }
  };

  /* ─── Step 2: Resend OTP ─── */
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setSendError('');
    setVerifyError('');
    try {
      setSendLoading(true);
      await sendOtp(email.trim(), selectedSchool.id);
      setOtp(['', '', '', '', '', '']);
      setResendTimer(120);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setVerifyError(err?.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setSendLoading(false);
    }
  };

  /* ─── Step 2: OTP input handlers ─── */
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  /* ─── Step 2: Verify OTP ─── */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError('');
    const code = otp.join('');
    if (code.length < 6) {
      setVerifyError('Please enter all 6 digits of the verification code.');
      return;
    }
    try {
      setVerifyLoading(true);
      await verifyOtp(email.trim(), code, selectedSchool.id);
      localStorage.setItem('isVerified', 'true');
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1800);
    } catch (err: any) {
      setVerifyError(err?.response?.data?.message || 'Invalid or expired code. Please try again.');
    } finally {
      setVerifyLoading(false);
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

        {/* ═══════════════ STEP 1 – Enter Email ═══════════════ */}
        {step === 'enter-email' && (
          <>
            {/* Header */}
            <div className="text-center flex flex-col items-center">
              <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-3 shadow-inner p-3">
                <Mail className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Verify Email</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                Enter your email address to receive a 6-digit verification code.
              </p>
            </div>

            {/* Error */}
            {sendError && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 animate-pulse" />
                <span>{sendError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
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
                    autoFocus
                    style={{ paddingLeft: '3rem', paddingRight: '1rem', paddingTop: '0.85rem', paddingBottom: '0.85rem' }}
                    className="w-full bg-slate-950/90 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={sendLoading}
                style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem' }}
                className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
              >
                {sendLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Send OTP <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            {/* Back link */}
            <p className="text-center text-xs sm:text-sm text-slate-400 pt-2 border-t border-slate-800/60 flex items-center justify-center gap-1.5">
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition">
                Back to Sign In
              </Link>
            </p>
          </>
        )}

        {/* ═══════════════ STEP 2 – Enter OTP ═══════════════ */}
        {step === 'enter-otp' && (
          <>
            {/* Header */}
            <div className="text-center flex flex-col items-center">
              <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-3 shadow-inner p-3">
                <MailCheck className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Enter OTP</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                We sent a 6-digit code to{' '}
                <span className="text-indigo-300 font-semibold">{email}</span>.{' '}
                <button
                  type="button"
                  onClick={() => { setStep('enter-email'); setOtp(['', '', '', '', '', '']); setVerifyError(''); }}
                  className="text-slate-400 hover:text-white underline text-[11px] bg-transparent border-0 cursor-pointer p-0"
                >
                  Change
                </button>
              </p>
            </div>

            {/* Success Alert */}
            {success && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>Email verified successfully! Redirecting to sign in...</span>
              </div>
            )}

            {/* Error Alert */}
            {verifyError && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 animate-pulse" />
                <span>{verifyError}</span>
              </div>
            )}

            {/* OTP Form */}
            <form onSubmit={handleVerify} className="flex flex-col gap-6">
              {/* 6 OTP Input Boxes */}
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    autoFocus={index === 0}
                    style={{ width: '2.75rem', height: '3.25rem' }}
                    className="bg-slate-950/90 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-center text-lg font-bold text-slate-100 outline-none transition-all shadow-inner"
                  />
                ))}
              </div>

              {/* Countdown + Resend */}
              <div className="flex flex-col items-center gap-1.5 text-xs">
                {resendTimer > 0 ? (
                  <p className="text-slate-500">
                    Code expires in{' '}
                    <span className="font-semibold text-indigo-400 tabular-nums font-mono">
                      {`${Math.floor(resendTimer / 60)}:${String(resendTimer % 60).padStart(2, '0')}`}
                    </span>
                  </p>
                ) : (
                  <p className="text-amber-400">Your code has expired.</p>
                )}
                <div className="flex items-center gap-1 text-slate-400">
                  <span>Didn't receive the code?</span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendTimer > 0 || sendLoading}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-indigo-400"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${sendLoading ? 'animate-spin' : ''}`} />
                    {sendLoading ? 'Sending…' : 'Resend Code'}
                  </button>
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={verifyLoading || success}
                style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem' }}
                className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
              >
                {verifyLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Verify &amp; Proceed <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            {/* Back link */}
            <p className="text-center text-xs sm:text-sm text-slate-400 pt-2 border-t border-slate-800/60 flex items-center justify-center gap-1.5">
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition">
                Back to Sign In
              </Link>
            </p>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyEmailPage;
