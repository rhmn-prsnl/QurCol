import React, { useState } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';

export default function AdminActivities() {
  const [activities, setActivities] = useState([
    {
      id: '1',
      title: 'Annual Tech Symposium',
      date: '2026-03-15',
      description: 'A gathering of tech enthusiasts to discuss the latest trends in AI and Web Development.',
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
    }
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newActivity, setNewActivity] = useState({ title: '', date: '', description: '', thumbnail: '', youtubeLink: '' });

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const activity = {
      ...newActivity,
      id: Date.now().toString()
    };
    setActivities([...activities, activity]);
    setIsAdding(false);
    setNewActivity({ title: '', date: '', description: '', thumbnail: '', youtubeLink: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      setActivities(activities.filter(a => a.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">Manage Activities</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors shadow-sm shadow-gold-900/20 font-medium"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Activity
        </button>
      </div>

      {isAdding && (
        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 mb-8">
          <h2 className="text-lg font-bold text-black dark:text-white mb-4">Add New Activity</h2>
          <form onSubmit={handleAddActivity} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Title</label>
                <input required type="text" value={newActivity.title} onChange={e => setNewActivity({...newActivity, title: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Date</label>
                <input required type="date" value={newActivity.date} onChange={e => setNewActivity({...newActivity, date: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Thumbnail Image</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center justify-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                    <ImageIcon className="w-5 h-5 mr-2 text-zinc-500" />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Upload Image</span>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Recommended: 800x600px, Max 2MB (JPG, PNG, WebP)
                  </span>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">YouTube Link (Optional)</label>
                <input type="url" value={newActivity.youtubeLink} onChange={e => setNewActivity({...newActivity, youtubeLink: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea required rows={3} value={newActivity.description} onChange={e => setNewActivity({...newActivity, description: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors shadow-sm shadow-gold-900/20 font-medium">Save Activity</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
            <thead className="text-xs text-zinc-700 uppercase bg-white dark:bg-black dark:text-zinc-300 border-b border-gold-200/50 dark:border-gold-900/30">
              <tr>
                <th scope="col" className="px-6 py-3">Activity</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map(activity => (
                <tr key={activity.id} className="bg-zinc-50 border-b border-gold-100 dark:bg-zinc-900 dark:border-gold-900/20 hover:bg-white dark:hover:bg-black transition-colors">
                  <td className="px-6 py-4 font-medium text-black dark:text-white flex items-center gap-3">
                    <img src={activity.thumbnail || `https://picsum.photos/seed/${activity.id}/100/100`} alt="" className="w-10 h-10 rounded object-cover grayscale-[20%]" referrerPolicy="no-referrer" />
                    {activity.title}
                  </td>
                  <td className="px-6 py-4">{new Date(activity.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-zinc-600 dark:text-zinc-400 hover:underline mr-3" title="Edit">
                      <Edit className="w-4 h-4 inline" />
                    </button>
                    <button onClick={() => handleDelete(activity.id)} className="text-red-600 dark:text-red-400 hover:underline" title="Delete">
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
