import React, { createContext, useState, ReactNode } from 'react';
import { User, TestResult } from '../types';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  registeredUsers: User[];
  testResults: TestResult[];
  login: (email: string, password?: string) => User | null;
  logout: () => void;
  register: (newUser: Omit<User, 'role' | 'registrationDate'>) => void;
  addTestResult: (result: Omit<TestResult, 'date'>) => void;
  createAdmin: (adminData: Pick<User, 'name' | 'email' | 'password'>) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isAdmin: false,
  registeredUsers: [],
  testResults: [],
  login: () => null,
  logout: () => {},
  register: () => {},
  addTestResult: () => {},
  createAdmin: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

const ADMIN_USER: User = {
    name: 'Admin',
    email: 'kalyanpradhan275@gmail.com',
    password: 'Kalyan@1998',
    role: 'admin',
    phone: '',
    fullAddress: '',
    dob: '',
    gender: '',
    qualification: '',
    passingYear: '',
    course: '',
    registrationDate: new Date().toISOString(),
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const register = (newUser: Omit<User, 'role' | 'registrationDate'>) => {
    const userWithRole: User = { 
      ...newUser, 
      role: 'student',
      registrationDate: new Date().toISOString(),
    };
    setRegisteredUsers(prev => [...prev, userWithRole]);
  };

  const createAdmin = (adminData: Pick<User, 'name' | 'email' | 'password'>) => {
    const newAdmin: User = {
        ...adminData,
        role: 'admin',
        registrationDate: new Date().toISOString(),
        phone: 'N/A',
        fullAddress: 'N/A',
        dob: 'N/A',
        gender: 'N/A',
        qualification: 'N/A',
        passingYear: 'N/A',
        course: 'N/A',
    };
    setRegisteredUsers(prev => [...prev, newAdmin]);
  };

  const login = (email: string, password?: string): User | null => {
    if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
        setUser(ADMIN_USER);
        return ADMIN_USER;
    }

    const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return foundUser;
    }
    return null;
  };

  const logout = () => {
    setUser(null);
  };
  
  const addTestResult = (result: Omit<TestResult, 'date'>) => {
    const newResult: TestResult = {
        ...result,
        date: new Date().toISOString(),
    };
    setTestResults(prev => [...prev.filter(r => !(r.userEmail === result.userEmail && r.course === result.course)), newResult]);
  };

  const value = {
    user,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    register,
    registeredUsers,
    testResults,
    addTestResult,
    createAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};