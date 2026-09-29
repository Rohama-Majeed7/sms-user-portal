import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, ArrowRight, ArrowLeft, ShieldCheck, Building2 } from "lucide-react";
import { sendOtp } from "../../apis/auth/auth.service";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Alert } from "../../components/ui/Alert";

export const SendOtpPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const stateEmail = (location.state as { email?: string; role?: string })?.email;
  const initialEmail =
    stateEmail || sessionStorage.getItem("sms_verify_email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedSchool = (() => {
    try {
      return JSON.parse(localStorage.getItem("sms_selected_school") || "{}");
    } catch {
      return {};
    }
  })();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      await sendOtp(trimmedEmail, selectedSchool?.id);

      // Persist email in session storage for resilience against refreshes
      sessionStorage.setItem("sms_verify_email", trimmedEmail);

      // Successfully sent -> Redirect to Verify Email page
      navigate("/verify-email", {
        state: {
          email: trimmedEmail,
          role: (location.state as { role?: string })?.role,
        },
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to send verification code. Please try again."
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
            <Mail className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Verify Your Email
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            We will send a 6-digit verification code to your email
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          {/* School badge if present */}
          {selectedSchool?.schoolName && (
            <div className="mb-5 flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600 border border-slate-200/60">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                <span>{selectedSchool.schoolName}</span>
              </span>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-5">
              <Alert variant="danger" title="Error" message={error} />
            </div>
          )}

          {/* Explanatory banner */}
          <div className="mb-6 p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs sm:text-sm text-indigo-900 leading-relaxed">
            <p className="font-semibold text-indigo-950 mb-1">Email Verification Required</p>
            <p className="text-indigo-800/90 text-xs">
              To keep your portal account secure, please verify your email address.
              Click the button below to generate and send your one-time verification code.
            </p>
          </div>

          <form onSubmit={handleSendOtp} className="space-y-5">
            <Input
              id="send-otp-email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
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
              disabled={loading || !email.trim()}
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
        </div>

        {/* Subfooter */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4" />
          <span>Secure school portal registration</span>
        </div>
      </div>
    </div>
  );
};

export default SendOtpPage;
