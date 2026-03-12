import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Share2, Facebook, Twitter, Linkedin, X } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format for easy comparison
  type: string;
  description: string;
}

const mockEvents: Event[] = [
  { id: '1', title: 'Web Development Bootcamp', date: '2026-03-11', type: 'Online Workshop', description: 'Join us for an intensive 3-day bootcamp covering the latest in React and Node.js.' }, // Live (assuming today is 2026-03-11)
  { id: '2', title: 'AI in Education Summit', date: '2026-04-02', type: 'Virtual Conference', description: 'Explore how artificial intelligence is shaping the future of online learning.' }, // Upcoming
  { id: '3', title: 'Career Guidance Session', date: '2026-04-20', type: 'Live Q&A', description: 'Get expert advice on building a successful career in the tech industry.' }, // Upcoming
  { id: '4', title: 'React Native Masterclass', date: '2026-01-10', type: 'Online Workshop', description: 'Learn to build cross-platform mobile apps with React Native.' }, // Past
];

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Use current date for logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const liveEvents = mockEvents.filter(e => {
    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  });

  const upcomingEvents = mockEvents.filter(e => {
    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() > today.getTime();
  });

  const pastEvents = mockEvents.filter(e => {
    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() < today.getTime();
  });

  const handleRegisterClick = (event: Event) => {
    setSelectedEvent(event);
    setSubmitSuccess(false);
    setFormData({ name: '', email: '', phone: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock email sending
    setTimeout(() => {
      console.log('Sending email to admin with details:', {
        event: selectedEvent?.title,
        ...formData
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSelectedEvent(null);
      }, 2000);
    }, 1000);
  };

  const shareEvent = (platform: string, event: Event) => {
    // Mock sharing
    console.log(`Sharing ${event.title} on ${platform}`);
    alert(`Shared "${event.title}" on ${platform}`);
  };

  const renderEventCard = (event: Event, isPast: boolean) => {
    const eventDate = new Date(event.date);
    const month = eventDate.toLocaleString('default', { month: 'short' });
    const day = eventDate.getDate();
    const year = eventDate.getFullYear();

    return (
      <motion.div
        key={event.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row items-start sm:items-center p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-gold-100 dark:border-gold-900/20 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex-shrink-0 w-24 h-24 bg-gold-100 dark:bg-gold-900/30 rounded-lg flex flex-col items-center justify-center text-gold-600 dark:text-gold-400 border border-gold-200 dark:border-gold-800/50 mb-4 sm:mb-0">
          <span className="text-sm font-bold uppercase">{month}</span>
          <span className="text-3xl font-bold">{day}</span>
          <span className="text-xs font-medium">{year}</span>
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
          <p className="text-zinc-600 dark:text-zinc-300 mb-4">
            {event.description}
          </p>
          
          {!isPast && (
            <div className="flex items-center space-x-3 text-zinc-500 dark:text-zinc-400">
              <span className="text-sm font-medium flex items-center"><Share2 className="w-4 h-4 mr-1" /> Share:</span>
              <button onClick={() => shareEvent('Facebook', event)} className="hover:text-blue-600 transition-colors"><Facebook className="w-4 h-4" /></button>
              <button onClick={() => shareEvent('Twitter', event)} className="hover:text-blue-400 transition-colors"><Twitter className="w-4 h-4" /></button>
              <button onClick={() => shareEvent('LinkedIn', event)} className="hover:text-blue-700 transition-colors"><Linkedin className="w-4 h-4" /></button>
            </div>
          )}
        </div>
        {!isPast && (
          <div className="mt-4 sm:mt-0 sm:ml-6 self-start sm:self-center w-full sm:w-auto">
            <button 
              onClick={() => handleRegisterClick(event)}
              className="w-full sm:w-auto px-6 py-3 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors text-sm font-medium shadow-sm shadow-gold-900/20"
            >
              Register Now
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-black dark:text-white mb-4 tracking-tight"
          >
            Events
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            Join our events, workshops, and conferences to expand your knowledge and network.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Live Events */}
          {liveEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6 border-b border-gold-200/50 dark:border-gold-900/30 pb-2 flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></span>
                Live Event
              </h2>
              <div className="space-y-6">
                {liveEvents.map(event => renderEventCard(event, false))}
              </div>
            </div>
          )}

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6 border-b border-gold-200/50 dark:border-gold-900/30 pb-2">
                Upcoming Events
              </h2>
              <div className="space-y-6">
                {upcomingEvents.map(event => renderEventCard(event, false))}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6 border-b border-gold-200/50 dark:border-gold-900/30 pb-2 opacity-70">
                Past Events
              </h2>
              <div className="space-y-6 opacity-70">
                {pastEvents.map(event => renderEventCard(event, true))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gold-200/50 dark:border-gold-900/30"
            >
              <div className="flex justify-between items-center p-6 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-xl font-bold text-black dark:text-white">Register for Event</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-6 p-4 bg-gold-50 dark:bg-gold-900/10 rounded-lg border border-gold-100 dark:border-gold-900/20">
                  <p className="text-sm font-medium text-gold-800 dark:text-gold-400 mb-1">Selected Event:</p>
                  <p className="text-black dark:text-white font-bold">{selectedEvent.title}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{selectedEvent.date}</p>
                </div>

                {submitSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h4 className="text-xl font-bold text-black dark:text-white mb-2">Registration Successful!</h4>
                    <p className="text-zinc-600 dark:text-zinc-400">We've received your details and will contact you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
                      <input 
                        required 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email Address</label>
                      <input 
                        required 
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Phone Number</label>
                      <input 
                        required 
                        type="tel" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors" 
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-3 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors font-bold shadow-sm shadow-gold-900/20 disabled:opacity-70 mt-4"
                    >
                      {isSubmitting ? 'Submitting...' : 'Confirm Registration'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
