import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Course } from '../types';
import { PlayCircle, BookOpen, Clock, Award, User, Settings, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { user, token, login } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'profile'>('courses');
  
  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Mock fetching enrolled courses
    setTimeout(() => {
      setEnrolledCourses([
        {
          id: '1',
          title: 'Advanced Trading Strategies',
          description: 'Learn advanced trading strategies for the modern market.',
          thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80',
          price: 199,
          duration: '8 weeks',
          level: 'Advanced',
          category: 'Trading',
          instructor: 'John Doe',
          rating: 4.8,
          students: 1200,
          created_at: new Date().toISOString()
        }
      ]);
      setIsLoading(false);
    }, 500);
  }, [token]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage({ type: '', text: '' });

    try {
      // Mock updating profile
      setTimeout(() => {
        setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' });
        setPassword('');
        if (user) {
          login(token!, { ...user, name });
        }
        setIsUpdating(false);
      }, 500);
    } catch (err) {
      setUpdateMessage({ type: 'error', text: 'Network error.' });
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">Welcome back, {user?.name}!</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">Continue your learning journey.</p>
          </div>
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg border border-gold-200/50 dark:border-gold-900/30">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'courses' 
                  ? 'bg-white dark:bg-black text-gold-600 dark:text-gold-400 shadow-sm' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              My Courses
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'profile' 
                  ? 'bg-white dark:bg-black text-gold-600 dark:text-gold-400 shadow-sm' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Profile Settings
            </button>
          </div>
        </div>

        {activeTab === 'courses' ? (
          <>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6">My Subscribed Courses</h2>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
              </div>
            ) : enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {enrolledCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gold-200/50 dark:border-gold-900/30 flex flex-col"
                  >
                    <div className="relative aspect-video">
                      <img
                        src={course.thumbnail || `https://picsum.photos/seed/${course.id}/800/600`}
                        alt={course.title}
                        className="w-full h-full object-cover grayscale-[20%]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Link to={`/courses/${course.id}/videos`} className="p-3 bg-gold-500 rounded-full text-black hover:scale-110 transition-transform shadow-lg shadow-gold-900/50">
                          <PlayCircle className="h-8 w-8" />
                        </Link>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-black dark:text-white mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      
                      <div className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-zinc-500 dark:text-zinc-400 flex items-center">
                            <Clock className="w-4 h-4 mr-1" /> Expiry Date:
                          </span>
                          <span className="font-medium text-black dark:text-white">
                            {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <Link
                        to={`/courses/${course.id}/videos`}
                        className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-gold-500 hover:bg-gold-400 transition-colors shadow-gold-900/20"
                      >
                        Watch Classes Videos
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-gold-200/50 dark:border-gold-900/30">
                <BookOpen className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
                <h3 className="text-lg font-medium text-black dark:text-white mb-2">No enrolled courses yet</h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-6">Start exploring our catalog and enroll in your first course.</p>
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-black bg-gold-500 hover:bg-gold-400 transition-colors shadow-sm shadow-gold-900/20"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 flex items-center justify-center font-bold text-2xl border border-gold-200 dark:border-gold-800/50">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-black dark:text-white">Profile Settings</h2>
                  <p className="text-zinc-500 dark:text-zinc-400">{user?.email}</p>
                </div>
              </div>

              {updateMessage.text && (
                <div className={`p-4 rounded-lg mb-6 ${
                  updateMessage.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30' 
                    : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30'
                }`}>
                  {updateMessage.text}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-zinc-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    New Password <span className="text-zinc-400 font-normal">(leave blank to keep current)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-zinc-400" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gold-200/50 dark:border-gold-900/30">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-gold-500 hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-colors disabled:opacity-70 shadow-sm shadow-gold-900/20"
                  >
                    {isUpdating ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
