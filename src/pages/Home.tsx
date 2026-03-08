import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, BookOpen, Users, Award, PlayCircle, Calendar, CheckCircle, X, Star } from 'lucide-react';
import { Course } from '../types';

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState<any>(null);
  const [siteContent, setSiteContent] = useState<any>({
    heroTitle: 'Unlock Your Potential with EduLMS',
    heroSubtitle: 'Discover a world of knowledge with our expert-led courses. Learn at your own pace, anytime, anywhere.',
    heroImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1920'
  });

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setFeaturedCourses(data.slice(0, 3)));

    // Mock fetching popup config
    const mockPopup = {
      id: 1,
      name: 'Summer Sale',
      active: true,
      startDate: '2026-06-01',
      endDate: '2026-06-30',
      frequency: 'once_per_session',
      delay: 5,
      content: 'Get 50% off all courses this summer!',
      imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80',
    };
    
    // In a real app, we would check the date range here
    if (mockPopup.active) {
      setPopupConfig(mockPopup);
      
      const hasSeenPopup = sessionStorage.getItem(`hasSeenPopup_${mockPopup.id}`);
      if (!hasSeenPopup || mockPopup.frequency === 'always') {
        const timer = setTimeout(() => {
          setShowPopup(true);
          if (mockPopup.frequency === 'once_per_session') {
            sessionStorage.setItem(`hasSeenPopup_${mockPopup.id}`, 'true');
          } else if (mockPopup.frequency === 'once_per_user') {
            localStorage.setItem(`hasSeenPopup_${mockPopup.id}`, 'true');
          }
        }, mockPopup.delay * 1000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Promotional Popup */}
      <AnimatePresence>
        {showPopup && popupConfig && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gold-200/50 dark:border-gold-900/30 overflow-hidden"
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              {popupConfig.imageUrl && (
                <div className="relative h-48 bg-black">
                  <img
                    src={popupConfig.imageUrl}
                    alt={popupConfig.name}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <span className="px-3 py-1 bg-gold-500 text-black text-xs font-bold uppercase tracking-wider rounded-full mb-2 inline-block">
                      Special Offer
                    </span>
                    <h3 className="text-2xl font-bold text-white">{popupConfig.name}</h3>
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <p className="text-zinc-600 dark:text-zinc-300 mb-6 whitespace-pre-line">
                  {popupConfig.content}
                </p>
                <div className="flex gap-4">
                  <Link
                    to="/courses"
                    onClick={() => setShowPopup(false)}
                    className="flex-1 text-center px-4 py-3 bg-gold-500 hover:bg-gold-400 text-black font-medium rounded-lg transition-colors shadow-lg shadow-gold-900/20"
                  >
                    Browse Courses
                  </Link>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="flex-1 px-4 py-3 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={siteContent.heroImage}
            alt="Students learning"
            className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600 drop-shadow-sm">
              {siteContent.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-gold-100/80 mb-8 max-w-xl">
              {siteContent.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-black bg-gold-500 hover:bg-gold-400 transition-colors shadow-lg shadow-gold-900/20"
              >
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-6 py-3 border border-gold-500/50 text-base font-medium rounded-lg text-gold-100 hover:bg-gold-900/30 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Highlights Section */}
      <section className="py-16 bg-zinc-50 dark:bg-black border-b border-gold-200/50 dark:border-gold-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gold-100 dark:border-gold-900/20 shadow-sm"
            >
              <div className="mx-auto w-12 h-12 bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-black dark:text-white mb-2">1000+</h3>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium uppercase tracking-wider text-sm">Alumni Graduated</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gold-100 dark:border-gold-900/20 shadow-sm"
            >
              <div className="mx-auto w-12 h-12 bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-black dark:text-white mb-2">50+</h3>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium uppercase tracking-wider text-sm">Courses Offered</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gold-100 dark:border-gold-900/20 shadow-sm"
            >
              <div className="mx-auto w-12 h-12 bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 rounded-full flex items-center justify-center mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-black dark:text-white mb-2">50+</h3>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium uppercase tracking-wider text-sm">Trained Faculties</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gold-100 dark:border-gold-900/20 shadow-sm"
            >
              <div className="mx-auto w-12 h-12 bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 rounded-full flex items-center justify-center mb-4">
                <PlayCircle className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-black dark:text-white mb-2">25+</h3>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium uppercase tracking-wider text-sm">Years of Service</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">Featured Courses</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Start your learning journey with our most popular and highly-rated courses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
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
                    to={`/courses`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gold-500/50 rounded-lg shadow-sm text-sm font-medium text-black dark:text-white hover:bg-gold-50 dark:hover:bg-gold-900/20 transition-colors"
                  >
                    View Course
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center justify-center px-6 py-3 border border-gold-300 dark:border-gold-700 rounded-lg text-base font-medium text-black dark:text-white hover:bg-gold-50 dark:hover:bg-gold-900/20 transition-colors"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Free Courses (YouTube) */}
      <section className="py-20 bg-zinc-50 dark:bg-black border-t border-gold-200/50 dark:border-gold-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">Free Courses</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Start learning right now with our full-length free crash courses on YouTube.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 'w7ejDZ8SWv8', title: 'React JS Crash Course', instructor: 'Traversy Media' },
              { id: 'TlB_eWDSMt4', title: 'Node.js Tutorial for Beginners', instructor: 'Programming with Mosh' },
              { id: 'kqtD5dpn9C8', title: 'Python for Beginners - Full Course', instructor: 'Programming with Mosh' }
            ].map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gold-200/50 dark:border-gold-900/30 flex flex-col"
              >
                <div className="relative aspect-video w-full">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-black dark:text-white mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 mt-auto">
                    <Users className="h-4 w-4 mr-1 text-gold-500" /> {video.instructor}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 bg-white dark:bg-zinc-950 border-t border-gold-200/50 dark:border-gold-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">Upcoming Events</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Join our upcoming events and expand your knowledge.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {[
                { title: 'Web Development Bootcamp', date: 'Oct 15, 2026', type: 'Online Workshop' },
                { title: 'AI in Education Summit', date: 'Nov 02, 2026', type: 'Virtual Conference' },
                { title: 'Career Guidance Session', date: 'Nov 20, 2026', type: 'Live Q&A' }
              ].map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-gold-100 dark:border-gold-900/20 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 w-20 h-20 bg-gold-100 dark:bg-gold-900/30 rounded-lg flex flex-col items-center justify-center text-gold-600 dark:text-gold-400 border border-gold-200 dark:border-gold-800/50">
                    <span className="text-sm font-bold uppercase">{event.date.split(' ')[0]}</span>
                    <span className="text-2xl font-bold">{event.date.split(' ')[1].replace(',', '')}</span>
                  </div>
                  <div className="ml-6 flex-grow">
                    <h4 className="text-xl font-bold text-black dark:text-white mb-1">{event.title}</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" /> {event.date}
                    </p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-100 text-gold-800 dark:bg-gold-900/30 dark:text-gold-300">
                      {event.type}
                    </span>
                  </div>
                  <div className="ml-4 self-center">
                    <button className="px-4 py-2 border border-gold-500 text-gold-600 dark:text-gold-400 rounded-lg hover:bg-gold-50 dark:hover:bg-gold-900/20 transition-colors text-sm font-medium">
                      Register
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Videos (YouTube) */}
      <section className="py-20 bg-white dark:bg-zinc-950 border-t border-gold-200/50 dark:border-gold-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">Latest Videos</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Stay up to date with the latest technologies, tips, and tricks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 'jMy4pVZMyLM', title: 'Next.js 14 Full Course 2024', instructor: 'JavaScript Mastery' },
              { id: 'UBOj6rqRUME', title: 'Tailwind CSS Full Course', instructor: 'Dave Gray' },
              { id: 'BwuLxPH8IDs', title: 'TypeScript Crash Course', instructor: 'Traversy Media' }
            ].map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gold-200/50 dark:border-gold-900/30 flex flex-col"
              >
                <div className="relative aspect-video w-full">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-black dark:text-white mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 mt-auto">
                    <PlayCircle className="h-4 w-4 mr-1 text-gold-500" /> {video.instructor}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 bg-zinc-50 dark:bg-black border-t border-gold-200/50 dark:border-gold-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-black dark:text-white mb-6">Why Choose Us?</h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                We are dedicated to providing world-class education accessible to everyone. Our platform is built on the principles of quality, flexibility, and community.
              </p>
              <ul className="space-y-4">
                {[
                  'Industry-expert instructors with real-world experience',
                  'Flexible learning schedules tailored to your lifestyle',
                  'Interactive and practical hands-on projects',
                  'Dedicated mentorship and career guidance',
                  'Lifetime access to course materials and updates'
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-gold-500 mr-3 flex-shrink-0" />
                    <span className="text-zinc-700 dark:text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border border-gold-200/50 dark:border-gold-900/30">
                <img
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000"
                  alt="Students collaborating"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl border border-gold-100 dark:border-gold-900/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900/30 rounded-full flex items-center justify-center text-gold-600 dark:text-gold-400">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-black dark:text-white">#1</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Rated Platform</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-zinc-950 border-t border-gold-200/50 dark:border-gold-900/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-4">What Our Students Say</h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Don't just take our word for it. Hear from our successful alumni.
          </p>
        </div>

        <div className="relative w-full flex overflow-x-hidden">
          <div className="animate-marquee flex whitespace-nowrap py-4">
            {[
              { name: 'Sarah Johnson', role: 'Frontend Developer', text: 'The React course completely transformed my career. I landed my dream job within 2 months of graduating.' },
              { name: 'Michael Chen', role: 'Data Scientist', text: 'The instructors are top-notch. They explain complex concepts in a way that is easy to understand and apply.' },
              { name: 'Emily Rodriguez', role: 'UX Designer', text: 'I loved the flexibility of the platform. Being able to learn at my own pace while working full-time was crucial.' },
              { name: 'David Smith', role: 'Software Engineer', text: 'The hands-on projects gave me the practical experience I needed to feel confident in interviews.' },
              { name: 'Jessica Lee', role: 'Product Manager', text: 'EduLMS provided a structured learning path that kept me motivated and on track to achieve my goals.' }
            ].map((testimonial, i) => (
              <div key={i} className="inline-block w-80 md:w-96 mx-4 whitespace-normal">
                <div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl border border-gold-100 dark:border-gold-900/20 shadow-sm h-full flex flex-col">
                  <div className="flex text-gold-500 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 italic mb-6 flex-grow">"{testimonial.text}"</p>
                  <div className="flex items-center mt-auto">
                    <div className="w-10 h-10 rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 flex items-center justify-center font-bold border border-gold-200 dark:border-gold-800/50">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-bold text-black dark:text-white">{testimonial.name}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Duplicate for seamless looping */}
          <div className="animate-marquee flex whitespace-nowrap py-4" aria-hidden="true">
            {[
              { name: 'Sarah Johnson', role: 'Frontend Developer', text: 'The React course completely transformed my career. I landed my dream job within 2 months of graduating.' },
              { name: 'Michael Chen', role: 'Data Scientist', text: 'The instructors are top-notch. They explain complex concepts in a way that is easy to understand and apply.' },
              { name: 'Emily Rodriguez', role: 'UX Designer', text: 'I loved the flexibility of the platform. Being able to learn at my own pace while working full-time was crucial.' },
              { name: 'David Smith', role: 'Software Engineer', text: 'The hands-on projects gave me the practical experience I needed to feel confident in interviews.' },
              { name: 'Jessica Lee', role: 'Product Manager', text: 'EduLMS provided a structured learning path that kept me motivated and on track to achieve my goals.' }
            ].map((testimonial, i) => (
              <div key={`dup-${i}`} className="inline-block w-80 md:w-96 mx-4 whitespace-normal">
                <div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl border border-gold-100 dark:border-gold-900/20 shadow-sm h-full flex flex-col">
                  <div className="flex text-gold-500 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 italic mb-6 flex-grow">"{testimonial.text}"</p>
                  <div className="flex items-center mt-auto">
                    <div className="w-10 h-10 rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 flex items-center justify-center font-bold border border-gold-200 dark:border-gold-800/50">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-bold text-black dark:text-white">{testimonial.name}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black border-t border-gold-900/30 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-900/20 via-black to-black"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start learning?</h2>
          <p className="text-gold-100/70 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students and transform your career with our industry-leading courses.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-black bg-gold-500 hover:bg-gold-400 transition-colors shadow-lg shadow-gold-900/20"
          >
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
}
