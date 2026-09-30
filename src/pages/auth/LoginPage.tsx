import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  GraduationCap,
} from "lucide-react";
import { login } from "../../apis/auth/auth.service";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Alert } from "../../components/ui/Alert";
import { validateEmail } from "../../utils/validation";

const SESSION_KEY = "sms_login_draft";
const REMEMBER_KEY = "sms_remember_email";

interface LoginDraft {
  email?: string;
}

const getSessionDraft = (): LoginDraft => {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const sessionDraft = useMemo(() => getSessionDraft(), []);
  const rememberedEmail = localStorage.getItem(REMEMBER_KEY);

  const [email, setEmail] = useState(
    rememberedEmail || sessionDraft.email || "",
  );
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(Boolean(rememberedEmail));
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationNotice, setVerificationNotice] = useState(false);
  const [warning, setWarning] = useState("");

  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  // Persist only non-sensitive login draft in session
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
  }, [email]);

  // Remember email preference
  useEffect(() => {
    const trimmedEmail = email.trim();
    if (rememberMe && trimmedEmail) {
      localStorage.setItem(REMEMBER_KEY, trimmedEmail);
    } else if (!rememberMe) {
      localStorage.removeItem(REMEMBER_KEY);
    }
  }, [rememberMe, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setVerificationNotice(false);
    setEmailError(undefined);
    setPasswordError(undefined);

    const emailVal = validateEmail(email, true);
    let hasError = false;

    if (!emailVal.isValid) {
      setEmailError(emailVal.error);
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    }

    if (hasError) {
      setError("Please enter your email and password to proceed.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
      setLoading(true);

      const res = await login({
        email: normalizedEmail,
        password,
        portal: "user",
      });

      if (res.success === true) {
        const user = res?.data;
        if (!res?.accessToken || !user) {
          throw new Error("Invalid login response from server.");
        }

        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        setPassword("");
        if (user?.schoolId !== null && user?.schoolId !== undefined) {
          if (user?.role === "TEACHER") {
            navigate("/teacher-dashboard");
          } else if (user?.role === "STUDENT") {
            navigate("/student-dashboard");
          }
        } else {
          navigate("/select-school");
        }
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "";

      const normalizedMessage = message.toLowerCase();
      const isVerificationError =
        normalizedMessage.includes("not verified") ||
        normalizedMessage.includes("verify your email") ||
        normalizedMessage.includes("email verification") ||
        normalizedMessage.includes("email is not verified");

      setTimeout(() => {
        if (isVerificationError) {
          sessionStorage.setItem("sms_verify_email", normalizedEmail);
          navigate("/send-otp", {
            state: { email: normalizedEmail },
          });
        }
      }, 1000);
      setWarning(
        isVerificationError
          ? "Your account email requires verification. Redirecting you..."
          : "",
      );
      setError(
        message ||
          "Invalid credentials. Please check your details and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand Logo & Heading */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="h-7 w-7" />
          </div>

          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome to SMS Portal
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Sign in to access your student or faculty account
          </p>
        </div>

        {/* Main Card */}
        <div className="mt-8 bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          {/* Error Message */}
          {error && !verificationNotice && (
            <div className="mb-6">
              <Alert
                variant="danger"
                title="Authentication Error"
                message={error}
              />
            </div>
          )}
          {/* Warning Message */}
          {warning && (
            <div className="mb-6">
              <Alert variant="warning" title="Notice" message={warning} />
            </div>
          )}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email Field */}
            <Input
              id="login-email"
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(undefined);
                if (error) setError("");
                if (verificationNotice) setVerificationNotice(false);
              }}
              placeholder="you@school.edu"
              autoComplete="email"
              required
              leftIcon={<Mail className="h-4 w-4" />}
              error={emailError}
            />

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Password
                </label>
              </div>

              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(undefined);
                  if (error) setError("");
                }}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                leftIcon={<Lock className="h-4 w-4" />}
                error={passwordError}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-600">
                  Remember me
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="w-full"
            >
              Sign In to Portal
            </Button>
          </form>

          {/* Footer link to signup */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{" "}
              <Link
                to="/signup"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Subfooter */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Protected educational portal • Student Management System
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
