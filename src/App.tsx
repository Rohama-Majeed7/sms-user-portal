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


// ─── Protected Route Guard ───────────────────────────────────────
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const school = localStorage.getItem('sms_selected_school');
  const token = localStorage.getItem('accessToken');
  // const isVerified = localStorage.getItem('isVerified');       // 'true' | 'false' | null
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!school) return <Navigate to="/select-school" replace />;
  if (!token || !user) return <Navigate to="/select-school" replace />;
  // if (!isVerified || isVerified !== 'true') return <Navigate to="/verify-email" replace />;
  return <>{element}</>;
};

const App = () => {
  const school = localStorage.getItem('sms_selected_school');
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/select-school" element={!school || !token || !user ? <SchoolSelector /> : <Navigate to={user?.role === 'TEACHER' ? "/teacher-dashboard" : "/student-dashboard"} replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/student-dashboard" element={<ProtectedRoute element={<StudentDashboard />} />} />
        <Route path="/student-profile" element={<ProtectedRoute element={<StudentProfile />} />} />
        <Route path="/teacher-dashboard" element={<ProtectedRoute element={<TeacherDashboard />} />} />
        <Route path="/teacher-profile" element={<ProtectedRoute element={<TeacherProfile />} />} />
        <Route path="*" element={<Navigate to="/select-school" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;