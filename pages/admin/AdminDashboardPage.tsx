
import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { QuestionContext } from '../../context/QuestionContext';
import { CourseContext } from '../../context/CourseContext';
import { UsersIcon, QuestionIcon, AcademicCapIcon, CheckCircleIcon, ChartBarIcon } from '../../components/Icon';

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; color: string; gradient: string; }> = ({ icon, title, value, color, gradient }) => (
    <div className={`relative overflow-hidden bg-white p-6 rounded-xl shadow-lg flex items-center transition-transform duration-300 hover:-translate-y-1`}>
         <div className={`absolute -top-4 -right-4 w-20 h-20 opacity-10 ${color}`}>{icon}</div>
        <div className={`mr-4 p-4 rounded-full text-white ${gradient}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-dark-700 font-medium">{title}</p>
            <p className="text-3xl font-bold text-dark">{value}</p>
        </div>
    </div>
);

const ScoreDistributionChart: React.FC<{ results: any[] }> = ({ results }) => {
    const distribution = useMemo(() => {
        const buckets = { '0-25%': 0, '26-50%': 0, '51-75%': 0, '76-100%': 0 };
        results.forEach(result => {
            const percentage = (result.score / result.totalQuestions) * 100;
            if (percentage <= 25) buckets['0-25%']++;
            else if (percentage <= 50) buckets['26-50%']++;
            else if (percentage <= 75) buckets['51-75%']++;
            else buckets['76-100%']++;
        });
        const total = results.length || 1;
        return Object.entries(buckets).map(([range, count]) => ({
            range,
            count,
            percentage: (count / total) * 100,
        }));
    }, [results]);

    const barColors = ['bg-red-500', 'bg-amber-500', 'bg-sky-500', 'bg-green-500'];

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-dark mb-1 flex items-center"><ChartBarIcon className="h-6 w-6 mr-2 text-primary" /> Test Score Distribution</h2>
            <p className="text-sm text-dark-700 mb-6">Performance of all students who have taken a test.</p>
            <div className="flex items-end justify-around h-48 space-x-4">
                {distribution.map((bucket, index) => (
                    <div key={bucket.range} className="flex flex-col items-center flex-1 h-full">
                         <div className="text-center mb-1">
                            <p className="font-bold text-dark text-lg">{bucket.count}</p>
                            <p className="text-xs text-dark-700">students</p>
                        </div>
                        <div className={`w-full ${barColors[index]} rounded-t-md transition-all duration-500`} style={{ height: `${bucket.percentage}%` }} title={`${bucket.count} students`}></div>
                        <p className="text-xs font-semibold text-dark-700 mt-2">{bucket.range}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


const AdminDashboardPage: React.FC = () => {
    const { registeredUsers, testResults } = useContext(AuthContext);
    const { questions } = useContext(QuestionContext);
    const { courses } = useContext(CourseContext);
    
    const totalQuestions = Object.values(questions).reduce((sum, qArray) => sum + qArray.length, 0);
    const students = registeredUsers.filter(u => u.role === 'student');

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon={<UsersIcon className="h-8 w-8"/>} 
                    title="Total Students" 
                    value={students.length} 
                    color="text-blue-500"
                    gradient="bg-gradient-to-br from-blue-400 to-blue-600"
                />
                <StatCard 
                    icon={<AcademicCapIcon className="h-8 w-8"/>} 
                    title="Total Courses" 
                    value={courses.length} 
                    color="text-amber-500"
                    gradient="bg-gradient-to-br from-amber-400 to-amber-600"
                />
                 <StatCard 
                    icon={<QuestionIcon className="h-8 w-8"/>} 
                    title="Total Questions" 
                    value={totalQuestions}
                    color="text-sky-500"
                    gradient="bg-gradient-to-br from-sky-400 to-sky-600"
                />
                <StatCard 
                    icon={<CheckCircleIcon className="h-8 w-8"/>} 
                    title="Tests Taken" 
                    value={testResults.length}
                    color="text-green-500"
                    gradient="bg-gradient-to-br from-green-400 to-green-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-10">
                <div className="lg:col-span-3">
                    <ScoreDistributionChart results={testResults} />
                </div>
                 <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-bold text-dark mb-4">Recent Test Results</h2>
                        {testResults.length > 0 ? (
                           <ul className="space-y-4">
                                {[...testResults].reverse().slice(0, 5).map((result, index) => {
                                     const user = registeredUsers.find(u => u.email === result.userEmail);
                                     return (
                                        <li key={index} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-dark">{user?.name || result.userEmail}</p>
                                                <p className="text-sm text-dark-700">{result.course}</p>
                                            </div>
                                            <Link to={`/admin/test-result/${testResults.indexOf(result)}`} className="text-right">
                                                <p className="font-bold text-primary">{result.score}/{result.totalQuestions}</p>
                                                <p className="text-xs text-green-600 font-semibold">{result.discount}% discount</p>
                                            </Link>
                                        </li>
                                     )
                                })}
                            </ul>
                        ) : (
                            <p className="text-dark-700 text-sm">No test results recorded yet.</p>
                        )}
                    </div>
                     <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-bold text-dark mb-4">Newest Students</h2>
                        {students.length > 0 ? (
                             <ul className="space-y-4">
                                {students.slice(-5).reverse().map((student) => (
                                    <li key={student.email} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-dark">{student.name}</p>
                                            <p className="text-sm text-dark-700">{student.email}</p>
                                        </div>
                                        <p className="text-xs text-dark-700">{new Date(student.registrationDate).toLocaleDateString()}</p>
                                    </li>
                                ))}
                             </ul>
                        ) : (
                            <p className="text-dark-700 text-sm">No students have registered yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;