import React from 'react';
import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';

export default function Events() {
  const events = [
    { title: 'Web Development Bootcamp', date: 'Oct 15, 2026', type: 'Online Workshop', description: 'Join us for an intensive 3-day bootcamp covering the latest in React and Node.js.' },
    { title: 'AI in Education Summit', date: 'Nov 02, 2026', type: 'Virtual Conference', description: 'Explore how artificial intelligence is shaping the future of online learning.' },
    { title: 'Career Guidance Session', date: 'Nov 20, 2026', type: 'Live Q&A', description: 'Get expert advice on building a successful career in the tech industry.' },
    { title: 'React Native Masterclass', date: 'Dec 10, 2026', type: 'Online Workshop', description: 'Learn to build cross-platform mobile apps with React Native.' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-black dark:text-white mb-4 tracking-tight"
          >
            Upcoming Events
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            Join our upcoming events, workshops, and conferences to expand your knowledge and network.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col sm:flex-row items-start sm:items-center p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-gold-100 dark:border-gold-900/20 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 w-24 h-24 bg-gold-100 dark:bg-gold-900/30 rounded-lg flex flex-col items-center justify-center text-gold-600 dark:text-gold-400 border border-gold-200 dark:border-gold-800/50 mb-4 sm:mb-0">
                <span className="text-sm font-bold uppercase">{event.date.split(' ')[0]}</span>
                <span className="text-3xl font-bold">{event.date.split(' ')[1].replace(',', '')}</span>
                <span className="text-xs font-medium">{event.date.split(' ')[2]}</span>
              </div>
              <div className="sm:ml-6 flex-grow">
                <h4 className="text-2xl font-bold text-black dark:text-white mb-2">{event.title}</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" /> {event.date}
                  <span className="mx-2">•</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-100 text-gold-800 dark:bg-gold-900/30 dark:text-gold-300">
                    {event.type}
                  </span>
                </p>
                <p className="text-zinc-600 dark:text-zinc-300">
                  {event.description}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 self-start sm:self-center w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 py-3 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors text-sm font-medium shadow-sm shadow-gold-900/20">
                  Register Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
