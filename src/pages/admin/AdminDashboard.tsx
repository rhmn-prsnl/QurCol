import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, BookOpen, Video, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ users: 0, courses: 0, videos: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock fetching stats
    setTimeout(() => {
      setStats({ users: 156, courses: 12, videos: 84 });
      setIsLoading(false);
    }, 500);
  }, [token]);

  if (isLoading) return <div>Loading stats...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-black dark:text-white mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 flex items-center">
          <div className="p-3 rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 mr-4">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Users</p>
            <p className="text-2xl font-bold text-black dark:text-white">{stats.users}</p>
          </div>
        </div>
        
        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 flex items-center">
          <div className="p-3 rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 mr-4">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Courses</p>
            <p className="text-2xl font-bold text-black dark:text-white">{stats.courses}</p>
          </div>
        </div>
        
        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 flex items-center">
          <div className="p-3 rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 mr-4">
            <Video className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Videos</p>
            <p className="text-2xl font-bold text-black dark:text-white">{stats.videos}</p>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 flex items-center">
          <div className="p-3 rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 mr-4">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Enrollments</p>
            <p className="text-2xl font-bold text-black dark:text-white">124</p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 p-6">
        <h2 className="text-lg font-bold text-black dark:text-white mb-4">Recent Activity</h2>
        <p className="text-zinc-600 dark:text-zinc-400">Activity feed will be implemented here.</p>
      </div>
    </div>
  );
}
