import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PlayCircle, Clock, TrendingUp, Star } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  youtubeId: string;
  duration: string;
  views: string;
  category: string;
}

const mockVideos: Video[] = [
  { id: '1', title: 'Introduction to AI', youtubeId: 'dQw4w9WgXcQ', duration: '15:20', views: '1.2K', category: 'Recent' },
  { id: '2', title: 'Machine Learning Basics', youtubeId: 'tgbNymZ7vqY', duration: '22:15', views: '850', category: 'Recent' },
  { id: '3', title: 'Deep Learning Explained', youtubeId: 'dQw4w9WgXcQ', duration: '18:45', views: '2.5K', category: 'Weekly' },
  { id: '4', title: 'Neural Networks from Scratch', youtubeId: 'tgbNymZ7vqY', duration: '30:00', views: '3.1K', category: 'Weekly' },
  { id: '5', title: 'Data Science Masterclass', youtubeId: 'dQw4w9WgXcQ', duration: '45:10', views: '10K', category: 'Popular' },
  { id: '6', title: 'Python for Beginners', youtubeId: 'tgbNymZ7vqY', duration: '1:20:00', views: '50K', category: 'Popular' },
  { id: '7', title: 'Advanced React Patterns', youtubeId: 'dQw4w9WgXcQ', duration: '25:30', views: '5.5K', category: 'Featured' },
  { id: '8', title: 'Building Scalable APIs', youtubeId: 'tgbNymZ7vqY', duration: '35:45', views: '4.2K', category: 'Featured' },
];

const categories = [
  { id: 'Recent', title: 'Recent Videos', icon: Clock },
  { id: 'Weekly', title: 'Weekly Highlights', icon: Star },
  { id: 'Popular', title: 'Most Popular', icon: TrendingUp },
  { id: 'Featured', title: 'Featured Content', icon: PlayCircle },
];

export default function Videos() {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-4">Video Library</h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Explore our collection of educational videos, tutorials, and highlights.
          </p>
        </div>

        {/* Active Video Player */}
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 bg-zinc-50 dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-gold-200/50 dark:border-gold-900/30"
          >
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 rounded-full text-sm font-medium border border-gold-200 dark:border-gold-800/50">
                  {activeVideo.category}
                </span>
                <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-sm space-x-4">
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {activeVideo.duration}</span>
                  <span className="flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> {activeVideo.views} views</span>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white">{activeVideo.title}</h2>
            </div>
          </motion.div>
        )}

        {/* Video Categories */}
        <div className="space-y-16">
          {categories.map((category) => {
            const categoryVideos = mockVideos.filter(v => v.category === category.id);
            if (categoryVideos.length === 0) return null;

            const Icon = category.icon;

            return (
              <div key={category.id}>
                <div className="flex items-center mb-8 border-b border-gold-200/50 dark:border-gold-900/30 pb-4">
                  <div className="p-3 bg-gold-100 dark:bg-gold-900/30 rounded-xl mr-4 text-gold-600 dark:text-gold-400 border border-gold-200 dark:border-gold-800/50">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-black dark:text-white">{category.title}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categoryVideos.map((video, index) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`group cursor-pointer bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden border transition-all duration-300 ${
                        activeVideo?.id === video.id 
                          ? 'border-gold-500 shadow-lg shadow-gold-500/20 ring-2 ring-gold-500/50' 
                          : 'border-gold-200/50 dark:border-gold-900/30 hover:border-gold-400 dark:hover:border-gold-600 hover:shadow-md'
                      }`}
                      onClick={() => {
                        setActiveVideo(video);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <div className="relative aspect-video bg-black overflow-hidden">
                        <img
                          src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-gold-500 group-hover:text-black text-white transition-colors duration-300 shadow-lg">
                            <PlayCircle className="w-6 h-6" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium backdrop-blur-sm">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-black dark:text-white line-clamp-2 mb-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                          {video.title}
                        </h3>
                        <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400">
                          <span>{video.views} views</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
