
import React, { useContext } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { QuestionContext } from '../../context/QuestionContext';
import { CourseContext } from '../../context/CourseContext';
import { ArrowLeftIcon, CheckCircleIcon, CloseIcon } from '../../components/Icon';

const AdminTestResultPage: React.FC = () => {
    const { resultIndex } = useParams();
    const { testResults, registeredUsers } = useContext(AuthContext);
    const { questions: allQuestions } = useContext(QuestionContext);
    const { getCourseKey } = useContext(CourseContext);

    if (resultIndex === undefined) {
        return <Navigate to="/admin/users" replace />;
    }

    const index = parseInt(resultIndex, 10);
    const result = testResults[index];

    if (!result) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-600">Error</h1>
                <p className="text-dark-700">Test result not found. It might be invalid or has been removed.</p>
                <Link to="/admin/users" className="mt-4 inline-block text-primary hover:underline">Return to Users List</Link>
            </div>
        );
    }
    
    const user = registeredUsers.find(u => u.email === result.userEmail);
    const courseKey = getCourseKey(result.course);
    const questionsForCourse = allQuestions[courseKey];

    if (!user || !questionsForCourse) {
         return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-600">Error</h1>
                <p className="text-dark-700">Could not load full test details. The associated user or course questions are missing.</p>
                <Link to="/admin/users" className="mt-4 inline-block text-primary hover:underline">Return to Users List</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <Link to="/admin/users" className="flex items-center text-sm font-medium text-primary hover:text-primary-dark mb-4">
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Users List
                </Link>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-dark">Test Results</h1>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                        <div>
                            <p className="text-sm text-dark-700">Student</p>
                            <p className="font-semibold text-dark">{user.name}</p>
                        </div>
                         <div>
                            <p className="text-sm text-dark-700">Course</p>
                            <p className="font-semibold text-dark">{result.course}</p>
                        </div>
                         <div>
                            <p className="text-sm text-dark-700">Final Score</p>
                            <p className="font-bold text-lg text-primary">{result.score} / {result.totalQuestions} ({result.discount}%)</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-dark">Answer Sheet</h2>
                {questionsForCourse.map((q, qIndex) => {
                    const studentAnswerIndex = result.selectedAnswers[qIndex];
                    const correctAnswerIndex = q.correctAnswerIndex;
                    const isCorrect = studentAnswerIndex === correctAnswerIndex;

                    return (
                        <div key={qIndex} className="bg-white p-5 rounded-lg shadow-md">
                            <p className="font-semibold text-dark">{qIndex + 1}. {q.question}</p>
                            <ul className="mt-4 space-y-3">
                                {q.options.map((option, optIndex) => {
                                    const isCorrectAnswer = optIndex === correctAnswerIndex;
                                    const isStudentAnswer = optIndex === studentAnswerIndex;

                                    let baseClasses = "flex justify-between items-center w-full text-left p-3 rounded-md border text-sm";
                                    let stateClasses = "";
                                    
                                    if(isCorrectAnswer) {
                                        stateClasses = "bg-green-50 border-green-400 text-green-800 font-semibold";
                                    } else if (isStudentAnswer && !isCorrect) {
                                        stateClasses = "bg-red-50 border-red-400 text-red-800 font-semibold";
                                    } else {
                                        stateClasses = "bg-neutral-100 border-neutral-200 text-dark-700";
                                    }

                                    return (
                                        <li key={optIndex} className={`${baseClasses} ${stateClasses}`}>
                                            <span>{String.fromCharCode(65 + optIndex)}. {option}</span>
                                            <div className="flex items-center">
                                                {isCorrectAnswer && <CheckCircleIcon className="h-5 w-5 text-green-500 ml-3" aria-label="Correct Answer"/>}
                                                {isStudentAnswer && !isCorrect && <CloseIcon className="h-5 w-5 text-red-500 ml-3" aria-label="Incorrect Answer"/>}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                            {studentAnswerIndex === null && (
                                <p className="mt-3 text-sm font-semibold text-orange-600 bg-orange-100 p-2 rounded-md">This question was not answered.</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminTestResultPage;
