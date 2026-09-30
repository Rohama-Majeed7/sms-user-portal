import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  School,
  ShieldCheck,
  User,
} from 'lucide-react';
import type { UserRole } from '../../types/role';
import { signUp } from '../../apis/auth/auth.service';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { PasswordRequirements } from '../../components/ui/PasswordRequirements';
import {
  validateName,
  validatePassword,
  validateConfirmPassword,
  validateEmail,
} from '../../utils/validation';

const SESSION_KEY = 'sms_signup_draft';

interface SignupDraft {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  selectedRole?: UserRole;
}

const getDraft = (): SignupDraft => {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

export const SignupPage: React.FC = () => {
  const draft = useMemo(() => getDraft(), []);

  const [fullName, setFullName] = useState(draft.fullName || '');
  const [email, setEmail] = useState(draft.email || '');
  const [password, setPassword] = useState(draft.password || '');
  const [confirmPassword, setConfirmPassword] = useState(
    draft.confirmPassword || ''
  );
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    draft.selectedRole || 'STUDENT'
  );
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const navigate = useNavigate();

  // Persist signup draft in session storage
  useEffect(() => {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        fullName,
        email,
        password,
        confirmPassword,
        selectedRole,
      })
    );
  }, [fullName, email, password, confirmPassword, selectedRole]);

  const isTeacher = selectedRole === 'TEACHER';
  const passwordResult = useMemo(() => validatePassword(password, false), [password]);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
  };

  const handleFieldChange = (field: keyof typeof fieldErrors, value: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (error) setError('');

    switch (field) {
      case 'fullName':
        setFullName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        if (fieldErrors.confirmPassword) {
          setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        }
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Comprehensive frontend validation
    const nameVal = validateName(fullName, true, 'Full Name');
    const emailVal = validateEmail(email, true);
    const passwordVal = validatePassword(password, true);
    const confirmVal = validateConfirmPassword(password, confirmPassword);

    const newErrors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};

    if (!nameVal.isValid) {
      newErrors.fullName = nameVal.error;
    }
    if (!emailVal.isValid) {
      newErrors.email = emailVal.error;
    }
    if (!passwordVal.isValid) {
      newErrors.password = passwordVal.error;
    }
    if (!confirmVal.isValid) {
      newErrors.confirmPassword = confirmVal.error;
    }
    if (!termsAccepted) {
      newErrors.terms = 'You must agree to the Terms of Service and Privacy Policy.';
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setError('Please resolve all validation errors before proceeding.');
      return;
    }

    try {
      setLoading(true);

      const res = await signUp({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: selectedRole,
      });
      sessionStorage.removeItem(SESSION_KEY);
      if (res?.data?.isVerified) {
        navigate('/login');
      } else {
        const userEmail = res?.data?.user?.email || email.trim().toLowerCase();
        sessionStorage.setItem('sms_verify_email', userEmail);
        navigate('/send-otp', {
          state: {
            email: userEmail,
            role: selectedRole,
          },
        });
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl px-4">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="h-7 w-7" />
          </div>

          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Create your portal account
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Register as a student or faculty member to access your institution
          </p>
        </div>

        {/* Main Card */}
        <div className="mt-8 bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          {/* Role selector pill */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Select Account Type
            </label>

            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-slate-100 border border-slate-200/60">
              <button
                type="button"
                onClick={() => handleRoleChange('STUDENT')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  selectedRole === 'STUDENT'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="h-4 w-4 text-indigo-600" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('TEACHER')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  selectedRole === 'TEACHER'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <School className="h-4 w-4 text-emerald-600" />
                <span>Faculty / Teacher</span>
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6">
              <Alert variant="danger" title="Registration Error" message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* 2-column Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="fullName"
                label="Full Name"
                type="text"
                value={fullName}
                onChange={(e) => handleFieldChange('fullName', e.target.value)}
                placeholder="e.g. Jane Doe"
                required
                autoComplete="name"
                leftIcon={<User className="h-4 w-4" />}
                error={fieldErrors.fullName}
              />

              <Input
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder={isTeacher ? 'teacher@school.edu' : 'student@school.edu'}
                required
                autoComplete="email"
                leftIcon={<Mail className="h-4 w-4" />}
                error={fieldErrors.email}
              />
            </div>

            {/* 2-column Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div>
                <Input
                  id="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  autoComplete="new-password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  error={fieldErrors.password}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
              </div>

              <div>
                <Input
                  id="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                  placeholder="Repeat password"
                  required
                  autoComplete="new-password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  error={fieldErrors.confirmPassword}
                  rightElement={
                    <div className="flex items-center gap-1">
                      {confirmPassword.length > 0 && (
                        passwordsMatch ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <span className="text-xs font-bold text-red-500">!</span>
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  }
                />
              </div>
            </div>

            {/* Live Password Requirements checklist */}
            <PasswordRequirements rules={passwordResult.rules} value={password} />

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 leading-relaxed">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (fieldErrors.terms) {
                      setFieldErrors((prev) => ({ ...prev, terms: undefined }));
                    }
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span>
                  I agree to the{' '}
                  <a href="#terms" onClick={(e) => e.preventDefault()} className="font-semibold text-indigo-600 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#privacy" onClick={(e) => e.preventDefault()} className="font-semibold text-indigo-600 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
              {fieldErrors.terms && (
                <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant={isTeacher ? 'success' : 'primary'}
              size="lg"
              loading={loading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="w-full mt-2"
            >
              Create {isTeacher ? 'Faculty' : 'Student'} Account
            </Button>
          </form>

          {/* Footer link to sign in */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Sign In to Portal
              </Link>
            </p>
          </div>
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

export default SignupPage;