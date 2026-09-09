import React, {
  useState,
  useRef,
  useEffect,
} from 'react';

import {
  useNavigate,
  useLocation,
  Link,
} from 'react-router-dom';

import {
  Mail,
  MailCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RotateCw,
  ShieldCheck,
} from 'lucide-react';

import {
  sendOtp,
  verifyOtp,
} from '../../apis/auth/auth.service';

type Step = 'enter-email' | 'enter-otp';

const VerifyEmailPage: React.FC = () => {
  const location = useLocation();

  const emailFromState =
    (location.state as { email?: string })?.email || '';

  const selectedSchool = JSON.parse(
    localStorage.getItem('sms_selected_school') || '{}'
  );

  // Step state
  const [step, setStep] =
    useState<Step>('enter-email');

  // Step 1 – Email
  const [email, setEmail] =
    useState(emailFromState);

  const [sendLoading, setSendLoading] =
    useState(false);

  const [sendError, setSendError] =
    useState('');

  // Step 2 – OTP
  const [otp, setOtp] = useState<string[]>([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);

  const [verifyLoading, setVerifyLoading] =
    useState(false);

  const [verifyError, setVerifyError] =
    useState('');

  const [success, setSuccess] =
    useState(false);

  const [resendTimer, setResendTimer] =
    useState(0);

  const inputRefs =
    useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(
      () => setResendTimer((prev) => prev - 1),
      1000
    );

    return () => clearInterval(timer);
  }, [resendTimer]);

  /* ─── Step 1: Send OTP ─── */

  const handleSendOtp = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setSendError('');

    if (!email.trim()) {
      setSendError(
        'Please enter your email address.'
      );
      return;
    }

    try {
      setSendLoading(true);

      await sendOtp(
        email.trim(),
        selectedSchool.id
      );

      setStep('enter-otp');
      setResendTimer(120);
    } catch (err: any) {
      setSendError(
        err?.response?.data?.message ||
          'Failed to send OTP. Please try again.'
      );
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

      await sendOtp(
        email.trim(),
        selectedSchool.id
      );

      setOtp([
        '',
        '',
        '',
        '',
        '',
        '',
      ]);

      setResendTimer(120);

      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setVerifyError(
        err?.response?.data?.message ||
          'Failed to resend OTP. Please try again.'
      );
    } finally {
      setSendLoading(false);
    }
  };

  /* ─── Step 2: OTP input handlers ─── */

  const handleChange = (
    index: number,
    value: string
  ) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value.slice(-1);

    setOtp(newOtp);

    if (
      value &&
      index < 5
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === 'Backspace' &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData('text')
      .trim();

    if (/^\d{6}$/.test(pasted)) {
      setOtp(pasted.split(''));

      inputRefs.current[5]?.focus();
    }
  };

  /* ─── Step 2: Verify OTP ─── */

  const handleVerify = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setVerifyError('');

    const code = otp.join('');

    if (code.length < 6) {
      setVerifyError(
        'Please enter all 6 digits of the verification code.'
      );
      return;
    }

    try {
      setVerifyLoading(true);

      await verifyOtp(
        email.trim(),
        code,
        selectedSchool.id
      );

      localStorage.setItem(
        'isVerified',
        'true'
      );

      setSuccess(true);

      setTimeout(
        () => navigate('/login'),
        1800
      );
    } catch (err: any) {
      setVerifyError(
        err?.response?.data?.message ||
          'Invalid or expired code. Please try again.'
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070b16] text-slate-100 flex items-center justify-center relative overflow-hidden px-4 py-8 sm:px-6">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">

        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[420px] h-[420px] sm:w-[650px] sm:h-[650px] rounded-full bg-indigo-600/10 blur-[130px]" />

        <div className="absolute -bottom-40 -right-24 w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] rounded-full bg-violet-600/10 blur-[130px]" />

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

        {/* Main Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/85 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.45)]">

          {/* Accent line */}
          <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600" />

          <div className="p-6 sm:p-8 md:p-10">

            {/* ═══════════════ STEP 1 – Email ═══════════════ */}

            {step === 'enter-email' && (
              <>
                <PageHeader
                  icon={<Mail />}
                  title="Verify Your Email"
                  description="Enter your email address to receive a 6-digit verification code."
                />

                <SchoolBadge
                  name={
                    selectedSchool?.schoolName ||
                    selectedSchool?.name
                  }
                />

                {sendError && (
                  <ErrorAlert
                    message={sendError}
                  />
                )}

                <form
                  onSubmit={handleSendOtp}
                  className="mt-7 space-y-5"
                >

                  <FormField
                    value={email}
                    onChange={setEmail}
                  />

                  <button
                    type="submit"
                    disabled={sendLoading}
                    className="group w-full min-h-[50px] sm:min-h-[52px] bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:via-indigo-500 hover:to-violet-500 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    {sendLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>
                          Send Verification Code
                        </span>

                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </form>

                <BackToLogin />
              </>
            )}

            {/* ═══════════════ STEP 2 – OTP ═══════════════ */}

            {step === 'enter-otp' && (
              <>
                <PageHeader
                  icon={<MailCheck />}
                  title="Verify Your Email"
                  description={
                    <>
                      We sent a 6-digit verification
                      code to{' '}
                      <span className="text-indigo-300 font-semibold break-all">
                        {email}
                      </span>
                    </>
                  }
                />

                <StepIndicator />

                {success && (
                  <div className="mt-6 p-4 rounded-2xl bg-emerald-500/[0.07] border border-emerald-500/15 text-emerald-400 text-xs sm:text-sm flex items-start gap-3">

                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />

                    <div>
                      <p className="font-semibold">
                        Email verified successfully!
                      </p>

                      <p className="text-emerald-400/70 mt-0.5">
                        Redirecting to sign in...
                      </p>
                    </div>
                  </div>
                )}

                {verifyError && (
                  <ErrorAlert
                    message={verifyError}
                  />
                )}

                <form
                  onSubmit={handleVerify}
                  className="mt-7 space-y-6"
                >

                  {/* OTP Boxes */}
                  <div className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-3">

                    {otp.map(
                      (digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            inputRefs.current[index] =
                              el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleChange(
                              index,
                              e.target.value
                            )
                          }
                          onKeyDown={(e) =>
                            handleKeyDown(
                              index,
                              e
                            )
                          }
                          onPaste={handlePaste}
                          autoFocus={
                            index === 0
                          }
                          aria-label={`OTP digit ${
                            index + 1
                          }`}
                          className={`w-10 h-12 xs:w-11 xs:h-13 sm:w-13 sm:h-14 bg-slate-950/90 border ${
                            digit
                              ? 'border-indigo-500/60 bg-indigo-500/[0.06]'
                              : 'border-slate-800'
                          } hover:border-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-center text-lg sm:text-xl font-bold text-white outline-none transition-all shadow-inner`}
                        />
                      )
                    )}
                  </div>

                  {/* Timer / Resend */}
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 px-4 py-4">

                    <div className="flex flex-col items-center gap-2 text-xs">

                      {resendTimer > 0 ? (
                        <p className="text-slate-500">
                          Verification code expires in{' '}
                          <span className="font-semibold text-indigo-400 tabular-nums font-mono">
                            {`${Math.floor(
                              resendTimer / 60
                            )}:${String(
                              resendTimer % 60
                            ).padStart(2, '0')}`}
                          </span>
                        </p>
                      ) : (
                        <p className="text-amber-400">
                          Your verification code has expired.
                        </p>
                      )}

                      <div className="flex flex-wrap items-center justify-center gap-1.5 text-slate-500">

                        <span>
                          Didn't receive the code?
                        </span>

                        <button
                          type="button"
                          onClick={handleResend}
                          disabled={
                            resendTimer > 0 ||
                            sendLoading
                          }
                          className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <RotateCw
                            className={`w-3.5 h-3.5 ${
                              sendLoading
                                ? 'animate-spin'
                                : ''
                            }`}
                          />

                          {sendLoading
                            ? 'Sending…'
                            : 'Resend Code'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={
                      verifyLoading ||
                      success
                    }
                    className="group w-full min-h-[50px] sm:min-h-[52px] bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:via-indigo-500 hover:to-violet-500 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    {verifyLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>
                          Verify &amp; Continue
                        </span>

                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Change Email */}
                <div className="mt-6 pt-5 border-t border-slate-800/70">

                  <button
                    type="button"
                    onClick={() => {
                      setStep(
                        'enter-email'
                      );

                      setOtp([
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                      ]);

                      setVerifyError('');
                    }}
                    className="mx-auto text-xs sm:text-sm text-slate-500 hover:text-slate-300 transition flex items-center justify-center gap-1.5 bg-transparent border-0 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />

                    Change email address
                  </button>
                </div>

                <BackToLogin />
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] sm:text-xs text-slate-600 mt-6">
          Secure email verification • Student Management System
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
  icon: React.ReactElement<{ className?: string }>;
  title: string;
  description: React.ReactNode;
}) => (
  <div className="text-center flex flex-col items-center">

    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-lg shadow-indigo-950/20 mb-5">
      {React.cloneElement(
        icon,
        {
          className: 'w-6 h-6',
        }
      )}
    </div>

    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
      {title}
    </h2>

    <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed max-w-sm">
      {description}
    </p>
  </div>
);

const SchoolBadge = ({
  name,
}: {
  name?: string;
}) => {
  if (!name) return null;

  return (
    <div className="mt-5 flex justify-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-indigo-500/[0.07] border border-indigo-500/15">

        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

        <span className="text-[11px] sm:text-xs text-slate-400">
          {name}
        </span>
      </div>
    </div>
  );
};

const StepIndicator = () => (
  <div className="flex items-center justify-center gap-3 mt-6">

    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-500 border border-indigo-400 text-white text-[10px] font-bold shadow-lg shadow-indigo-600/20">
      <CheckCircle2 className="w-3.5 h-3.5" />
    </div>

    <div className="w-10 sm:w-14 h-px bg-indigo-500/70" />

    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-500 border border-indigo-400 text-white text-[10px] font-bold shadow-lg shadow-indigo-600/20">
      2
    </div>
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

const FormField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="space-y-2">

    <label className="block text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-[0.12em]">
      Email Address
    </label>

    <div className="relative">

      <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none text-slate-500">
        <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>

      <input
        type="email"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder="user@school.edu"
        required
        autoFocus
        autoComplete="email"
        className="w-full h-12 sm:h-[52px] bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-600 outline-none transition-all pl-12 pr-4"
      />
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

export default VerifyEmailPage;
