import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import { TechIcon, FuncIcon } from './Icon';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const isTechnical = course.type === 'Technical';
  const Icon = isTechnical ? TechIcon : FuncIcon;
  const borderColor = isTechnical ? 'border-sky-500' : 'border-amber-500';

  return (
    <div className={`bg-light-100 rounded-lg shadow-md overflow-hidden flex flex-col h-full border-t-4 ${borderColor} transition-all duration-300 hover:shadow-primary/20 hover:shadow-xl hover:-translate-y-1`}>
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center mb-4">
          <Icon className={`h-8 w-8 mr-3 ${isTechnical ? 'text-sky-500' : 'text-amber-500'}`} />
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isTechnical ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'}`}>{course.type}</span>
        </div>
        <h3 className="text-xl font-bold text-dark mb-2 flex-grow">{course.name}</h3>
        <p className="text-dark-700 text-sm mb-6">{course.description}</p>
        <div className="mt-auto">
          <Link to="/register" className="inline-block w-full text-center bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primary-dark transition-colors duration-300">
            Enroll Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;