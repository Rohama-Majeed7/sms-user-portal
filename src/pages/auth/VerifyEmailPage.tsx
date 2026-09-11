import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Mail,
  MailCheck,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { sendOtp, verifyOtp } from '../../apis/auth/auth.service';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';

type Step = 'enter-email' | 'enter-otp';

export const VerifyEmailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const emailFromState = (location.state as { email?: string })?.email || '';
  const selectedSchool = JSON.parse(
    localStorage.getItem('sms_selected_school') || '{}'
  );

  const [step, setStep] = useState<Step>(
    emailFromState ? 'enter-otp' : 'enter-email'
  );
  const [email, setEmail] = useState(emailFromState);
  const [sendLoading, setSendLoading] = useState(false);
  const [sendError, setSendError] = useState('');

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(emailFromState ? 120 : 0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Step 1: Send OTP
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
      setSendError(
        err?.response?.data?.message || 'Failed to send verification code. Please try again.'
      );
    } finally {
      setSendLoading(false);
    }
  };

  // Step 2: Resend OTP
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setSendError('');
    setVerifyError('');

    try {
      setSendLoading(true);
      await sendOtp(email.trim(), selectedSchool.id);
      setOtp(Array(6).fill(''));
      setResendTimer(120);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setVerifyError(
        err?.response?.data?.message || 'Failed to resend code. Please try again.'
      );
    } finally {
      setSendLoading(false);
    }
  };

  // OTP inputs
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
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

  // Verify OTP
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
      setVerifyError(
        err?.response?.data?.message || 'Invalid or expired verification code.'
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            {step === 'enter-email' ? (
              <Mail className="h-6 w-6" />
            ) : (
              <MailCheck className="h-6 w-6" />
            )}
          </div>

          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Verify Your Email
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            {step === 'enter-email'
              ? 'Enter your portal email to receive a verification code'
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          {/* School badge */}
          {selectedSchool?.schoolName && (
            <div className="mb-5 flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600 border border-slate-200/60">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                <span>{selectedSchool.schoolName}</span>
              </span>
            </div>
          )}

          {/* Alerts */}
          {sendError && (
            <div className="mb-5">
              <Alert variant="danger" title="Error" message={sendError} />
            </div>
          )}
          {verifyError && (
            <div className="mb-5">
              <Alert variant="danger" title="Error" message={verifyError} />
            </div>
          )}
          {success && (
            <div className="mb-5">
              <Alert
                variant="success"
                title="Verified!"
                message="Your email has been verified successfully. Redirecting to sign in..."
              />
            </div>
          )}

          {/* ── STEP 1: Enter Email ── */}
          {step === 'enter-email' && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <Input
                id="verify-email"
                label="Email Address"
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
                loading={sendLoading}
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

          {/* ── STEP 2: Enter OTP ── */}
          {step === 'enter-otp' && (
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="block text-center text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  6-Digit Verification Code
                </label>

                <div
                  className="flex items-center justify-center gap-2 sm:gap-2.5"
                  onPaste={handlePaste}
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      autoComplete="one-time-code"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      autoFocus={index === 0}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-3 focus:ring-indigo-500/15 transition shadow-2xs"
                    />
                  ))}
                </div>
              </div>

              {/* Timer / Resend */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
                {resendTimer > 0 ? (
                  <p>
                    Code expires in{' '}
                    <span className="font-bold text-slate-700 font-mono">
                      {`${Math.floor(resendTimer / 60)}:${String(resendTimer % 60).padStart(2, '0')}`}
                    </span>
                  </p>
                ) : (
                  <p className="text-amber-600 font-medium">Verification code expired</p>
                )}

                <div className="mt-2 flex items-center justify-center gap-1">
                  <span>Didn't receive code?</span>
                  <button
                    type="button"
                    disabled={resendTimer > 0 || sendLoading}
                    onClick={handleResend}
                    className="font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <RotateCw className={`h-3 w-3 ${sendLoading ? 'animate-spin' : ''}`} />
                    {sendLoading ? 'Sending...' : 'Resend Code'}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={verifyLoading || success}
                className="w-full"
              >
                Verify &amp; Continue
              </Button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep('enter-email');
                    setOtp(Array(6).fill(''));
                    setVerifyError('');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Change email address
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Subfooter */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4" />
          <span>Verified Student &amp; Faculty Registration</span>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
