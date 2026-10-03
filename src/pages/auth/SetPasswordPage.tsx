import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { setEmailPassword, resendSetPasswordLink } from "../../apis/auth/auth.service";
import { toast } from "react-toastify";

const SetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token: routeToken } = useParams<{ token?: string }>();

  const token = searchParams.get("token") || routeToken;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing password setup link. Please use the link provided in your email.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing password setup link. Please use the link provided in your email.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please enter both passwords.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await setEmailPassword(token, password);
      console.log("Set password response:", res);

      if (res?.success !== false) {
        toast.success(res?.message || "Password set successfully!");
        navigate("/password-set-success");
      } else {
        setError(res?.message || "Unable to set password. Please try again.");
      }
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
        "Unable to set password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  const handleResendToken = async () => {
    try {
      const res = await resendSetPasswordLink(token);
      if (res?.success) {
        toast.success(res?.message);
      }
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
        "Unable to resend password setup link. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
              <LockKeyhole className="w-7 h-7 text-blue-600" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Set Your Password
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Create a password for your teacher account.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-11 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-11 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Setting Password..." : "Set Password"}
            </button>
          </form>
          <div className="mt-6 text-sm">
            If link is expired click on resend link ?{' '}
            <button
              onClick={handleResendToken}
              className="text-blue-600 hover:underline"
            >
              Resend Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPasswordPage;
