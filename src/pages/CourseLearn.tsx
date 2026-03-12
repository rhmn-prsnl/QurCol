import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Course } from '../types';
import { Users, Award, Clock, BookOpen, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function CourseLearn() {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // Mock fetching course details
        const mockCourse: Course = {
          id: Number(id),
          title: 'Advanced React Patterns',
          description: 'Master advanced React patterns, performance optimization, and state management techniques. This comprehensive course covers everything you need to know to build scalable and maintainable React applications.\n\nWhat you will learn:\n- Custom Hooks and Reusability\n- Context API and State Management\n- Performance Optimization (useMemo, useCallback)\n- Advanced Component Patterns (Render Props, HOCs)\n- Testing React Applications',
          category: 'Web Development',
          level: 'Advanced',
          instructor: 'Sarah Drasner',
          thumbnail: `https://picsum.photos/seed/${id}/800/600`,
          created_at: new Date().toISOString()
        };
        
        setCourse(mockCourse);
        
        // Mock checking enrollment
        if (user) {
          setIsEnrolled(true); // Assuming enrolled for mock
        }
      } catch (err) {
        setError('Failed to load course details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    try {
      // Mock enrollment
      setIsEnrolled(true);
      alert('Successfully enrolled!');
    } catch (err) {
      setError('Network error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white dark:bg-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-2">Oops!</h2>
          <p className="text-zinc-600 dark:text-zinc-400">{error || 'Course not found'}</p>
          <Link to="/courses" className="mt-4 inline-block text-gold-600 hover:underline">Back to Courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 overflow-hidden">
          <div className="relative aspect-[21/9] w-full">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover grayscale-[20%]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-gold-500/20 text-gold-300 text-sm font-semibold rounded-full border border-gold-500/30 backdrop-blur-sm">
                  {course.category}
                </span>
                <span className="px-3 py-1 bg-white/10 text-white text-sm font-semibold rounded-full border border-white/20 backdrop-blur-sm">
                  {course.level}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-3xl leading-tight">
                {course.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-zinc-300 text-sm md:text-base">
                <span className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-gold-400" /> {course.instructor}
                </span>
                <span className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-gold-400" /> 12 Weeks
                </span>
                <span className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-gold-400" /> 24 Lessons
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-8 md:p-12 flex flex-col md:flex-row gap-12">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6">About this course</h2>
              <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
                {course.description}
              </div>
            </div>
            
            <div className="w-full md:w-80 shrink-0">
              <div className="bg-white dark:bg-black rounded-2xl p-6 border border-gold-100 dark:border-gold-900/20 shadow-sm sticky top-24">
                <h3 className="text-xl font-bold text-black dark:text-white mb-4">Course Includes</h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start text-zinc-600 dark:text-zinc-400">
                    <CheckCircle className="w-5 h-5 text-gold-500 mr-3 shrink-0" />
                    <span>Full lifetime access</span>
                  </li>
                  <li className="flex items-start text-zinc-600 dark:text-zinc-400">
                    <CheckCircle className="w-5 h-5 text-gold-500 mr-3 shrink-0" />
                    <span>Access on mobile and TV</span>
                  </li>
                  <li className="flex items-start text-zinc-600 dark:text-zinc-400">
                    <CheckCircle className="w-5 h-5 text-gold-500 mr-3 shrink-0" />
                    <span>Certificate of completion</span>
                  </li>
                </ul>
                
                {isEnrolled ? (
                  <Link
                    to="/dashboard"
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-black bg-gold-500 hover:bg-gold-400 transition-colors shadow-sm shadow-gold-900/20"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-black bg-gold-500 hover:bg-gold-400 transition-colors shadow-sm shadow-gold-900/20"
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
