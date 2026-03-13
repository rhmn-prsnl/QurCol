import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Plus, Trash2, Edit2, Save, X } from 'lucide-react';

export default function AdminPopups() {
  const { token } = useAuth();
  const [popups, setPopups] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentPopup, setCurrentPopup] = useState<any>({});
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [updateConfirm, setUpdateConfirm] = useState<boolean>(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPopups();
  }, [token]);

  const fetchPopups = async () => {
    try {
      const res = await fetch('/api/admin/popups', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPopups(data);
      }
    } catch (err) {
      console.error('Failed to fetch popups', err);
    }
  };

  const handleSave = async () => {
    setError('');
    if (!currentPopup.name || !currentPopup.content) {
      setError('Name and Content are required.');
      return;
    }

    if (isEditing && !updateConfirm) {
      setUpdateConfirm(true);
      return;
    }

    try {
      const url = isEditing ? `/api/admin/popups/${isEditing}` : '/api/admin/popups';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(currentPopup)
      });

      if (res.ok) {
        setIsEditing(null);
        setIsAdding(false);
        setUpdateConfirm(false);
        setCurrentPopup({});
        fetchPopups();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save popup');
      }
    } catch (err) {
      console.error('Failed to save popup', err);
      setError('An unexpected error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/popups/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchPopups();
      }
    } catch (err) {
      console.error('Failed to delete popup', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black dark:text-white">Pop-up Management</h1>
        <button 
          onClick={() => {
            setIsAdding(true);
            setIsEditing(null);
            setCurrentPopup({ name: '', active: 1, start_date: '', end_date: '', frequency: 'once_per_session', delay: 5, content: '', image_url: '' });
          }}
          className="flex items-center px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Pop-up
        </button>
      </div>

      {(isAdding || isEditing !== null) && (
        <div className="bg-white dark:bg-zinc-900 border border-gold-500/50 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-black dark:text-white">{isAdding ? 'New Pop-up' : 'Edit Pop-up'}</h2>
            <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="text-zinc-500 hover:text-red-500">
              <X className="w-6 h-6" />
            </button>
          </div>
          {error && <p className="text-red-500 mb-4 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800/50">{error}</p>}
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Name</label>
                  <input required type="text" value={currentPopup.name || ''} onChange={e => setCurrentPopup({...currentPopup, name: e.target.value})} className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="active" checked={!!currentPopup.active} onChange={e => setCurrentPopup({...currentPopup, active: e.target.checked ? 1 : 0})} className="rounded text-gold-500 focus:ring-gold-500" />
                  <label htmlFor="active" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Active</label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Start Date</label>
                    <input type="date" value={currentPopup.start_date || ''} onChange={e => setCurrentPopup({...currentPopup, start_date: e.target.value})} className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">End Date</label>
                    <input type="date" value={currentPopup.end_date || ''} onChange={e => setCurrentPopup({...currentPopup, end_date: e.target.value})} className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Display Frequency</label>
                  <select value={currentPopup.frequency || 'once_per_session'} onChange={e => setCurrentPopup({...currentPopup, frequency: e.target.value})} className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white">
                    <option value="always">Every time page loads</option>
                    <option value="once_per_session">Once per session</option>
                    <option value="once_per_user">Once per user</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Delay (seconds)</label>
                  <input type="number" value={currentPopup.delay || 5} onChange={e => setCurrentPopup({...currentPopup, delay: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Message Content</label>
                  <textarea required rows={4} value={currentPopup.content || ''} onChange={e => setCurrentPopup({...currentPopup, content: e.target.value})} className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Popup Image (Optional)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setCurrentPopup({...currentPopup, image_url: reader.result as string});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold-50 file:text-gold-700 hover:file:bg-gold-100 dark:file:bg-gold-900/20 dark:file:text-gold-400" 
                  />
                </div>
                {currentPopup.image_url && (
                  <div className="mt-2 relative">
                    <img src={currentPopup.image_url} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-gold-200/50 dark:border-gold-900/30" referrerPolicy="no-referrer" />
                    <button 
                      type="button" 
                      onClick={() => setCurrentPopup({...currentPopup, image_url: ''})}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button type="submit" className="flex items-center px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors">
                <Save className="w-4 h-4 mr-2" />
                Save Pop-up
              </button>
            </div>
          </form>
        </div>
      )}

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
                  {popup.start_date} to {popup.end_date}
                </p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => { setIsEditing(popup.id); setCurrentPopup(popup); setIsAdding(false); }}
                  className="p-2 text-zinc-400 hover:text-gold-500 transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setDeleteConfirm(popup.id)}
                  className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Display Frequency</p>
                  <p className="text-black dark:text-white">{popup.frequency}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Delay</p>
                  <p className="text-black dark:text-white">{popup.delay} seconds</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Message Content</p>
                  <p className="text-black dark:text-white whitespace-pre-wrap">{popup.content}</p>
                </div>
              </div>
              <div className="space-y-4">
                {popup.image_url && (
                  <div>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Image</p>
                    <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 h-32 relative">
                      <img src={popup.image_url} alt="Popup preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {popups.length === 0 && !isAdding && (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 dark:text-zinc-400">No pop-ups found. Create one to get started.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md w-full border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xl font-bold text-black dark:text-white mb-4">Confirm Deletion</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">Are you sure you want to delete this pop-up? This action cannot be undone.</p>
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
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">Are you sure you want to save these changes to the pop-up?</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setUpdateConfirm(false)}
                className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSave()}
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
