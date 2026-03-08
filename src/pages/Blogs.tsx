import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, User } from 'lucide-react';
import { News as NewsType } from '../types';

export default function Blogs() {
  const [blogs, setBlogs] = useState<NewsType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-black dark:text-white mb-4 tracking-tight"
          >
            Latest Blogs & Articles
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            Read our latest thoughts, insights, and educational articles.
          </motion.p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((item, index) => (
              <motion.article 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-gold-200/50 dark:border-gold-900/30 flex flex-col"
              >
                <div className="relative h-48">
                  <img 
                    src={item.image || `https://picsum.photos/seed/${item.id}/800/400`} 
                    alt={item.title} 
                    className="w-full h-full object-cover grayscale-[20%]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-gold-400 border border-gold-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {item.category || 'Update'}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 mb-4 space-x-4">
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-gold-500" /> {new Date(item.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center"><User className="w-4 h-4 mr-1 text-gold-500" /> Admin</span>
                  </div>
                  <h2 className="text-xl font-bold text-black dark:text-white mb-3 line-clamp-2 hover:text-gold-600 dark:hover:text-gold-400 transition-colors">
                    <a href={`/blogs/${item.id}`}>{item.title}</a>
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-4 flex-grow">
                    {item.content}
                  </p>
                  <a href={`/blogs/${item.id}`} className="text-gold-600 dark:text-gold-400 font-medium hover:underline inline-flex items-center">
                    Read more
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-gold-200/50 dark:border-gold-900/30">
            <h3 className="text-lg font-medium text-black dark:text-white mb-2">No blog posts yet</h3>
            <p className="text-zinc-500 dark:text-zinc-400">Check back later for articles.</p>
          </div>
        )}
      </div>
    </div>
  );
}
