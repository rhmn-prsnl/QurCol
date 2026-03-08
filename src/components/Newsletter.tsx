import React from 'react';
import { Mail } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="bg-black text-white py-16 border-t border-gold-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-gold-900/40 to-black border border-gold-500/20 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gold-500/20 rounded-full">
                <Mail className="h-6 w-6 text-gold-400" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Join Us Today</h2>
            </div>
            <p className="text-gold-100/70 text-lg max-w-xl">
              Subscribe to our newsletter to get the latest updates on new courses, exclusive offers, and educational insights delivered straight to your inbox.
            </p>
          </div>
          <div className="w-full md:w-auto flex-1 max-w-md">
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-white/5 border border-gold-500/30 rounded-lg px-4 py-3 text-white placeholder-gold-200/50 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="submit"
                className="bg-gold-500 hover:bg-gold-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </form>
            <p className="text-xs text-gold-200/40 mt-3 text-center sm:text-left">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
