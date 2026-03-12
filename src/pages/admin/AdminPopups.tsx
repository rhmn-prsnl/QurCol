import React, { useState } from 'react';
import { Settings, Plus, Trash2, Edit2, Save } from 'lucide-react';

export default function AdminPopups() {
  const [popups, setPopups] = useState([
    {
      id: 1,
      name: 'Summer Sale',
      active: true,
      startDate: '2026-06-01',
      endDate: '2026-06-30',
      frequency: 'once_per_session',
      delay: 5,
      content: 'Get 50% off all courses this summer!',
      imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80',
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black dark:text-white">Pop-up Management</h1>
        <button className="flex items-center px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Create New Pop-up
        </button>
      </div>

      <div className="grid gap-6">
        {popups.map((popup) => (
          <div key={popup.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-black dark:text-white flex items-center">
                  {popup.name}
                  <span className={`ml-3 px-2 py-1 text-xs rounded-full ${popup.active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                    {popup.active ? 'Active' : 'Inactive'}
                  </span>
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {popup.startDate} to {popup.endDate}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-zinc-400 hover:text-gold-500 transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Display Frequency</label>
                  <select className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white" defaultValue={popup.frequency}>
                    <option value="always">Every time page loads</option>
                    <option value="once_per_session">Once per session</option>
                    <option value="once_per_user">Once per user</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Delay (seconds)</label>
                  <input type="number" defaultValue={popup.delay} className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Message Content</label>
                  <textarea rows={3} defaultValue={popup.content} className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white"></textarea>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Popup Image (Optional)</label>
                  <div className="flex flex-col space-y-2">
                    <label className="flex items-center justify-center px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors w-full">
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Upload Image</span>
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      Recommended: 600x400px, Max 1MB (JPG, PNG, WebP)
                    </span>
                  </div>
                </div>
                {popup.imageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 h-32 relative">
                    <img src={popup.imageUrl} alt="Popup preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
               <button className="flex items-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
