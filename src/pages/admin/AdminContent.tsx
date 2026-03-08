import React, { useState } from 'react';
import { Save, Image as ImageIcon, Type, Layout } from 'lucide-react';

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', name: 'Home Page' },
    { id: 'about', name: 'About Page' },
    { id: 'privacy', name: 'Privacy Policy' },
    { id: 'terms', name: 'Terms & Conditions' },
    { id: 'contact', name: 'Contact Info' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black dark:text-white">Site Content Management</h1>
        <button className="flex items-center px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="flex space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-gold-500 text-black font-medium'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
        {activeTab === 'home' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Home Page Content</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Hero Title</label>
                <input type="text" defaultValue="Unlock Your Potential with EduLMS" className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Hero Subtitle</label>
                <textarea rows={3} defaultValue="Discover a world of knowledge with our expert-led courses. Learn at your own pace, anytime, anywhere." className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Hero Background Image URL</label>
                <div className="flex items-center space-x-2">
                  <input type="text" defaultValue="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1920" className="flex-1 px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white" />
                  <button className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-gold-500">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'home' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-white capitalize">{activeTab} Page Content</h2>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Page Content (Markdown/HTML)</label>
              <textarea rows={15} defaultValue={`# ${tabs.find(t => t.id === activeTab)?.name}\n\nEdit this content...`} className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white font-mono text-sm"></textarea>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
