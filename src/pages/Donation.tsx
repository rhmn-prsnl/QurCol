import React from 'react';
import { motion } from 'motion/react';
import { Heart, CreditCard, DollarSign } from 'lucide-react';

export default function Donation() {
  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-black dark:text-white mb-4 tracking-tight"
          >
            Support Our Mission
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            Your generous donation helps us provide quality education to students worldwide, regardless of their financial background.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 bg-gold-500 text-black flex flex-col justify-center">
                <Heart className="h-16 w-16 mb-6 text-black/80" />
                <h2 className="text-3xl font-bold mb-4">Make a Difference Today</h2>
                <p className="text-black/80 mb-6 text-lg">
                  Every contribution, big or small, goes directly towards creating new courses, improving our platform, and offering scholarships to those in need.
                </p>
                <ul className="space-y-3 font-medium">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                    Fund new course development
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                    Provide student scholarships
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                    Improve platform accessibility
                  </li>
                </ul>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Donation Details</h3>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Select Amount
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {['₹500', '₹1000', '₹2500', '₹5000', '₹10000', 'Custom'].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          className="py-3 px-4 border border-gold-200 dark:border-gold-800/50 rounded-lg bg-white dark:bg-black text-black dark:text-white hover:bg-gold-50 dark:hover:bg-gold-900/20 hover:border-gold-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500"
                        >
                          {amount}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="block w-full px-4 py-3 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="block w-full px-4 py-3 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <button
                    type="button"
                    className="w-full flex justify-center items-center py-4 px-4 border border-transparent text-lg font-medium rounded-lg text-black bg-gold-500 hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-colors shadow-sm shadow-gold-900/20"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Proceed to Donate
                  </button>
                  <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 mt-4">
                    Secure payment processing. You will be redirected to our payment gateway.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
