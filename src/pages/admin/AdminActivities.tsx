import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Image as ImageIcon, X, Save } from 'lucide-react';

export default function AdminActivities() {
  const { token } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState({ title: '', date: '', description: '', thumbnail: '', youtube_link: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [updateConfirm, setUpdateConfirm] = useState<boolean>(false);

  useEffect(() => {
    fetchActivities();
  }, [token]);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/activities');
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (err) {
      console.error('Failed to fetch activities', err);
    }
  };

  const handleSaveActivity = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (isEditing && !updateConfirm) {
      setUpdateConfirm(true);
      return;
    }

    try {
      const url = isEditing ? `/api/admin/activities/${isEditing}` : '/api/admin/activities';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newActivity)
      });

      if (res.ok) {
        setIsAdding(false);
        setIsEditing(null);
        setUpdateConfirm(false);
        setNewActivity({ title: '', date: '', description: '', thumbnail: '', youtube_link: '' });
        fetchActivities();
      }
    } catch (err) {
      console.error('Failed to save activity', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/activities/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchActivities();
      }
    } catch (err) {
      console.error('Failed to delete activity', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">Manage Activities</h1>
        <button
          onClick={() => {
            setIsAdding(true);
            setIsEditing(null);
            setNewActivity({ title: '', date: '', description: '', thumbnail: '', youtube_link: '' });
          }}
          className="flex items-center px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors shadow-sm shadow-gold-900/20 font-medium"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Activity
        </button>
      </div>

      {(isAdding || isEditing !== null) && (
        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 mb-8 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-black dark:text-white">{isAdding ? 'Add New Activity' : 'Edit Activity'}</h2>
            <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="text-zinc-500 hover:text-red-500">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSaveActivity} className="space-y-4">
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
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setNewActivity({...newActivity, thumbnail: reader.result as string});
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold-50 file:text-gold-700 hover:file:bg-gold-100 dark:file:bg-gold-900/20 dark:file:text-gold-400" 
                />
                {newActivity.thumbnail && (
                  <div className="mt-2 relative w-32 h-32">
                    <img src={newActivity.thumbnail} alt="Preview" className="w-full h-full object-cover rounded-lg border border-gold-200/50 dark:border-gold-900/30" referrerPolicy="no-referrer" />
                    <button 
                      type="button" 
                      onClick={() => setNewActivity({...newActivity, thumbnail: ''})}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">YouTube Link (Optional)</label>
                <input type="url" value={newActivity.youtube_link} onChange={e => setNewActivity({...newActivity, youtube_link: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea required rows={3} value={newActivity.description} onChange={e => setNewActivity({...newActivity, description: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => { setIsAdding(false); setIsEditing(null); }} className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">Cancel</button>
              <button type="submit" className="flex items-center px-6 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors shadow-sm shadow-gold-900/20 font-medium">
                <Save className="w-5 h-5 mr-2" />
                {isAdding ? 'Save Activity' : 'Update Activity'}
              </button>
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
                    <button 
                      onClick={() => {
                        setIsEditing(activity.id);
                        setNewActivity({
                          title: activity.title,
                          date: activity.date,
                          description: activity.description,
                          thumbnail: activity.thumbnail || '',
                          youtube_link: activity.youtube_link || ''
                        });
                        setIsAdding(false);
                      }}
                      className="font-medium text-gold-600 dark:text-gold-400 hover:underline mr-3"
                    >
                      <Edit className="w-4 h-4 inline" /> Edit
                    </button>
                    <button onClick={() => setDeleteConfirm(activity.id)} className="font-medium text-red-600 dark:text-red-400 hover:underline">
                      <Trash2 className="w-4 h-4 inline" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {activities.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                    No activities found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md w-full border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xl font-bold text-black dark:text-white mb-4">Confirm Deletion</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">Are you sure you want to delete this activity? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Update Confirmation Modal */}
      {updateConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md w-full border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xl font-bold text-black dark:text-white mb-4">Confirm Update</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">Are you sure you want to save these changes to the activity?</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setUpdateConfirm(false)}
                className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSaveActivity()}
                className="px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
