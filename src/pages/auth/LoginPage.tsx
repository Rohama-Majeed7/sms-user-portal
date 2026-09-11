import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { login } from '../../apis/auth/auth.service';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';

const SESSION_KEY = 'sms_login_draft';
const REMEMBER_KEY = 'sms_remember_email';
const VERIFIED_KEY = 'isVerified';

interface LoginDraft {
  email?: string;
}

interface LoginUser {
  role?: string;
  email?: string;
  isVerified?: boolean;
  [key: string]: unknown;
}

interface LoginResponse {
  accessToken: string;
  user: LoginUser;
}

const getSessionDraft = (): LoginDraft => {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const getStoredVerificationStatus = (): boolean | null => {
  try {
    const saved = localStorage.getItem(VERIFIED_KEY);
    if (saved === null) return null;
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const sessionDraft = useMemo(() => getSessionDraft(), []);
  const rememberedEmail = localStorage.getItem(REMEMBER_KEY);

  const [email, setEmail] = useState(
    rememberedEmail || sessionDraft.email || ''
  );
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(Boolean(rememberedEmail));
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationNotice, setVerificationNotice] = useState(false);

  // Persist only non-sensitive login draft in session
  useEffect(() => {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ email })
    );
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

  const redirectToVerification = () => {
    localStorage.setItem(VERIFIED_KEY, 'false');
    setVerificationNotice(true);
    window.setTimeout(() => {
      navigate('/verify-email', {
        state: { email: email.trim() },
      });
    }, 1200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setVerificationNotice(false);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    const storedVerificationStatus = getStoredVerificationStatus();
    if (storedVerificationStatus !== null && !storedVerificationStatus) {
      redirectToVerification();
      return;
    }

    try {
      setLoading(true);

      const res: LoginResponse = await login({
        email: normalizedEmail,
        password,
        portal: 'user',
      });

      const user = res?.user;
      if (!res?.accessToken || !user) {
        throw new Error('Invalid login response from server.');
      }

      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      if (typeof user.isVerified === 'boolean') {
        localStorage.setItem(VERIFIED_KEY, String(user.isVerified));
      }

      setPassword('');
      sessionStorage.removeItem(SESSION_KEY);

      navigate('/select-school');
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        '';

      const normalizedMessage = message.toLowerCase();
      const isVerificationError =
        normalizedMessage.includes('not verified') ||
        normalizedMessage.includes('verify your email') ||
        normalizedMessage.includes('email verification') ||
        normalizedMessage.includes('email is not verified');

      if (isVerificationError) {
        redirectToVerification();
        return;
      }

      setError(
        message || 'Invalid credentials. Please check your details and try again.'
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
          {/* Verification Notice */}
          {verificationNotice && (
            <div className="mb-6">
              <Alert
                variant="warning"
                title="Verification Required"
                message="Your account email requires verification. Redirecting you..."
              />
            </div>
          )}

          {/* Error Message */}
          {error && !verificationNotice && (
            <div className="mb-6">
              <Alert variant="danger" title="Authentication Error" message={error} />
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
                if (error) setError('');
                if (verificationNotice) setVerificationNotice(false);
              }}
              placeholder="you@school.edu"
              autoComplete="email"
              required
              leftIcon={<Mail className="h-4 w-4" />}
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

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Forgot password?
                </Link>
              </div>

              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                leftIcon={<Lock className="h-4 w-4" />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                <span className="text-xs font-medium text-slate-600">Remember my email</span>
              </label>

              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>SSL Encrypted</span>
              </div>
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
              Don't have an account yet?{' '}
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
