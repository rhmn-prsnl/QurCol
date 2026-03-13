import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Image as ImageIcon, X, Save } from 'lucide-react';

export default function AdminEvents() {
  const { token } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', location: '', description: '', image: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [updateConfirm, setUpdateConfirm] = useState<boolean>(false);

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Failed to fetch events', err);
    }
  };

  const handleSaveEvent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (isEditing && !updateConfirm) {
      setUpdateConfirm(true);
      return;
    }

    try {
      const url = isEditing ? `/api/admin/events/${isEditing}` : '/api/admin/events';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newEvent)
      });

      if (res.ok) {
        setIsAdding(false);
        setIsEditing(null);
        setUpdateConfirm(false);
        setNewEvent({ title: '', date: '', time: '', location: '', description: '', image: '' });
        fetchEvents();
      }
    } catch (err) {
      console.error('Failed to save event', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchEvents();
      }
    } catch (err) {
      console.error('Failed to delete event', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">Manage Events</h1>
        <button
          onClick={() => {
            setIsAdding(true);
            setIsEditing(null);
            setNewEvent({ title: '', date: '', time: '', location: '', description: '', image: '' });
          }}
          className="flex items-center px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors shadow-sm shadow-gold-900/20 font-medium"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Event
        </button>
      </div>

      {(isAdding || isEditing !== null) && (
        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 mb-8 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-black dark:text-white">{isAdding ? 'Add New Event' : 'Edit Event'}</h2>
            <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="text-zinc-500 hover:text-red-500">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSaveEvent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Title</label>
                <input required type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Date</label>
                <input required type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Time</label>
                <input required type="text" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" placeholder="e.g. 10:00 AM EST" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Location</label>
                <input required type="text" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" placeholder="Virtual or Physical Address" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Event Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setNewEvent({...newEvent, image: reader.result as string});
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold-50 file:text-gold-700 hover:file:bg-gold-100 dark:file:bg-gold-900/20 dark:file:text-gold-400" 
                />
                {newEvent.image && (
                  <div className="mt-2 relative w-32 h-32">
                    <img src={newEvent.image} alt="Preview" className="w-full h-full object-cover rounded-lg border border-gold-200/50 dark:border-gold-900/30" referrerPolicy="no-referrer" />
                    <button 
                      type="button" 
                      onClick={() => setNewEvent({...newEvent, image: ''})}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea required rows={3} value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => { setIsAdding(false); setIsEditing(null); }} className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">Cancel</button>
              <button type="submit" className="flex items-center px-6 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors shadow-sm shadow-gold-900/20 font-medium">
                <Save className="w-5 h-5 mr-2" />
                {isAdding ? 'Save Event' : 'Update Event'}
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
                <th scope="col" className="px-6 py-3">Event</th>
                <th scope="col" className="px-6 py-3">Date & Time</th>
                <th scope="col" className="px-6 py-3">Location</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id} className="bg-zinc-50 border-b border-gold-100 dark:bg-zinc-900 dark:border-gold-900/20 hover:bg-white dark:hover:bg-black transition-colors">
                  <td className="px-6 py-4 font-medium text-black dark:text-white flex items-center gap-3">
                    <img src={event.image || `https://picsum.photos/seed/${event.id}/100/100`} alt="" className="w-10 h-10 rounded object-cover grayscale-[20%]" referrerPolicy="no-referrer" />
                    {event.title}
                  </td>
                  <td className="px-6 py-4">{new Date(event.date).toLocaleDateString()} at {event.time}</td>
                  <td className="px-6 py-4">{event.location}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => {
                        setIsEditing(event.id);
                        setNewEvent({
                          title: event.title,
                          date: event.date,
                          time: event.time,
                          location: event.location,
                          description: event.description,
                          image: event.image || ''
                        });
                        setIsAdding(false);
                      }}
                      className="font-medium text-gold-600 dark:text-gold-400 hover:underline mr-3"
                    >
                      <Edit className="w-4 h-4 inline" /> Edit
                    </button>
                    <button onClick={() => setDeleteConfirm(event.id)} className="font-medium text-red-600 dark:text-red-400 hover:underline">
                      <Trash2 className="w-4 h-4 inline" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                    No events found. Create one to get started.
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
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">Are you sure you want to delete this event? This action cannot be undone.</p>
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
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">Are you sure you want to save these changes to the event?</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setUpdateConfirm(false)}
                className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSaveEvent()}
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
