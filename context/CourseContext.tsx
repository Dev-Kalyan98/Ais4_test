import React, { createContext, useState, ReactNode } from 'react';
import { Course } from '../types';
import { INITIAL_COURSES } from '../constants';

interface CourseContextType {
  courses: Course[];
  addCourse: (newCourse: Omit<Course, 'name' | 'type' | 'description'> & Course) => void;
  getCourseKey: (courseName: string) => string;
}

export const CourseContext = createContext<CourseContextType>({
  courses: [],
  addCourse: () => {},
  getCourseKey: () => '',
});

interface CourseProviderProps {
  children: ReactNode;
}

// Utility to create a consistent key from a course name
const getCourseKey = (courseName: string): string => {
  return courseName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 30);
};

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);

  const addCourse = (newCourse: Course) => {
    // Prevent adding courses with duplicate names
    if (courses.some(course => course.name.toLowerCase() === newCourse.name.toLowerCase())) {
        alert("A course with this name already exists.");
        return;
    }
    setCourses(prev => [...prev, newCourse]);
  };

  const value = {
    courses,
    addCourse,
    getCourseKey,
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};