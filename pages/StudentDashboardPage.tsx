
import React, { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { QuestionContext } from '../context/QuestionContext';
import { CourseContext } from '../context/CourseContext';
import { UserIcon, MailIcon, PhoneIcon, AcademicCapIcon, CalendarIcon, CheckCircleIcon, TrophyIcon, SparklesIcon } from '../components/Icon';
import Spinner from '../components/Spinner';
import { getStudyTips } from '../services/geminiService';
import { TestQuestion } from '../types';

const StudentDashboardPage: React.FC = () => {
    const { user, isLoggedIn, testResults } = useContext(AuthContext);
    const { questions: allQuestions } = useContext(QuestionContext);
    const { getCourseKey } = useContext(CourseContext);

    const [studyTips, setStudyTips] = useState('');
    const [isGeneratingTips, setIsGeneratingTips] = useState(false);
    const [tipsError, setTipsError] = useState('');

    if (!isLoggedIn || !user || user.role === 'admin') {
        return <Navigate to="/login" replace />;
    }

    const userTestResult = testResults.find(r => r.userEmail === user.email && r.course === user.course);

    const handleGenerateTips = async () => {
        if (!userTestResult || !user) return;
        setIsGeneratingTips(true);
        setStudyTips('');
        setTipsError('');

        try {
            const courseKey = getCourseKey(user.course);
            const questionsForCourse = allQuestions[courseKey];
            if (!questionsForCourse) {
                throw new Error("Could not find questions for this course to generate tips.");
            }

            const wrongAnswers = questionsForCourse.reduce((acc: { question: string; studentAnswer: string; correctAnswer: string }[], q: TestQuestion, index: number) => {
                const studentAnswerIndex = userTestResult.selectedAnswers[index];
                if (studentAnswerIndex !== q.correctAnswerIndex) {
                    acc.push({
                        question: q.question,
                        studentAnswer: studentAnswerIndex !== null ? q.options[studentAnswerIndex] : "Not Answered",
                        correctAnswer: q.options[q.correctAnswerIndex]
                    });
                }
                return acc;
            }, []);

            if (wrongAnswers.length === 0) {
                 setStudyTips("Great job! You answered all questions correctly. Keep reviewing the course material to stay sharp!");
            } else {
                const tips = await getStudyTips(user.course, wrongAnswers);
                setStudyTips(tips);
            }
        } catch (err) {
            setTipsError('Sorry, could not generate study tips at this moment. Please try again later.');
            console.error(err);
        } finally {
            setIsGeneratingTips(false);
        }
    };

    const InfoCard: React.FC<{ icon: React.ReactNode, label: string, value: React.ReactNode }> = ({ icon, label, value }) => (
        <div className="flex items-start">
            <div className="flex-shrink-0 text-primary">{icon}</div>
            <div className="ml-4 min-w-0">
                <dt className="text-sm font-medium text-dark-700">{label}</dt>
                <dd className="mt-1 text-md font-semibold text-dark break-words">{value}</dd>
            </div>
        </div>
    );
    
    const AIStudyAdvisor = () => (
         <div className="bg-light-100 p-8 rounded-lg shadow-xl mt-8">
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
                <SparklesIcon className="h-6 w-6 mr-2" />
                AI Study Advisor
            </h2>
            {isGeneratingTips ? (
                <div className="flex flex-col items-center justify-center min-h-[100px]">
                    <Spinner />
                    <p className="mt-2 text-dark-700">Generating your personalized tips...</p>
                </div>
            ) : tipsError ? (
                 <p className="text-red-600">{tipsError}</p>
            ) : studyTips ? (
                 <div className="prose prose-sm max-w-none text-dark" dangerouslySetInnerHTML={{ __html: studyTips.replace(/\n/g, '<br />') }}></div>
            ) : (
                <>
                    <p className="text-dark-700 mb-4">Get personalized study tips based on your test results to help you focus on areas for improvement.</p>
                    <button 
                        onClick={handleGenerateTips}
                        className="inline-flex items-center bg-secondary text-dark font-bold py-2 px-6 rounded-md hover:opacity-90 transition-transform hover:scale-105"
                    >
                        Generate My Study Tips
                    </button>
                </>
            )}
         </div>
    );

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-extrabold text-dark mb-2">Welcome, {user.name}!</h1>
                <p className="text-lg text-dark-700 mb-8">This is your personal dashboard. Here you can track your progress and test results.</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Test Results & AI Tips */}
                    <div className="lg:col-span-2">
                       <div className="bg-light-100 p-8 rounded-lg shadow-xl">
                            <h2 className="text-2xl font-bold text-primary mb-6">Assessment Status</h2>
                            {userTestResult ? (
                                <div>
                                    <h3 className="text-xl font-bold text-dark mb-4">Your Test Result for <span className="text-primary">{user.course}</span></h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                        <div className="bg-white p-4 rounded-lg shadow-md">
                                            <p className="text-sm text-dark-700">Score</p>
                                            <p className="text-4xl font-bold text-primary mt-1">{userTestResult.score}/{userTestResult.totalQuestions}</p>
                                        </div>
                                         <div className="bg-white p-4 rounded-lg shadow-md">
                                            <p className="text-sm text-dark-700">Date Taken</p>
                                            <p className="text-xl font-bold text-dark mt-2">{new Date(userTestResult.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="bg-green-100 p-4 rounded-lg shadow-md border-t-4 border-green-500">
                                            <p className="text-sm text-green-800 flex items-center justify-center"><TrophyIcon className="h-5 w-5 mr-2"/>Discount Earned</p>
                                            <p className="text-4xl font-bold text-green-600 mt-1">{userTestResult.discount}%</p>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center bg-blue-50 p-4 rounded-lg gap-4">
                                        <p className="text-center sm:text-left text-blue-800">Our team will contact you soon with your discount code.</p>
                                        <Link to="/dashboard/test-result" className="font-bold text-sm bg-blue-200 text-blue-800 py-2 px-4 rounded-full hover:bg-blue-300 transition-colors shrink-0">
                                            View Detailed Report
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center bg-white p-8 rounded-lg border-2 border-dashed border-neutral-300">
                                    <CheckCircleIcon className="h-16 w-16 text-neutral-400 mx-auto mb-4"/>
                                    <h3 className="text-xl font-bold text-dark">You haven't taken the test yet.</h3>
                                    <p className="text-dark-700 my-4">Take our skills assessment to find out what discount you can earn on your course fees.</p>
                                    <Link to="/discount-test" className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-primary-dark transition-transform hover:scale-105">
                                        Take the Test Now
                                    </Link>
                                </div>
                            )}
                        </div>
                        {userTestResult && <AIStudyAdvisor />}
                    </div>

                    {/* Right Column: User Details */}
                    <div className="bg-light-100 p-8 rounded-lg shadow-xl self-start">
                        <h2 className="text-2xl font-bold text-primary mb-6">Your Profile</h2>
                        <dl className="space-y-6">
                            <InfoCard icon={<UserIcon className="h-6 w-6"/>} label="Full Name" value={user.name} />
                            <InfoCard icon={<MailIcon className="h-6 w-6"/>} label="Email Address" value={user.email} />
                            <InfoCard icon={<PhoneIcon className="h-6 w-6"/>} label="Phone Number" value={user.phone} />
                            <InfoCard icon={<AcademicCapIcon className="h-6 w-6"/>} label="Selected Course" value={user.course} />
                            <InfoCard icon={<CalendarIcon className="h-6 w-6"/>} label="Registration Date" value={new Date(user.registrationDate).toLocaleDateString()} />
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboardPage;
