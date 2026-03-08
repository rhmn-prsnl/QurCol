import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Filter, BookOpen, Users, Award } from 'lucide-react';
import { Course } from '../types';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setIsLoading(false);
      });
  }, []);

  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-black dark:text-white mb-4 tracking-tight">
            Explore Our Courses
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Discover a wide range of courses taught by expert instructors. Enhance your skills and advance your career.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg leading-5 bg-white dark:bg-black text-black dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 sm:text-sm transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Filter className="h-5 w-5 text-zinc-400 hidden md:block" />
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-gold-500 text-black shadow-sm'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gold-200/50 dark:border-gold-900/30 flex flex-col"
              >
                <div className="relative aspect-video">
                  <img
                    src={course.thumbnail || `https://picsum.photos/seed/${course.id}/800/600`}
                    alt={course.title}
                    className="w-full h-full object-cover grayscale-[20%]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gold-400 uppercase tracking-wider border border-gold-500/30">
                    {course.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-black dark:text-white mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-2 flex-grow">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gold-500" /> {course.instructor}
                    </span>
                    <span className="flex items-center">
                      <Award className="h-4 w-4 mr-1 text-gold-500" /> {course.level}
                    </span>
                  </div>
                  <Link
                    to={`/courses/${course.id}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gold-500/50 rounded-lg shadow-sm text-sm font-medium text-black dark:text-white hover:bg-gold-50 dark:hover:bg-gold-900/20 transition-colors"
                  >
                    View Course
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-gold-200/50 dark:border-gold-900/30">
            <BookOpen className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
            <h3 className="text-lg font-medium text-black dark:text-white mb-2">No courses found</h3>
            <p className="text-zinc-500 dark:text-zinc-400">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
