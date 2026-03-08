import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, PlayCircle, Calendar, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export default function CourseVideos() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [activeVideo, setActiveVideo] = useState<any | null>(null);
  
  // Mock video data
  const allVideos = [
    { id: 'v1', title: 'Introduction to the Course', date: '2026-03-01', duration: '45:00', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80', youtubeId: 'jMy4pVZMyLM' },
    { id: 'v2', title: 'Core Concepts Part 1', date: '2026-03-03', duration: '55:20', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80', youtubeId: 'UBOj6rqRUME' },
    { id: 'v3', title: 'Core Concepts Part 2', date: '2026-03-05', duration: '1:10:00', thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80', youtubeId: 'BwuLxPH8IDs' },
    { id: 'v4', title: 'Advanced Techniques', date: '2026-03-08', duration: '1:30:00', thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80', youtubeId: 'w7ejDZ8SWv8' },
  ];

  useEffect(() => {
    // Mock checking if user has video access permission from admin
    // In a real app, this would be an API call
    setTimeout(() => {
      // Let's assume user with ID '3' doesn't have access (based on our mock in AdminUsers)
      if (user?.email === 'student2@example.com') {
        setHasAccess(false);
      } else {
        setHasAccess(true);
      }
    }, 500);
  }, [user]);

  const filteredVideos = allVideos
    .filter(video => video.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending

  if (hasAccess === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
        <div className="max-w-md w-full text-center space-y-6 bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl border border-red-200 dark:border-red-900/30">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-black dark:text-white">Access Denied</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            You do not have permission to view the class videos for this course. Please contact the administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Class Videos</h1>
            <p className="text-zinc-600 dark:text-zinc-400">Watch recorded sessions for your course.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-400" />
            </div>
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-4">
          {activeVideo && (
            <div className="mb-8">
              <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-gold-900/20 mb-4">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <h2 className="text-2xl font-bold text-black dark:text-white">{activeVideo.title}</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                {new Date(activeVideo.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {activeVideo.duration}
              </p>
            </div>
          )}

          <h3 className="text-xl font-semibold text-black dark:text-white mb-4">All Videos</h3>
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                onClick={() => {
                  setActiveVideo(video);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-zinc-50 dark:bg-zinc-900 rounded-xl overflow-hidden border flex flex-col sm:flex-row hover:shadow-md transition-shadow group cursor-pointer ${
                  activeVideo?.id === video.id 
                    ? 'border-gold-500 shadow-gold-900/20' 
                    : 'border-gold-200/50 dark:border-gold-900/30'
                }`}
              >
                <div className="relative w-full sm:w-64 aspect-video sm:aspect-auto sm:h-36 shrink-0">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-12 h-12 text-gold-500" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-mono">
                    {video.duration}
                  </div>
                </div>
                
                <div className="p-4 sm:p-6 flex flex-col justify-center flex-grow">
                  <h3 className="text-xl font-bold text-black dark:text-white mb-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(video.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-gold-200/50 dark:border-gold-900/30">
              <p className="text-zinc-500 dark:text-zinc-400">No videos found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
