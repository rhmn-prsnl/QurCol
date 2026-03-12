import React, { useState } from 'react';
import { Save, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  content: string;
  image?: string;
}

interface PageContent {
  [key: string]: Section[];
}

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'home', name: 'Home Page' },
    { id: 'about', name: 'About Page' },
    { id: 'privacy', name: 'Privacy Policy' },
    { id: 'terms', name: 'Terms & Conditions' },
    { id: 'contact', name: 'Contact Info' },
  ];

  const [contentData, setContentData] = useState<PageContent>({
    home: [
      { id: '1', title: 'Hero Section', content: 'Unlock Your Potential with EduLMS. Discover a world of knowledge with our expert-led courses. Learn at your own pace, anytime, anywhere.', image: '' },
      { id: '2', title: 'Features Section', content: 'Learn from the best. Flexible learning. Get certified.', image: '' }
    ],
    about: [
      { id: '1', title: 'Our Mission', content: 'To provide accessible, high-quality education to everyone, everywhere.', image: '' },
      { id: '2', title: 'Our Vision', content: 'A world where education is a fundamental right, not a privilege.', image: '' },
      { id: '3', title: 'Our Team', content: 'We are a group of passionate educators and technologists.', image: '' }
    ],
    privacy: [
      { id: '1', title: 'Data Collection', content: 'We collect information to provide better services to our users.', image: '' },
      { id: '2', title: 'Data Usage', content: 'Your data is used to personalize your learning experience.', image: '' }
    ],
    terms: [
      { id: '1', title: 'User Agreement', content: 'By using our platform, you agree to these terms.', image: '' },
      { id: '2', title: 'Account Rules', content: 'You are responsible for maintaining the security of your account.', image: '' }
    ],
    contact: [
      { id: '1', title: 'Get in Touch', content: 'We would love to hear from you. Please reach out with any questions or feedback.', image: '' },
      { id: '2', title: 'Office Location', content: '123 Education Lane, Knowledge City, ED 12345', image: '' }
    ]
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Content saved successfully!');
    }, 1000);
  };

  const handleSectionChange = (pageId: string, sectionId: string, field: keyof Section, value: string) => {
    setContentData(prev => ({
      ...prev,
      [pageId]: prev[pageId].map(section => 
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    }));
  };

  const addSection = (pageId: string) => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: 'New Section',
      content: '',
      image: ''
    };
    setContentData(prev => ({
      ...prev,
      [pageId]: [...prev[pageId], newSection]
    }));
  };

  const removeSection = (pageId: string, sectionId: string) => {
    setContentData(prev => ({
      ...prev,
      [pageId]: prev[pageId].filter(section => section.id !== sectionId)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black dark:text-white">Site Content Management</h1>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors disabled:opacity-70"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-black dark:text-white capitalize">{tabs.find(t => t.id === activeTab)?.name} Content</h2>
          <button 
            onClick={() => addSection(activeTab)}
            className="flex items-center px-3 py-1.5 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Section
          </button>
        </div>

        <div className="space-y-8">
          {contentData[activeTab]?.map((section, index) => (
            <div key={section.id} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-black relative">
              <button 
                onClick={() => removeSection(activeTab, section.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-600 p-1"
                title="Remove Section"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              
              <h3 className="text-lg font-medium text-black dark:text-white mb-4">Section {index + 1}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Section Title</label>
                  <input 
                    type="text" 
                    value={section.title}
                    onChange={(e) => handleSectionChange(activeTab, section.id, 'title', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white focus:ring-2 focus:ring-gold-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Section Content</label>
                  <textarea 
                    rows={4} 
                    value={section.content}
                    onChange={(e) => handleSectionChange(activeTab, section.id, 'content', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white focus:ring-2 focus:ring-gold-500 resize-y"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Section Image (Optional)</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center justify-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                      <ImageIcon className="w-5 h-5 mr-2 text-zinc-500" />
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Upload Image</span>
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      Recommended: 1920x1080px, Max 2MB (JPG, PNG, WebP)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {(!contentData[activeTab] || contentData[activeTab].length === 0) && (
            <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
              No sections found. Click "Add Section" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
