import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, Settings, FileText } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Site Content', path: '/admin/dashboard/content', icon: FileText },
    { name: 'Pop-ups', path: '/admin/dashboard/popups', icon: Settings },
    { name: 'Courses & Videos', path: '/admin/dashboard/courses', icon: BookOpen },
    { name: 'Students', path: '/admin/dashboard/users', icon: Users },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-white dark:bg-black">
      {/* Mobile Nav */}
      <div className="md:hidden bg-zinc-50 dark:bg-zinc-900 border-b border-gold-200/50 dark:border-gold-900/30 overflow-x-auto">
        <ul className="flex p-2 space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-gold-50 text-gold-600 dark:bg-gold-900/20 dark:text-gold-400 border border-gold-200 dark:border-gold-800/50'
                      : 'text-zinc-700 hover:bg-white dark:text-zinc-300 dark:hover:bg-black border border-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5 transition duration-75" />
                  <span className="ml-2 text-sm">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-zinc-50 dark:bg-zinc-900 border-r border-gold-200/50 dark:border-gold-900/30 hidden md:block shrink-0">
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gold-50 text-gold-600 dark:bg-gold-900/20 dark:text-gold-400 border border-gold-200 dark:border-gold-800/50'
                        : 'text-zinc-700 hover:bg-white dark:text-zinc-300 dark:hover:bg-black border border-transparent'
                    }`}
                  >
                    <Icon className="w-5 h-5 transition duration-75" />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
