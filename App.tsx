
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from './components/layouts/PublicLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import TestPage from './pages/TestPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import StudentTestResultPage from './pages/StudentTestResultPage'; // Import the new page

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminQuestionsPage from './pages/admin/AdminQuestionsPage';
import AdminTestResultPage from './pages/admin/AdminTestResultPage';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/discount-test" element={<TestPage />} />
        <Route path="/dashboard" element={<StudentDashboardPage />} />
        <Route path="/dashboard/test-result" element={<StudentTestResultPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="questions" element={<AdminQuestionsPage />} />
        <Route path="test-result/:resultIndex" element={<AdminTestResultPage />} />
      </Route>
    </Routes>
  );
};

export default App;
