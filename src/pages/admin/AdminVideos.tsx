import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Video as VideoIcon, X } from 'lucide-react';

export default function AdminVideos() {
  const { token } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newVideo, setNewVideo] = useState({ title: '', description: '', youtube_id: '', module_id: '', order_position: 1 });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [updateConfirm, setUpdateConfirm] = useState<boolean>(false);

  useEffect(() => {
    fetchVideos();
    fetchModules();
  }, [token]);

  const fetchModules = async () => {
    try {
      const res = await fetch('/api/admin/modules', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setModules(data);
      }
    } catch (err) {
      console.error('Failed to fetch modules', err);
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/admin/videos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (err) {
      console.error('Failed to fetch videos', err);
    }
  };

  const handleSaveVideo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (isEditing && !updateConfirm) {
      setUpdateConfirm(true);
      return;
    }

    try {
      const url = isEditing ? `/api/admin/videos/${isEditing}` : '/api/admin/videos';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newVideo)
      });

      if (res.ok) {
        setIsAdding(false);
        setIsEditing(null);
        setUpdateConfirm(false);
        setNewVideo({ title: '', description: '', youtube_id: '', module_id: '', order_position: 1 });
        fetchVideos();
      }
    } catch (err) {
      console.error('Failed to save video', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/videos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchVideos();
      }
    } catch (err) {
      console.error('Failed to delete video', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">Manage Videos</h1>
        <button
          onClick={() => {
            setIsAdding(true);
            setIsEditing(null);
            setNewVideo({ title: '', description: '', youtube_id: '', module_id: '', order_position: 1 });
          }}
          className="flex items-center px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors shadow-sm shadow-gold-900/20 font-medium"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Video
        </button>
      </div>

      {(isAdding || isEditing !== null) && (
        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 mb-8 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-black dark:text-white">{isAdding ? 'Add New Video' : 'Edit Video'}</h2>
            <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="text-zinc-500 hover:text-red-500">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSaveVideo} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Video Title</label>
                <input required type="text" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">YouTube Video ID</label>
                <input required type="text" value={newVideo.youtube_id} onChange={e => setNewVideo({...newVideo, youtube_id: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" placeholder="e.g. dQw4w9WgXcQ" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea required rows={3} value={newVideo.description} onChange={e => setNewVideo({...newVideo, description: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"></textarea>
              </div>
              
              <div className="md:col-span-2 border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-2">
                <h3 className="text-md font-semibold text-black dark:text-white mb-3">Video Placement</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Assign to Module</label>
                    <select 
                      value={newVideo.module_id} 
                      onChange={e => setNewVideo({...newVideo, module_id: e.target.value})} 
                      className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                    >
                      <option value="">Select Module</option>
                      {modules.map(module => (
                        <option key={module.id} value={module.id}>{module.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Order Position</label>
                    <input type="number" value={newVideo.order_position} onChange={e => setNewVideo({...newVideo, order_position: parseInt(e.target.value)})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => { setIsAdding(false); setIsEditing(null); }} className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors shadow-sm shadow-gold-900/20 font-medium">Save Video</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
            <thead className="text-xs text-zinc-700 uppercase bg-white dark:bg-black dark:text-zinc-300 border-b border-gold-200/50 dark:border-gold-900/30">
              <tr>
                <th scope="col" className="px-6 py-3">Video Title</th>
                <th scope="col" className="px-6 py-3">Module</th>
                <th scope="col" className="px-6 py-3">Order</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map(video => (
                <tr key={video.id} className="bg-zinc-50 border-b border-gold-100 dark:bg-zinc-900 dark:border-gold-900/20 hover:bg-white dark:hover:bg-black transition-colors">
                  <td className="px-6 py-4 font-medium text-black dark:text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                      <VideoIcon className="w-5 h-5 text-zinc-500" />
                    </div>
                    {video.title}
                  </td>
                  <td className="px-6 py-4">{video.module_title || video.module_id}</td>
                  <td className="px-6 py-4">{video.order_position}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => {
                        setIsEditing(video.id);
                        setNewVideo({
                          title: video.title,
                          description: video.description,
                          youtube_id: video.youtube_id,
                          module_id: video.module_id,
                          order_position: video.order_position
                        });
                        setIsAdding(false);
                      }}
                      className="font-medium text-gold-600 dark:text-gold-400 hover:underline mr-3"
                    >
                      <Edit className="w-4 h-4 inline" /> Edit
                    </button>
                    <button onClick={() => setDeleteConfirm(video.id)} className="font-medium text-red-600 dark:text-red-400 hover:underline">
                      <Trash2 className="w-4 h-4 inline" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {videos.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                    No videos found. Create one to get started.
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
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">Are you sure you want to delete this video? This action cannot be undone.</p>
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
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">Are you sure you want to save these changes to the video?</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setUpdateConfirm(false)}
                className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSaveVideo()}
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
