
import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { QuestionContext } from '../context/QuestionContext';
import { CourseContext } from '../context/CourseContext';
import { TestQuestion } from '../types';
import Spinner from '../components/Spinner';
import { ClockIcon, InfoIcon } from '../components/Icon';

const TestPage: React.FC = () => {
  const { user, isLoggedIn, addTestResult } = useContext(AuthContext);
  const { questions: allQuestions } = useContext(QuestionContext);
  const { getCourseKey } = useContext(CourseContext);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [status, setStatus] = useState<'idle' | 'instructions' | 'loading' | 'active' | 'finished'>('idle');
  const [error, setError] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15 * 60);
  const [redirectTimer, setRedirectTimer] = useState(30);

  const handleStartTestClick = () => {
    setStatus('instructions');
  };

  const initializeAndStartTest = useCallback(() => {
    if (!user?.course) return;
    setStatus('loading');
    setError('');
    try {
        const courseKey = getCourseKey(user.course);
        if (!courseKey) {
            throw new Error(`We're sorry, a test for the course "${user.course}" is not available at this moment.`);
        }
        const questionsForCourse = allQuestions[courseKey];
        if (!questionsForCourse || questionsForCourse.length === 0) {
            throw new Error(`No questions found for course: ${user.course}. Please contact support.`);
        }
        
        setQuestions(questionsForCourse);
        setSelectedAnswers(new Array(questionsForCourse.length).fill(null));
        setCurrentQuestionIndex(0);
        setTimer(15 * 60);
        
        setTimeout(() => {
            setStatus('active');
        }, 500);
    } catch (e: any) {
      setError(e.message || 'Failed to load test questions. Please try again later.');
      console.error(e);
      setStatus('idle');
    }
  }, [user, allQuestions, getCourseKey]);

  const finishTest = useCallback(() => {
    if (status === 'finished' || !user) return;

    let correctAnswers = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswerIndex) {
        correctAnswers++;
      }
    });
    
    const finalScore = correctAnswers;
    setScore(finalScore);
    const total = questions.length > 0 ? questions.length : 1;
    const calculatedDiscount = Math.round((finalScore / total) * 75);

    addTestResult({
      userEmail: user.email,
      course: user.course,
      score: finalScore,
      totalQuestions: total,
      discount: calculatedDiscount,
      selectedAnswers,
    });
    setStatus('finished');
  }, [questions, selectedAnswers, status, user, addTestResult]);


  useEffect(() => {
    if (status !== 'active') {
      return;
    }

    if (timer <= 0) {
      finishTest();
      return;
    }

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [status, timer, finishTest]);

  useEffect(() => {
    if (status !== 'finished') {
      return;
    }

    setRedirectTimer(30); // Reset timer on status change

    const intervalId = setInterval(() => {
      setRedirectTimer(prev => {
        if (prev <= 1) {
            clearInterval(intervalId);
            navigate('/dashboard');
            return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [status, navigate]);


  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  if (!isLoggedIn || !user) {
    return (
       <div className="container mx-auto px-4 py-12">
        <div className="text-center bg-light-100 p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-dark">Access Denied</h1>
            <p className="text-dark-700 mt-2">Please log in to take the discount test.</p>
        </div>
       </div>
    );
  }

  const discount = questions.length > 0 ? Math.round((score / questions.length) * 75) : 0;
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const getQuestionCountForCourse = () => {
    if (!user?.course) return 15;
    const courseKey = getCourseKey(user.course);
    return allQuestions[courseKey]?.length || 15;
  }

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-light-100 p-8 rounded-lg shadow-xl min-h-[500px] flex flex-col justify-center">
        
        { (status === 'idle' || status === 'instructions') && (
            <div className="text-center">
                <h1 className="text-3xl font-bold text-dark text-center mb-4">SAP Skills Assessment Test</h1>
                <p className="text-dark-700 text-center mb-8">Test your knowledge for the <span className="font-bold text-primary">{user.course}</span> module and earn a discount!</p>
            </div>
        )}

        {status === 'idle' && (
            <div className="text-center">
            <button onClick={handleStartTestClick} className="bg-primary text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-primary-dark transition-transform hover:scale-105">
                Start Test
            </button>
            </div>
        )}

        {status === 'instructions' && (
             <div className="text-center">
                <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-r-lg text-left max-w-xl mx-auto mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-4">Test Instructions</h2>
                    <ul className="space-y-3 text-dark-700">
                        <li className="flex items-start"><InfoIcon className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" /><span>The test consists of <strong>{getQuestionCountForCourse()} multiple-choice questions</strong>.</span></li>
                        <li className="flex items-start"><ClockIcon className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" /><span>You will have <strong>15 minutes</strong> to complete the test. The test will stop automatically when the time is up.</span></li>
                        <li className="flex items-start"><InfoIcon className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" /><span>Once you start, the timer will begin and cannot be paused. Please ensure you are ready before proceeding.</span></li>
                    </ul>
                </div>
                <button onClick={initializeAndStartTest} className="bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-700 transition-transform hover:scale-105">
                    I Understand, Start the Test
                </button>
             </div>
        )}
        
        {status === 'loading' && <Spinner />}
        
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-6 text-center">{error}</p>}

        {status === 'active' && questions.length > 0 && (
            <div>
            <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <p className="text-dark-700 font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</p>
                    <div className="w-48 bg-neutral-200 rounded-full h-2.5 mt-1">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                    </div>
                </div>
                <div className={`flex items-center font-bold text-lg p-2 rounded-md ${timer < 60 ? 'text-red-600 bg-red-100' : 'text-primary'}`}>
                    <ClockIcon className="h-6 w-6 mr-2" />
                    <span>{formatTime(timer)}</span>
                </div>
            </div>
            <h2 className="text-xl font-semibold text-dark my-6">{questions[currentQuestionIndex].question}</h2>
            <div className="space-y-4">
                {questions[currentQuestionIndex].options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswers[currentQuestionIndex] === index
                        ? 'bg-primary border-primary-dark text-white shadow-lg'
                        : 'bg-white border-neutral-300 hover:bg-primary/10 hover:border-primary'
                    }`}
                >
                   <span className={`font-bold mr-3 ${selectedAnswers[currentQuestionIndex] === index ? 'text-white' : 'text-primary'}`}>{String.fromCharCode(65 + index)}.</span>
                    {option}
                </button>
                ))}
            </div>
            <div className="mt-8 flex justify-between items-center">
                <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="bg-neutral-300 text-dark font-bold py-2 px-6 rounded-md hover:bg-neutral-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                {currentQuestionIndex < questions.length - 1 ? (
                <button onClick={handleNextQuestion} className="bg-secondary text-dark font-bold py-2 px-6 rounded-md hover:opacity-90">
                    Next
                </button>
                ) : (
                <button onClick={finishTest} className="bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-700">
                    Finish Test
                </button>
                )}
            </div>
            </div>
        )}

        {status === 'finished' && (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-dark mb-2">Test Complete!</h2>
                <p className="text-dark-700">You answered <span className="text-primary font-bold">{score}</span> out of <span className="text-primary font-bold">{questions.length}</span> questions correctly.</p>
                <div className="my-8">
                    <p className="text-lg text-dark-700">Your calculated discount is:</p>
                    <p className="text-6xl font-extrabold text-green-500 my-2">{discount}%</p>
                </div>
                <p className="text-dark-700">Our team will contact you shortly with your personalized discount code for the <span className="font-bold text-dark">{user.course}</span> course.</p>
                <div className="mt-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-primary text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-primary-dark transition-transform hover:scale-105"
                    >
                        Go to Dashboard
                    </button>
                    <p className="text-sm text-dark-700 mt-4">
                        You will be redirected automatically in {redirectTimer} seconds...
                    </p>
                </div>
            </div>
        )}
        </div>
    </div>
  );
};

export default TestPage;
