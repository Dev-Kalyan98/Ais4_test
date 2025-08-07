
export enum CourseType {
  Functional = 'Functional',
  Technical = 'Technical',
}

export interface Course {
  name: string;
  type: CourseType;
  description: string;
}

export interface TestQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface User {
  name:string;
  email: string;
  phone: string;
  fullAddress: string;
  dob: string;
  gender: string;
  qualification: string;
  passingYear: string;
  course: string;
  password?: string; 
  role: 'student' | 'admin';
  registrationDate: string;
}

export interface TestResult {
  userEmail: string;
  course: string;
  score: number;
  totalQuestions: number;
  discount: number;
  date: string;
  selectedAnswers: (number | null)[];
}