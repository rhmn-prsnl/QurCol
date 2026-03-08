import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-black dark:text-white mb-4 tracking-tight"
          >
            About EduLMS
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            We are dedicated to providing accessible, high-quality education to learners worldwide. Our platform connects expert instructors with eager students.
          </motion.p>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30"
          >
            <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 rounded-xl flex items-center justify-center mb-6">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Our Vision</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              To be the leading global platform for accessible, high-quality education, empowering individuals to achieve their full potential and transform their lives through continuous learning.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30"
          >
            <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Our Mission</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              To provide innovative, engaging, and effective learning experiences by partnering with top educators and utilizing cutting-edge technology to deliver courses that meet the needs of today's learners.
            </p>
          </motion.div>
        </div>

        {/* Founder Message */}
        <div className="bg-black border border-gold-900/30 rounded-3xl overflow-hidden shadow-xl mb-20 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-900/20 via-black to-black"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 relative z-10">
            <div className="p-12 flex flex-col justify-center">
              <Award className="w-12 h-12 text-gold-500 mb-6" />
              <h2 className="text-3xl font-bold text-white mb-6">Message from the Founder</h2>
              <blockquote className="text-xl text-gold-100/80 italic mb-6">
                "Education is the most powerful weapon which you can use to change the world. At EduLMS, we believe that everyone deserves access to quality education, regardless of their background or location."
              </blockquote>
              <div>
                <p className="text-white font-bold text-lg">Dr. Sarah Johnson</p>
                <p className="text-gold-400">Founder & CEO</p>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
                alt="Founder" 
                className="absolute inset-0 w-full h-full object-cover grayscale-[30%]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-4">Campus Life</h2>
          <p className="text-zinc-600 dark:text-zinc-400">A glimpse into our vibrant learning community.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400" alt="Students" className="rounded-xl w-full h-48 object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
          <img src="https://images.unsplash.com/photo-1513258496099-4816c02736df?auto=format&fit=crop&q=80&w=400" alt="Library" className="rounded-xl w-full h-48 object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
          <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=400" alt="Graduation" className="rounded-xl w-full h-48 object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
          <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=400" alt="Classroom" className="rounded-xl w-full h-48 object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
        </div>
      </div>
    </div>
  );
}
