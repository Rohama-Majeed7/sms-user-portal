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

interface SchoolData {
  id?: string | number;
  _id?: string;
  name?: string;
  schoolName?: string;
  username?: string;
  email?: string;
  role?: string;
}

const SchoolSelector: React.FC = () => {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [connecting, setConnecting] = useState<boolean>(false);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('accessToken');
  const isTeacher = user?.role === 'TEACHER';

  // Guard: if not authenticated, redirect to login
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
          // If a school was previously selected, default to it
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
        setError('Unable to fetch the school list. Please ensure the backend server is running.');
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
        (school, index) =>
          getSchoolId(school, index) === String(selectedSchoolId)
      ) || schools[0];

    if (!selectedSchool) return;

    setConnecting(true);

    localStorage.setItem('sms_selected_school', JSON.stringify(selectedSchool));

    // Brief smooth transition
    setTimeout(() => {
      if (user?.role === 'TEACHER') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    }, 300);
  };

  const handleSignOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('sms_selected_school');
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100">
      {/* Background radial gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: isTeacher
            ? 'radial-gradient(circle at 50% -10%, rgba(16,185,129,0.18) 0%, rgba(15,23,42,0.95) 45%, #020617 100%)'
            : 'radial-gradient(circle at 50% -10%, rgba(99,102,241,0.20) 0%, rgba(15,23,42,0.95) 45%, #020617 100%)',
        }}
      />

      {/* Decorative ambient glows */}
      <div
        className={`pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full blur-[110px] sm:h-[500px] sm:w-[500px] ${
          isTeacher ? 'bg-emerald-600/15' : 'bg-indigo-600/15'
        }`}
      />
      <div
        className={`pointer-events-none absolute -bottom-40 -right-32 h-80 w-80 rounded-full blur-[120px] sm:h-[550px] sm:w-[550px] ${
          isTeacher ? 'bg-teal-600/10' : 'bg-violet-600/10'
        }`}
      />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Main content */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-lg">
          {/* Top user badge & branding */}
          <div className="mb-6 flex flex-col items-center text-center">
            {/* User Greeting Avatar */}
            <div className="relative mb-3">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl border text-xl font-bold text-white shadow-xl ${
                  isTeacher
                    ? 'border-emerald-500/30 bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-950/40'
                    : 'border-indigo-500/30 bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-indigo-950/40'
                }`}
              >
                {user?.name?.charAt(0) || <School className="h-7 w-7" />}
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-900">
                <Sparkles
                  className={`h-3.5 w-3.5 ${
                    isTeacher ? 'text-emerald-400' : 'text-indigo-400'
                  }`}
                />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-300">
                {user?.name || 'Account'} • {isTeacher ? 'Teacher' : 'Student'}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Connect to Your School
            </h1>

            <p className="mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-slate-400">
              Select the school institution you want to connect with for this session.
            </p>
          </div>

          {/* Card */}
          <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-slate-900/85 shadow-2xl shadow-black/40 backdrop-blur-2xl">
            {/* Top accent */}
            <div
              className={`h-1 w-full bg-gradient-to-r ${
                isTeacher
                  ? 'from-emerald-500 via-teal-500 to-emerald-500'
                  : 'from-indigo-500 via-violet-500 to-indigo-500'
              }`}
            />

            <div className="p-6 sm:p-8">
              {/* Card subheader */}
              <div className="mb-6 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    isTeacher
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                      : 'border-indigo-500/20 bg-indigo-500/10 text-indigo-400'
                  }`}
                >
                  <Building2 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Available Institutions
                  </h2>
                  <p className="text-xs text-slate-400">
                    Choose from registered educational organizations
                  </p>
                </div>
              </div>

              {/* Loading state */}
              {loading ? (
                <div className="flex min-h-[190px] flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-center">
                  <div
                    className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${
                      isTeacher ? 'bg-emerald-500/10' : 'bg-indigo-500/10'
                    }`}
                  >
                    <Loader2
                      className={`h-6 w-6 animate-spin ${
                        isTeacher ? 'text-emerald-400' : 'text-indigo-400'
                      }`}
                    />
                  </div>
                  <p className="text-sm font-medium text-slate-200">
                    Loading institutions
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Fetching the latest school directory...
                  </p>
                </div>
              ) : error ? (
                /* Error state */
                <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.08] p-5 text-center">
                  <p className="text-sm font-semibold text-red-300">
                    Unable to load institutions
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-red-400/90">
                    {error}
                  </p>
                </div>
              ) : schools.length === 0 ? (
                /* Empty state */
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-7 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                    <School className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-300">
                    No schools currently available
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Please contact your system administrator.
                  </p>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="school"
                      className="mb-2.5 flex items-center justify-between"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Select Institution
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">
                        {schools.length} {schools.length === 1 ? 'school' : 'schools'} found
                      </span>
                    </label>

                    <div className="relative">
                      <select
                        id="school"
                        value={selectedSchoolId}
                        onChange={(e) => setSelectedSchoolId(e.target.value)}
                        className={`w-full appearance-none rounded-xl border border-slate-700 bg-slate-950/90 px-4 py-3.5 pr-11 text-sm font-medium text-slate-100 outline-none transition duration-200 hover:border-slate-600 cursor-pointer ${
                          isTeacher
                            ? 'focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15'
                            : 'focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15'
                        }`}
                      >
                        {schools.map((school, index) => {
                          const schoolId = getSchoolId(school, index);
                          const schoolName = getSchoolName(school, index);

                          return (
                            <option
                              key={schoolId}
                              value={schoolId}
                              className="bg-slate-900 text-slate-100 py-1"
                            >
                              {schoolName}
                            </option>
                          );
                        })}
                      </select>

                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                        <svg
                          className="h-4 w-4 text-slate-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 px-1">
                      <CheckCircle2
                        className={`h-3.5 w-3.5 ${
                          isTeacher ? 'text-emerald-400' : 'text-indigo-400'
                        }`}
                      />
                      <span className="text-[11px] text-slate-400">
                        Connecting will load your role-specific dashboard and coursework.
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={connecting}
                    className={`group flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white shadow-xl transition-all duration-200 active:scale-[0.99] cursor-pointer disabled:opacity-60 ${
                      isTeacher
                        ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-950/40'
                        : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-950/40'
                    }`}
                  >
                    {connecting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        Connect & Open Dashboard
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.06] bg-slate-950/40 px-6 py-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-500">
                <ShieldCheck className="h-4 w-4 text-slate-500" />
                <span>Verified session</span>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition cursor-pointer"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SchoolSelector;