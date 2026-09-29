import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  MailCheck,
  RotateCw,
  ShieldCheck,
  Building2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { sendOtp, verifyOtp } from "../../apis/auth/auth.service";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";

const RESEND_COOLDOWN_SECONDS = 120;

export const VerifyEmailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const stateEmail = (location.state as { email?: string; role?: string })?.email;
  const email = stateEmail || sessionStorage.getItem("sms_verify_email") || "";

  const selectedSchool = (() => {
    try {
      return JSON.parse(localStorage.getItem("sms_selected_school") || "{}");
    } catch {
      return {};
    }
  })();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [success, setSuccess] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN_SECONDS);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input field on initial load
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Format seconds into MM:SS
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  // OTP inputs handling
  const handleChange = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // If multiple digits entered/pasted into input
    if (numericValue.length > 1) {
      const digits = numericValue.slice(0, 6).split("");
      const newOtp = [...otp];
      for (let i = 0; i < digits.length; i++) {
        if (index + i < 6) {
          newOtp[index + i] = digits[i];
        }
      }
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = numericValue.slice(-1);
    setOtp(newOtp);

    // Auto-advance to the next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const digits = pasted.split("");
    const newOtp = Array(6).fill("");
    digits.forEach((digit, idx) => {
      newOtp[idx] = digit;
    });
    setOtp(newOtp);

    const targetIdx = Math.min(digits.length, 5);
    inputRefs.current[targetIdx]?.focus();
  };

  // Submit OTP Verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyLoading || success) return;
    setVerifyError("");
    setResendSuccess(false);

    if (!email) {
      setVerifyError("No email address provided for verification. Please return to send OTP.");
      return;
    }

    const code = otp.join("");
    if (code.length < 6) {
      setVerifyError("Please enter all 6 digits of the verification code.");
      return;
    }

    try {
      setVerifyLoading(true);
      const res = await verifyOtp(email.trim(), code, selectedSchool?.id);

      if (res?.success) {
        setSuccess(true);
        // Clean up pending verification email
        sessionStorage.removeItem("sms_verify_email");
        setTimeout(() => {
          navigate("/login");
        }, 1800);
      } else {
        setVerifyError(res?.message || "Verification failed. Please check the code and try again.");
      }
    } catch (err: any) {
      setVerifyError(
        err?.response?.data?.message || "Invalid or expired verification code."
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendTimer > 0 || resendLoading) return;
    setVerifyError("");
    setResendSuccess(false);

    if (!email) {
      setVerifyError("Email address missing. Please return to the Send OTP screen.");
      return;
    }

    try {
      setResendLoading(true);
      await sendOtp(email.trim(), selectedSchool?.id);
      setOtp(Array(6).fill(""));
      setResendTimer(RESEND_COOLDOWN_SECONDS);
      setResendSuccess(true);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setVerifyError(
        err?.response?.data?.message || "Failed to resend code. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <MailCheck className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Verify Email
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            {email ? (
              <>
                Enter the 6-digit code sent to{" "}
                <span className="font-semibold text-slate-700">{email}</span>
              </>
            ) : (
              "Enter the 6-digit code sent to your email"
            )}
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

          {/* Error Alert */}
          {verifyError && (
            <div className="mb-5">
              <Alert variant="danger" title="Verification Error" message={verifyError} />
            </div>
          )}

          {/* Resend Success Alert */}
          {resendSuccess && (
            <div className="mb-5">
              <Alert
                variant="success"
                title="Code Sent"
                message="A new 6-digit verification code has been dispatched to your email."
              />
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-5">
              <Alert
                variant="success"
                title="Verified!"
                message="Your email has been verified successfully. Redirecting to sign in..."
              />
            </div>
          )}

          {/* Missing email fallback */}
          {!email ? (
            <div className="text-center py-4 space-y-4">
              <p className="text-xs sm:text-sm text-slate-600">
                No email address found for this verification session.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate("/send-otp")}
                className="w-full"
              >
                Go to Send OTP
              </Button>
            </div>
          ) : (
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
                      disabled={verifyLoading || success}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-3 focus:ring-indigo-500/15 transition shadow-2xs disabled:bg-slate-100 disabled:opacity-60"
                    />
                  ))}
                </div>
              </div>

              {/* Timer / Resend */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
                {resendTimer > 0 ? (
                  <p>
                    Code expires in{" "}
                    <span className="font-bold text-slate-700 font-mono">
                      {formatTimer(resendTimer)}
                    </span>
                  </p>
                ) : (
                  <p className="text-amber-600 font-medium">
                    Verification code expired
                  </p>
                )}

                <div className="mt-2 flex items-center justify-center gap-1">
                  <span>Didn't receive code?</span>
                  <button
                    type="button"
                    disabled={resendTimer > 0 || resendLoading || verifyLoading || success}
                    onClick={handleResend}
                    className="font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <RotateCw
                      className={`h-3 w-3 ${resendLoading ? "animate-spin" : ""}`}
                    />
                    {resendLoading ? "Sending..." : "Resend Code"}
                  </button>
                </div>
              </div>

              {/* Verify Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={verifyLoading || success}
                disabled={otp.join("").length < 6 || verifyLoading || success}
                className="w-full"
              >
                {success ? (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified!
                  </span>
                ) : (
                  "Verify & Continue"
                )}
              </Button>

              {/* Change email address link */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    navigate("/send-otp", {
                      state: { email },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Change email address
                </button>
              </div>
            </form>
          )}

          {/* Back to sign in link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link
              to="/login"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Back to Sign In
            </Link>
          </div>
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
