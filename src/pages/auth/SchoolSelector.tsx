import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Loader2,
  School,
  ShieldCheck,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { schoolList } from '../../apis/auth/auth.service';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';

interface SchoolData {
  id?: string | number;
  _id?: string;
  name?: string;
  schoolName?: string;
  username?: string;
  email?: string;
  role?: string;
}

export const SchoolSelector: React.FC = () => {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [connecting, setConnecting] = useState<boolean>(false);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('accessToken');
  const isTeacher = user?.role === 'TEACHER';

  // Guard: redirect to login if not authenticated
  useEffect(() => {
    if (!token || !user) {
      navigate('/login', { replace: true });
    }
  }, [token, user, navigate]);

  useEffect(() => {
    const getSchools = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await schoolList();
        const data: SchoolData[] = Array.isArray(response)
          ? response.filter((school: SchoolData) => school.role === 'ADMIN')
          : [];

        setSchools(data);

        if (data.length > 0) {
          const savedSchool = localStorage.getItem('sms_selected_school');
          let defaultId = String(data[0].id ?? data[0]._id ?? 0);

          if (savedSchool) {
            try {
              const parsed = JSON.parse(savedSchool);
              const matching = data.find(
                (s, idx) => String(s.id ?? s._id ?? idx) === String(parsed.id ?? parsed._id)
              );
              if (matching) {
                defaultId = String(matching.id ?? matching._id ?? 0);
              }
            } catch {
              // Ignore parse error
            }
          }

          setSelectedSchoolId(defaultId);
        }
      } catch (err) {
        console.error('Error fetching school list:', err);
        setError('Unable to fetch the institution list. Please ensure the backend is available.');
      } finally {
        setLoading(false);
      }
    };

    getSchools();
  }, []);

  const getSchoolId = (school: SchoolData, index: number) =>
    String(school.id ?? school._id ?? index);

  const getSchoolName = (school: SchoolData, index: number) =>
    school.name ||
    school.schoolName ||
    school.username ||
    school.email ||
    `School #${index + 1}`;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const selectedSchool =
      schools.find(
        (school, index) => getSchoolId(school, index) === String(selectedSchoolId)
      ) || schools[0];

    if (!selectedSchool) return;

    setConnecting(true);
    localStorage.setItem('sms_selected_school', JSON.stringify(selectedSchool));

    setTimeout(() => {
      if (user?.role === 'TEACHER') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    }, 250);
  };

  const handleSignOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('sms_selected_school');
    navigate('/login');
  };

  const userName = user?.name || 'Account';
  const initials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* User Card & Greeting */}
        <div className="text-center">
          <div className="relative mx-auto inline-block mb-3">
            <div
              className={`h-16 w-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-md ${
                isTeacher
                  ? 'bg-emerald-600 shadow-emerald-500/20'
                  : 'bg-indigo-600 shadow-indigo-500/20'
              }`}
            >
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-xs">
              <Sparkles
                className={`h-3.5 w-3.5 ${
                  isTeacher ? 'text-emerald-600' : 'text-indigo-600'
                }`}
              />
            </div>
          </div>

          <div className="flex justify-center mb-2">
            <Badge variant={isTeacher ? 'teacher' : 'student'} dot>
              {userName} • {isTeacher ? 'Faculty' : 'Student'}
            </Badge>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Connect to Institution
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Choose the school institution you wish to connect with for this session
          </p>
        </div>

        {/* Main Card */}
        <div className="mt-8 bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          {/* Card Subheading */}
          <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-100">
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                isTeacher
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-indigo-50 text-indigo-600'
              }`}
            >
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Registered Institutions
              </h3>
              <p className="text-xs text-slate-500">
                Authorized education providers in SMS
              </p>
            </div>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="py-10 text-center space-y-3">
              <Loader2
                className={`h-8 w-8 animate-spin mx-auto ${
                  isTeacher ? 'text-emerald-600' : 'text-indigo-600'
                }`}
              />
              <p className="text-xs font-semibold text-slate-600">
                Loading educational institutions...
              </p>
            </div>
          ) : error ? (
            /* Error state */
            <div className="space-y-4">
              <Alert variant="danger" title="Connection Error" message={error} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Retry
              </Button>
            </div>
          ) : schools.length === 0 ? (
            /* Empty state */
            <div className="py-8 text-center space-y-2">
              <School className="h-10 w-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">No schools available</h4>
              <p className="text-xs text-slate-500">
                Please contact your institution administrator for access.
              </p>
            </div>
          ) : (
            /* Selection form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <Select
                id="school"
                label="Select School Institution"
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                leftIcon={<Building2 className="h-4 w-4" />}
                helperText={`${schools.length} registered ${
                  schools.length === 1 ? 'school' : 'schools'
                } available`}
              >
                {schools.map((school, index) => {
                  const schoolId = getSchoolId(school, index);
                  const schoolName = getSchoolName(school, index);

                  return (
                    <option key={schoolId} value={schoolId}>
                      {schoolName}
                    </option>
                  );
                })}
              </Select>

              <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                <CheckCircle2
                  className={`h-4 w-4 shrink-0 mt-0.5 ${
                    isTeacher ? 'text-emerald-600' : 'text-indigo-600'
                  }`}
                />
                <span>
                  Connecting will configure your role-specific timetable, gradebook, and course material.
                </span>
              </div>

              <Button
                type="submit"
                variant={isTeacher ? 'success' : 'primary'}
                size="lg"
                loading={connecting}
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="w-full"
              >
                Connect &amp; Open Portal
              </Button>
            </form>
          )}

          {/* Footer with sign out */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Verified Session</span>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="font-semibold text-slate-500 hover:text-red-600 transition flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Subfooter */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Student Management System • Secure Institution Connection
        </p>
      </div>
    </div>
  );
};

export default SchoolSelector;