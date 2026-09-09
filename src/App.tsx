import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import SchoolSelector from './pages/auth/SchoolSelector';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherProfile from './pages/teacher/TeacherProfile';


// ─── Protected Route Guard (Requires Login + Connected School) ────
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const school = localStorage.getItem('sms_selected_school');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  if (!school) {
    return <Navigate to="/select-school" replace />;
  }
  return <>{element}</>;
};

// ─── School Selector Guard (Requires Login, allows picking/switching school) ────
const SchoolSelectorGuard = () => {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  return <SchoolSelector />;
};

// ─── Public Auth Guard (Redirects away from login/signup if already fully connected) ────
const LoginRoute = () => {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const school = localStorage.getItem('sms_selected_school');

  if (token && user) {
    if (!school) return <Navigate to="/select-school" replace />;
    return <Navigate to={user?.role === 'TEACHER' ? "/teacher-dashboard" : "/student-dashboard"} replace />;
  }
  return <LoginPage />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Post-login school selection */}
        <Route path="/select-school" element={<SchoolSelectorGuard />} />

        {/* Protected portal routes (Requires authenticated user with connected school) */}
        <Route path="/student-dashboard" element={<ProtectedRoute element={<StudentDashboard />} />} />
        <Route path="/student-profile" element={<ProtectedRoute element={<StudentProfile />} />} />
        <Route path="/teacher-dashboard" element={<ProtectedRoute element={<TeacherDashboard />} />} />
        <Route path="/teacher-profile" element={<ProtectedRoute element={<TeacherProfile />} />} />

        {/* Default fallback: Go to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;