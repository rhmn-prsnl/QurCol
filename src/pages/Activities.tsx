import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, X, Maximize2, PlayCircle } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  thumbnail: string;
  images: string[];
  youtubeLink?: string;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Annual Tech Symposium 2026',
    description: 'A gathering of tech enthusiasts to discuss the future of AI and machine learning. We had guest speakers from top tech companies and interactive workshops.',
    date: '2026-02-15',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80'
    ],
    youtubeLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: '2',
    title: 'Community Outreach Program',
    description: 'Our students and faculty volunteered to teach basic computer skills to underprivileged children in the local community.',
    date: '2026-01-20',
    thumbnail: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80'
    ]
  },
  {
    id: '3',
    title: 'Hackathon: Code for Good',
    description: 'A 48-hour coding marathon where students built solutions for environmental sustainability.',
    date: '2025-11-10',
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80'
    ],
    youtubeLink: 'https://www.youtube.com/embed/tgbNymZ7vqY'
  }
];

export default function Activities() {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-4">Our Activities</h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Explore the recent events, workshops, and community programs we've organized.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6 border-b border-gold-200/50 dark:border-gold-900/30 pb-2">
            Recent Activities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border border-gold-200/50 dark:border-gold-900/30 group"
                onClick={() => setSelectedActivity(activity)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={activity.thumbnail}
                    alt={activity.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-gold-500 text-black px-4 py-2 rounded-full font-medium shadow-lg">
                      View Details
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(activity.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h3 className="text-xl font-bold text-black dark:text-white mb-2 line-clamp-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                    {activity.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 line-clamp-3">
                    {activity.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Detail Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedActivity(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gold-200/50 dark:border-gold-900/30"
            >
              <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md">
                <h2 className="text-2xl font-bold text-black dark:text-white pr-8">{selectedActivity.title}</h2>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="p-2 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-8">
                <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                  <Calendar className="w-5 h-5 mr-2 text-gold-500" />
                  {new Date(selectedActivity.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                
                <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {selectedActivity.description}
                </p>

                {selectedActivity.youtubeLink && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-black dark:text-white flex items-center">
                      <PlayCircle className="w-6 h-6 mr-2 text-gold-500" />
                      Video Highlight
                    </h3>
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800">
                      <iframe
                        src={selectedActivity.youtubeLink}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      ></iframe>
                    </div>
                  </div>
                )}

                {selectedActivity.images && selectedActivity.images.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-black dark:text-white flex items-center">
                      <Maximize2 className="w-6 h-6 mr-2 text-gold-500" />
                      Gallery
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedActivity.images.map((img, idx) => (
                        <div 
                          key={idx} 
                          className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group border border-zinc-200 dark:border-zinc-800"
                          onClick={() => setFullscreenImage(img)}
                        >
                          <img 
                            src={img} 
                            alt={`Gallery image ${idx + 1}`} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            onClick={() => setFullscreenImage(null)}
          >
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-6 right-6 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={fullscreenImage}
              alt="Fullscreen view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
