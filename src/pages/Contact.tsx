import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        console.log('Sending email to admin:', {
          datetime: new Date().toLocaleString(),
          ...formData
        });
        console.log(`Sending confirmation email to user: ${formData.email}`);
        setSuccessMessage('Thank you for your message. We will get back to you shortly.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSuccessMessage('Failed to send message. Please try again.');
      }
    } catch (err) {
      setSuccessMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            Have questions about our courses or need support? We're here to help. Reach out to us using the form below or our contact details.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30"
            >
              <h3 className="text-xl font-bold text-black dark:text-white mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center text-gold-600 dark:text-gold-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-medium text-black dark:text-white">Our Location</h4>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      123 Education Lane<br />
                      Knowledge City, ED 12345<br />
                      United States
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center text-gold-600 dark:text-gold-400">
                      <Phone className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-medium text-black dark:text-white">Phone Number</h4>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      +1 (555) 123-4567<br />
                      Mon-Fri 9am-6pm EST
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center text-gold-600 dark:text-gold-400">
                      <Mail className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-medium text-black dark:text-white">Email Address</h4>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      info@edulms.com<br />
                      support@edulms.com
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30"
            >
              <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Send us a Message</h3>
              
              {successMessage && (
                <div className="mb-6 p-4 bg-gold-50 dark:bg-gold-900/20 border-l-4 border-gold-500 rounded-md">
                  <p className="text-gold-700 dark:text-gold-400">{successMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gold-200/50 dark:border-gold-900/30 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gold-200/50 dark:border-gold-900/30 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gold-200/50 dark:border-gold-900/30 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors"
                    placeholder="How can we help?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gold-200/50 dark:border-gold-900/30 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors resize-none"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-black bg-gold-500 hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-colors w-full sm:w-auto disabled:opacity-70"
                  >
                    {isSubmitting ? 'Sending...' : (
                      <>
                        Send Message
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
