import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-gold-200/70 py-12 mt-auto border-t border-gold-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-gold-500" />
              <span className="font-bold text-xl text-white tracking-tight">EduLMS</span>
            </Link>
            <p className="text-sm text-gold-100/60">
              Empowering minds through accessible, high-quality education. Join our community of lifelong learners today.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gold-200/60 hover:text-gold-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gold-200/60 hover:text-gold-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gold-200/60 hover:text-gold-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gold-200/60 hover:text-gold-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-gold-400 font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">Our Courses</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors">Events</Link></li>
              <li><Link to="/blogs" className="hover:text-white transition-colors">Blogs</Link></li>
              <li><Link to="/donation" className="hover:text-white transition-colors">Donation</Link></li>
              <li><Link to="/enquiry" className="hover:text-white transition-colors">Enquiry</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gold-400 font-semibold mb-4 uppercase tracking-wider text-sm">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gold-400 font-semibold mb-4 uppercase tracking-wider text-sm">Contact Info</h3>
            <ul className="space-y-2 text-sm text-gold-100/60">
              <li>123 Education Lane</li>
              <li>Knowledge City, ED 12345</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: info@edulms.com</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gold-900/30 mt-12 pt-8 text-center text-sm text-gold-200/40">
          <p>&copy; {new Date().getFullYear()} EduLMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
