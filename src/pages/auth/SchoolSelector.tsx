import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { School, ArrowRight, Loader2 } from 'lucide-react';
import { schoolList } from '../../apis/auth/auth.service';

export const SchoolSelector: React.FC = () => {
    const [schools, setSchools] = useState<any[]>([]);
    const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const location = useLocation();
    const from: 'login' | 'signup' = (location.state as any)?.from === 'login' ? 'login' : 'signup';

    useEffect(() => {
        const getSchools = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await schoolList();
                const data = Array.isArray(response) 
                    ? response.filter((school: any) => school.role === 'ADMIN') 
                    : [];
                setSchools(data);
                if (data.length > 0) {
                    setSelectedSchoolId(String(data[0].id || data[0]._id || 0));
                }
            } catch (err: any) {
                console.error('Error fetching school list:', err);
                setError('Unable to fetch school list. Please ensure backend server is running.');
            } finally {
                setLoading(false);
            }
        };
        getSchools();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const school = schools.find((s, idx) => String(s.id || s._id || idx) === String(selectedSchoolId)) || schools[0];
        if (school) {
            localStorage.setItem('sms_selected_school', JSON.stringify(school));
            navigate(from === 'login' ? '/login' : '/signup');
        }
    };

    return (
        <div
            className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center relative overflow-hidden"
            style={{
                background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.22) 0%, rgba(15,23,42,0.98) 65%, #020617 100%)',
                padding: '1.25rem'
            }}
        >
            {/* Background Decorative Glow */}
            <div className="absolute top-[-10%] left-[25%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[25%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />

            {/* Main Auth Card Container */}
            <div
                className="w-full max-w-md sm:max-w-lg bg-slate-900/90 backdrop-blur-2xl border border-indigo-500/20 rounded-3xl shadow-2xl shadow-slate-950 flex flex-col gap-6 z-20 my-auto"
                style={{ padding: '2.25rem 2rem' }}
            >
                {/* Card Header & Icon */}
                <div className="text-center flex flex-col items-center">
                    <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-3 shadow-inner p-3">
                        <School className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Select Your School</h2>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                        Please select your school to access your portal account.
                    </p>
                </div>

                {/* Form / Loading / Empty / Error State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-3 text-slate-400 text-xs sm:text-sm">
                        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                        <span>Loading schools...</span>
                    </div>
                ) : error ? (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm text-center">
                        {error}
                    </div>
                ) : schools.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs sm:text-sm text-center">
                        No schools found.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                SELECT SCHOOL
                            </label>
                            <div className="relative flex items-center">
                                <select
                                    value={selectedSchoolId}
                                    onChange={(e) => setSelectedSchoolId(e.target.value)}
                                    style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '0.85rem', paddingBottom: '0.85rem' }}
                                    className="w-full bg-slate-950/90 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-xs sm:text-sm text-slate-100 outline-none transition-all cursor-pointer"
                                >
                                    {schools.map((school, idx) => {
                                        const schoolId = String(school.id || school._id || idx);
                                        const schoolName = school.name || school.schoolName || school.username || school.email || `School #${idx + 1}`;
                                        return (
                                            <option key={schoolId} value={schoolId} className="bg-slate-900 text-slate-100 py-1">
                                                {schoolName}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem' }}
                            className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                        >
                            Continue to {from === 'login' ? 'Sign In' : 'Sign Up'} <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SchoolSelector;
