
import React, { useContext, useState, useMemo } from 'react';
import { CourseContext } from '../context/CourseContext';
import { CourseType } from '../types';
import CourseCard from '../components/CourseCard';

const CoursesPage: React.FC = () => {
  const { courses } = useContext(CourseContext);
  const [filter, setFilter] = useState<CourseType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesFilter = filter === 'all' || course.type === filter;
      const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            course.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [courses, filter, searchTerm]);

  const functionalCourses = filteredCourses.filter(c => c.type === CourseType.Functional);
  const technicalCourses = filteredCourses.filter(c => c.type === CourseType.Technical);

  const buttonClass = "px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300";
  const activeClass = "bg-primary text-white shadow";
  const inactiveClass = "bg-white text-dark-700 hover:bg-primary/10 hover:text-primary";

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-dark">Our Course Catalog</h1>
        <p className="mt-4 text-lg text-dark-700">Explore our comprehensive list of SAP courses tailored for every career path.</p>
      </div>

      {/* Filters */}
      <div className="bg-light-100 p-4 rounded-xl shadow-md sticky top-[65px] z-40 backdrop-blur-lg bg-opacity-80">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 p-1 bg-neutral-200 rounded-full">
            <button onClick={() => setFilter('all')} className={`${buttonClass} ${filter === 'all' ? activeClass : inactiveClass}`}>All</button>
            <button onClick={() => setFilter(CourseType.Functional)} className={`${buttonClass} ${filter === CourseType.Functional ? activeClass : inactiveClass}`}>Functional</button>
            <button onClick={() => setFilter(CourseType.Technical)} className={`${buttonClass} ${filter === CourseType.Technical ? activeClass : inactiveClass}`}>Technical</button>
          </div>
          <div className="w-full md:w-auto md:max-w-xs">
            <input 
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-full focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>
      </div>
      
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-dark-700">No courses found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-16">
          {(filter === 'all' || filter === CourseType.Functional) && functionalCourses.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-dark mb-8 border-l-4 border-amber-500 pl-4">Functional Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {functionalCourses.map((course) => (
                  <CourseCard key={course.name} course={course} />
                ))}
              </div>
            </section>
          )}

          {(filter === 'all' || filter === CourseType.Technical) && technicalCourses.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-dark mb-8 border-l-4 border-sky-500 pl-4">Technical Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {technicalCourses.map((course) => (
                  <CourseCard key={course.name} course={course} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
