import { CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PasswordSetSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-green-600" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-gray-900">
            Password Set Successfully
          </h1>

          <p className="text-sm text-gray-500 mt-3 leading-6">
            Your teacher account password has been created
            successfully. You can now log in to your account.
          </p>

          {/* Login Button */}
          <button
            onClick={() => navigate("/login")}
            className="mt-8 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            Go to Login
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordSetSuccessPage;

