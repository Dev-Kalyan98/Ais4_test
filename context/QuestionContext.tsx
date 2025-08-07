import React, { createContext, useState, ReactNode, useContext } from 'react';
import { TestQuestion } from '../types';
import { INITIAL_QUESTIONS_BANK } from '../data/questions';
import { CourseContext } from './CourseContext';

// This map is used only for one-time initialization to map legacy keys to course names.
const courseNameToLegacyKeyMap: { [courseName: string]: string } = {
    'SAP S/4HANA Financial Accounting (FI/CO)': 'FICO',
    'SAP S/4HANA Materials Management (MM)': 'MM',
    'SAP S/4HANA Sales & Distribution (SD)': 'SD',
    'SAP S/4HANA Production Planning (PP)': 'PP',
    'SAP S/4HANA Human Capital Management (HCM)': 'HCM',
    'SAP S/4HANA Project Systems (PS)': 'PS',
    'SAP S/4HANA Asset Management (EAM)': 'EAM',
    'SAP SuccessFactors Employee Central': 'SuccessFactors',
    'SAP Ariba Strategic Sourcing': 'Ariba',
    'SAP Integrated Business Planning (IBP)': 'IBP',
    'SAP ABAP for S/4HANA (RAP, CDS, BOPF)': 'ABAP',
    'SAP Fiori/UI5 Development': 'Fiori',
    'SAP Business Technology Platform (BTP) – Extension Suite': 'BTP',
    'SAP Integration Suite (CPI)': 'CPI',
    'SAP Cloud ALM & Solution Manager 7.2': 'CloudALM',
    'SAP Basis & SAP HANA Administration': 'Basis',
    'SAP CAP & Node.js on BTP': 'CAP',
    'SAP Analytics Cloud (SAC) Design & Storyboarding': 'SAC',
    'SAP Process Automation (BPA)': 'BPA',
    'SAP Datasphere (DW Cloud)': 'Datasphere',
};

type QuestionBank = { [key: string]: TestQuestion[] };

interface QuestionContextType {
  questions: QuestionBank;
  addQuestion: (courseKey: string, question: TestQuestion) => void;
  deleteQuestion: (courseKey: string, questionIndex: number) => void;
  addMultipleQuestions: (courseKey: string, newQuestions: TestQuestion[]) => void;
}

export const QuestionContext = createContext<QuestionContextType>({
  questions: {},
  addQuestion: () => {},
  deleteQuestion: () => {},
  addMultipleQuestions: () => {},
});

interface QuestionProviderProps {
  children: ReactNode;
}

export const QuestionProvider: React.FC<QuestionProviderProps> = ({ children }) => {
  const { courses, getCourseKey } = useContext(CourseContext);

  const [questions, setQuestions] = useState<QuestionBank>(() => {
    const bank: QuestionBank = {};
    courses.forEach(course => {
        const dynamicKey = getCourseKey(course.name);
        const legacyKey = courseNameToLegacyKeyMap[course.name];
        if (legacyKey && INITIAL_QUESTIONS_BANK[legacyKey]) {
            bank[dynamicKey] = INITIAL_QUESTIONS_BANK[legacyKey];
        } else {
            bank[dynamicKey] = [];
        }
    });
    return bank;
  });

  const addQuestion = (courseKey: string, newQuestion: TestQuestion) => {
    setQuestions(prev => {
      const courseQuestions = prev[courseKey] ? [...prev[courseKey], newQuestion] : [newQuestion];
      return { ...prev, [courseKey]: courseQuestions };
    });
  };

  const addMultipleQuestions = (courseKey: string, newQuestions: TestQuestion[]) => {
     setQuestions(prev => {
      const courseQuestions = prev[courseKey] ? [...prev[courseKey], ...newQuestions] : [...newQuestions];
      return { ...prev, [courseKey]: courseQuestions };
    });
  }

  const deleteQuestion = (courseKey: string, questionIndex: number) => {
    setQuestions(prev => {
      if (!prev[courseKey]) return prev;
      const updatedQuestions = prev[courseKey].filter((_, index) => index !== questionIndex);
      return { ...prev, [courseKey]: updatedQuestions };
    });
  };

  const value = {
    questions,
    addQuestion,
    deleteQuestion,
    addMultipleQuestions
  };

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  );
};