
import React, { useState, useContext, useRef } from 'react';
import { QuestionContext } from '../../context/QuestionContext';
import { CourseContext } from '../../context/CourseContext';
import { CourseType, TestQuestion } from '../../types';
import { TrashIcon, PlusIcon, UploadIcon, DownloadIcon, SparklesIcon } from '../../components/Icon';
import Spinner from '../../components/Spinner';
import { generateQuestions } from '../../services/geminiService';

const AdminQuestionsPage: React.FC = () => {
    const { questions, addQuestion, deleteQuestion, addMultipleQuestions } = useContext(QuestionContext);
    const { courses, addCourse, getCourseKey } = useContext(CourseContext);

    const [selectedCourseName, setSelectedCourseName] = useState(courses.length > 0 ? courses[0].name : "");
    const [activeTab, setActiveTab] = useState<'manual' | 'upload' | 'ai'>('manual');

    // State for adding a new question manually
    const [newQuestion, setNewQuestion] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0
    });

    // State for adding a new module
    const [newModule, setNewModule] = useState({ name: '', description: '', type: CourseType.Functional });
    const [showAddModule, setShowAddModule] = useState(false);
    
    // State for AI generation
    const [numToGenerate, setNumToGenerate] = useState(5);
    const [isGenerating, setIsGenerating] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddQuestion = (e: React.FormEvent) => {
        e.preventDefault();
        if (newQuestion.question.trim() === '' || newQuestion.options.some(o => o.trim() === '')) {
            alert("Please fill out all fields for the new question.");
            return;
        }

        const courseKey = getCourseKey(selectedCourseName);
        if (!courseKey) return;
        
        const questionToAdd: TestQuestion = {
            ...newQuestion,
            correctAnswerIndex: Number(newQuestion.correctAnswerIndex),
        };

        addQuestion(courseKey, questionToAdd);
        setNewQuestion({ question: '', options: ['', '', '', ''], correctAnswerIndex: 0 });
    };

    const handleNewQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith("option-")) {
            const index = Number(name.split('-')[1]);
            const updatedOptions = [...newQuestion.options];
            updatedOptions[index] = value;
            setNewQuestion({ ...newQuestion, options: updatedOptions });
        } else {
            setNewQuestion({ ...newQuestion, [name]: value });
        }
    };
    
    const handleAddModule = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newModule.name || !newModule.description) {
            alert("Please fill in all module fields.");
            return;
        }
        addCourse(newModule);
        setNewModule({ name: '', description: '', type: CourseType.Functional });
        setShowAddModule(false);
    };

    const handleDownloadTemplate = () => {
        const csvContent = 'data:text/csv;charset=utf-8,' 
            + 'question,optionA,optionB,optionC,optionD,correctAnswer\n'
            + '"What is the capital of France?","London","Berlin","Paris","Madrid","C"';
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "question_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (!text) return;
            try {
                const parsedQuestions = parseCSV(text);
                const courseKey = getCourseKey(selectedCourseName);
                addMultipleQuestions(courseKey, parsedQuestions);
                alert(`Successfully added ${parsedQuestions.length} questions to ${selectedCourseName}.`);
            } catch (error) {
                alert(`Failed to parse CSV file. Please check the format. Error: ${error}`);
            }
        };
        reader.readAsText(file);
        if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
    };

    const handleAiGenerate = async () => {
        if (!selectedCourseName || numToGenerate <= 0) {
            alert("Please select a course and specify a valid number of questions.");
            return;
        }
        setIsGenerating(true);
        try {
            const generated = await generateQuestions(selectedCourseName, numToGenerate);
            const courseKey = getCourseKey(selectedCourseName);
            addMultipleQuestions(courseKey, generated);
            alert(`Successfully generated and added ${generated.length} new questions!`);
        } catch (error) {
            console.error("AI Generation Error:", error);
            alert(`Failed to generate questions. Please try again. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsGenerating(false);
        }
    };


    const parseCSV = (csvText: string): TestQuestion[] => {
        const lines = csvText.trim().split(/\r?\n/).slice(1); // Skip header
        const parsed: TestQuestion[] = [];
        lines.forEach(line => {
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            if (values.length !== 6) return;
            const [question, optA, optB, optC, optD, correctAnsLetter] = values;
            const correctMap: { [key: string]: number } = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
            const correctAnswerIndex = correctMap[correctAnsLetter.toUpperCase()];
            if (question && optA && optB && optC && optD && correctAnswerIndex !== undefined) {
                parsed.push({ question, options: [optA, optB, optC, optD], correctAnswerIndex });
            }
        });
        return parsed;
    };
    
    const courseKey = getCourseKey(selectedCourseName);
    const currentQuestions = questions[courseKey] || [];

    const inputClass = "w-full px-3 py-2 bg-neutral-100 border border-neutral-300 rounded-md text-dark focus:ring-2 focus:ring-primary focus:outline-none";
    const tabClass = "flex items-center gap-2 py-2 px-4 font-semibold text-sm rounded-t-lg transition-colors";
    const activeTabClass = "bg-primary text-white";
    const inactiveTabClass = "bg-neutral-200 text-dark-700 hover:bg-neutral-300";

    return (
        <div className="space-y-8">
            {/* Module Management */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-dark">Course Modules</h2>
                    <button onClick={() => setShowAddModule(!showAddModule)} className="flex items-center bg-sky-500 text-white font-bold py-2 px-4 rounded-md hover:bg-sky-600 transition-colors">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        {showAddModule ? 'Cancel' : 'Add New Module'}
                    </button>
                </div>
                {showAddModule && (
                    <form onSubmit={handleAddModule} className="mt-6 space-y-4 border-t pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-1">Module Name</label>
                                <input type="text" value={newModule.name} onChange={e => setNewModule({...newModule, name: e.target.value})} className={inputClass} required/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-1">Module Type</label>
                                <select value={newModule.type} onChange={e => setNewModule({...newModule, type: e.target.value as CourseType})} className={inputClass}>
                                    <option value={CourseType.Functional}>Functional</option>
                                    <option value={CourseType.Technical}>Technical</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Description</label>
                            <textarea value={newModule.description} onChange={e => setNewModule({...newModule, description: e.target.value})} className={inputClass} rows={2} required />
                        </div>
                        <div className="text-right">
                             <button type="submit" className="bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-700">Save Module</button>
                        </div>
                    </form>
                )}
            </div>

            {/* Question Management */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-dark mb-4">Question Bank</h1>
                <div className="mb-6">
                    <label htmlFor="course-select" className="block text-sm font-medium text-dark-700 mb-2">Select a course to manage:</label>
                    <select id="course-select" value={selectedCourseName} onChange={e => setSelectedCourseName(e.target.value)} className="w-full max-w-lg p-3 bg-white border border-neutral-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:outline-none">
                        {courses.map(course => <option key={course.name} value={course.name}>{course.name}</option>)}
                    </select>
                </div>
                
                {/* Tabs */}
                <div className="border-b border-neutral-300 mb-6">
                    <nav className="-mb-px flex space-x-2" aria-label="Tabs">
                        <button onClick={() => setActiveTab('manual')} className={`${tabClass} ${activeTab === 'manual' ? activeTabClass : inactiveTabClass}`}>Add Manually</button>
                        <button onClick={() => setActiveTab('upload')} className={`${tabClass} ${activeTab === 'upload' ? activeTabClass : inactiveTabClass}`}>Upload From File</button>
                        <button onClick={() => setActiveTab('ai')} className={`${tabClass} ${activeTab === 'ai' ? activeTabClass : inactiveTabClass}`}><SparklesIcon className="h-5 w-5" /> Generate with AI</button>
                    </nav>
                </div>
                
                {activeTab === 'manual' && (
                    <form onSubmit={handleAddQuestion} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Question Text</label>
                            <input type="text" name="question" value={newQuestion.question} onChange={handleNewQuestionChange} className={inputClass} required/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {newQuestion.options.map((opt, i) => (
                                <div key={i}>
                                    <label className="block text-sm font-medium text-dark-700 mb-1">Option {String.fromCharCode(65 + i)}</label>
                                    <input type="text" name={`option-${i}`} value={opt} onChange={handleNewQuestionChange} className={inputClass} required/>
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Correct Answer</label>
                            <select name="correctAnswerIndex" value={newQuestion.correctAnswerIndex} onChange={handleNewQuestionChange} className={inputClass}>
                                {newQuestion.options.map((_, i) => <option key={i} value={i}>Option {String.fromCharCode(65 + i)}</option>)}
                            </select>
                        </div>
                        <div className="text-right">
                            <button type="submit" className="bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-700">Save Question</button>
                        </div>
                    </form>
                )}
                
                {activeTab === 'upload' && (
                    <div className="text-center p-8 border-2 border-dashed border-neutral-300 rounded-lg">
                        <UploadIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-dark mb-2">Upload a CSV file</h3>
                        <p className="text-sm text-dark-700 mb-4">Batch import questions by uploading a CSV file. <br/>Ensure it follows the template format.</p>
                        <input type="file" accept=".csv" onChange={handleFileUpload} ref={fileInputRef} className="hidden" id="csv-upload" />
                        <div className="flex justify-center items-center space-x-4">
                            <label htmlFor="csv-upload" className="cursor-pointer bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition-colors">
                                Choose File
                            </label>
                             <button onClick={handleDownloadTemplate} className="flex items-center bg-neutral-600 text-white font-bold py-2 px-4 rounded-md hover:bg-neutral-700 transition-colors">
                                <DownloadIcon className="h-5 w-5 mr-2" />
                                Download Template
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'ai' && (
                     <div className="p-8 border-2 border-dashed border-neutral-300 rounded-lg">
                        <div className="max-w-md mx-auto text-center">
                             <SparklesIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                             <h3 className="text-lg font-medium text-dark mb-2">Generate Questions with AI</h3>
                             <p className="text-sm text-dark-700 mb-6">Let AI create a set of questions for the selected course: <span className="font-bold text-primary">{selectedCourseName}</span>.</p>
                             {isGenerating ? (
                                <div className="space-y-4">
                                    <Spinner />
                                    <p className="text-dark-700 animate-pulse">Generating questions... please wait.</p>
                                </div>
                             ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="num-to-generate" className="block text-sm font-medium text-dark-700 mb-2">Number of questions to generate:</label>
                                        <input 
                                            type="number" 
                                            id="num-to-generate" 
                                            value={numToGenerate} 
                                            onChange={(e) => setNumToGenerate(parseInt(e.target.value, 10))}
                                            className="w-32 mx-auto text-center p-2 bg-white border border-neutral-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                            min="1"
                                            max="15"
                                        />
                                    </div>
                                    <button onClick={handleAiGenerate} disabled={isGenerating} className="inline-flex items-center justify-center w-full bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-wait">
                                         <SparklesIcon className="h-5 w-5 mr-2" />
                                        Generate Questions
                                    </button>
                                </div>
                             )}
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <h3 className="p-4 text-xl font-bold text-dark border-b">Questions for {selectedCourseName} ({currentQuestions.length})</h3>
                <ul className="divide-y divide-neutral-200">
                    {currentQuestions.map((q, index) => (
                        <li key={index} className="p-4 hover:bg-neutral-100/50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-dark">{index + 1}. {q.question}</p>
                                    <ul className="mt-2 space-y-1 text-sm text-dark-700 pl-4 list-none">
                                        {q.options.map((opt, optIndex) => (
                                            <li key={optIndex} className={`${optIndex === q.correctAnswerIndex ? 'font-bold text-green-600' : ''}`}>
                                                {String.fromCharCode(65 + optIndex)}. {opt}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button onClick={() => deleteQuestion(courseKey, index)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors" aria-label="Delete question">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                    {currentQuestions.length === 0 && (
                        <li className="p-8 text-center text-dark-700">No questions found for this course. Use the forms above to add some.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default AdminQuestionsPage;