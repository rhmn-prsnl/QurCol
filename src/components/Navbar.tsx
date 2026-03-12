import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Sun, Moon, BookOpen } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Our Activities', path: '/activities' },
    { name: 'Videos', path: '/videos' },
    { name: 'Events', path: '/events' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Donation', path: '/donation' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-black border-b border-gold-200/50 dark:border-gold-900/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-gold-500 dark:text-gold-400" />
              <span className="font-bold text-xl tracking-tight text-black dark:text-white">EduLMS</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-gold-600 dark:text-gold-400'
                    : 'text-zinc-600 hover:text-gold-600 dark:text-zinc-300 dark:hover:text-gold-400'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="flex items-center space-x-4 border-l border-zinc-200 dark:border-zinc-800 pl-4">
              <Link
                to="/inquiry"
                className="px-4 py-2 text-sm font-medium text-black bg-gold-500 hover:bg-gold-400 rounded-lg transition-colors"
              >
                Inquiry
              </Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to={(user.role === 'admin' || user.role === 'super_admin') ? '/admin' : '/dashboard'}
                    className="text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:text-gold-600 dark:hover:text-gold-400"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-medium text-black bg-gold-500 hover:bg-gold-400 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-black bg-gold-500 hover:bg-gold-400 rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-gold-50 text-gold-600 dark:bg-gold-900/20 dark:text-gold-400'
                    : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/inquiry"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 mt-4 rounded-md text-base font-medium text-black bg-gold-500 hover:bg-gold-400 text-center transition-colors"
            >
              Inquiry
            </Link>
            {user ? (
              <>
                <Link
                  to={(user.role === 'admin' || user.role === 'super_admin') ? '/admin' : '/dashboard'}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="block w-full text-center px-3 py-2 mt-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-500 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 mt-2 rounded-md text-base font-medium text-black bg-gold-500 hover:bg-gold-400 text-center transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
