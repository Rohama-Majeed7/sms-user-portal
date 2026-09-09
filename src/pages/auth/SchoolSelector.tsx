import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Loader2,
  School,
  ShieldCheck,
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

interface LocationState {
  from?: 'login' | 'signup';
}

const SchoolSelector: React.FC = () => {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as LocationState | null;

  const from: 'login' | 'signup' =
    locationState?.from === 'login' ? 'login' : 'signup';

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
          const firstSchoolId = String(
            data[0].id ?? data[0]._id ?? 0
          );

          setSelectedSchoolId(firstSchoolId);
        }
      } catch (err) {
        console.error('Error fetching school list:', err);

        setError(
          'Unable to fetch the school list. Please ensure the backend server is running.'
        );
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

    localStorage.setItem(
      'sms_selected_school',
      JSON.stringify(selectedSchool)
    );

    navigate(from === 'login' ? '/login' : '/signup');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.18),transparent_38%),linear-gradient(180deg,#0f172a_0%,#020617_100%)]" />

      {/* Decorative glow */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-600/15 blur-[120px] sm:h-[520px] sm:w-[520px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-violet-600/10 blur-[130px] sm:h-[560px] sm:w-[560px]" />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }}
      />

      {/* Main content */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 shadow-lg shadow-indigo-950/30">
              <School className="h-7 w-7 text-indigo-400" />
            </div>

            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-400">
              Student Management System
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Choose your school
            </h1>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
              Select your school to continue to your portal account.
            </p>
          </div>

          {/* Card */}
          <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/80 shadow-2xl shadow-black/30 backdrop-blur-2xl">
            {/* Card top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />

            <div className="p-5 sm:p-7">
              {/* Card header */}
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800/80">
                  <Building2 className="h-5 w-5 text-slate-300" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    School Selection
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Choose an available institution
                  </p>
                </div>
              </div>

              {/* Loading */}
              {loading ? (
                <div className="flex min-h-[190px] flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/60">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
                  </div>

                  <p className="text-sm font-medium text-slate-300">
                    Loading schools
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Please wait a moment...
                  </p>
                </div>
              ) : error ? (
                /* Error */
                <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-5 text-center">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10">
                    <ShieldCheck className="h-5 w-5 text-red-400" />
                  </div>

                  <p className="text-sm font-medium text-red-300">
                    Unable to load schools
                  </p>

                  <p className="mt-2 text-xs leading-5 text-red-400/80">
                    {error}
                  </p>
                </div>
              ) : schools.length === 0 ? (
                /* Empty */
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-7 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
                    <School className="h-5 w-5 text-slate-500" />
                  </div>

                  <p className="text-sm font-medium text-slate-300">
                    No schools available
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    There are currently no schools available for selection.
                  </p>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="school"
                      className="mb-2.5 flex items-center justify-between"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Select School
                      </span>

                      <span className="text-[10px] font-medium text-slate-600">
                        {schools.length}{' '}
                        {schools.length === 1 ? 'school' : 'schools'}
                      </span>
                    </label>

                    <div className="relative">
                      <select
                        id="school"
                        value={selectedSchoolId}
                        onChange={(e) =>
                          setSelectedSchoolId(e.target.value)
                        }
                        className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3.5 pr-11 text-sm font-medium text-slate-100 outline-none transition-all duration-200 hover:border-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      >
                        {schools.map((school, index) => {
                          const schoolId = getSchoolId(school, index);
                          const schoolName = getSchoolName(school, index);

                          return (
                            <option
                              key={schoolId}
                              value={schoolId}
                              className="bg-slate-900 text-slate-100"
                            >
                              {schoolName}
                            </option>
                          );
                        })}
                      </select>

                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                        <svg
                          className="h-4 w-4 text-slate-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Selected school indicator */}
                    <div className="mt-3 flex items-center gap-2 px-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />

                      <span className="text-[11px] text-slate-500">
                        Your selection will be saved for this session.
                      </span>
                    </div>
                  </div>

                  {/* Continue */}
                  <button
                    type="submit"
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition-all duration-200 hover:-translate-y-0.5 hover:from-indigo-500 hover:via-indigo-500 hover:to-violet-500 hover:shadow-xl hover:shadow-indigo-900/40 active:translate-y-0 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                  >
                    Continue to{' '}
                    {from === 'login' ? 'Sign In' : 'Sign Up'}

                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </form>
              )}
            </div>

            {/* Footer */}
            {!loading && !error && schools.length > 0 && (
              <div className="border-t border-white/[0.06] bg-slate-950/30 px-5 py-4 sm:px-7">
                <div className="flex items-center justify-center gap-2 text-center">
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />

                  <p className="text-[11px] text-slate-600">
                    Your school selection is securely stored locally.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom text */}
          <p className="mt-6 text-center text-[11px] text-slate-600">
            Select the institution associated with your account.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SchoolSelector;