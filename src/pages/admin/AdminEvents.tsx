import React, { useState } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';

export default function AdminEvents() {
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Global Education Summit 2026',
      date: '2026-03-15',
      time: '10:00 AM EST',
      location: 'Virtual Event',
      description: 'Join us for the biggest education summit of the year.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
    }
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', location: '', description: '', image: '' });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const event = {
      ...newEvent,
      id: Date.now().toString()
    };
    setEvents([...events, event]);
    setIsAdding(false);
    setNewEvent({ title: '', date: '', time: '', location: '', description: '', image: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">Manage Events</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors shadow-sm shadow-gold-900/20 font-medium"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Event
        </button>
      </div>

      {isAdding && (
        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 mb-8">
          <h2 className="text-lg font-bold text-black dark:text-white mb-4">Add New Event</h2>
          <form onSubmit={handleAddEvent} className="space-y-4">
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
                <div className="flex items-center space-x-4">
                  <label className="flex items-center justify-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                    <ImageIcon className="w-5 h-5 mr-2 text-zinc-500" />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Upload Image</span>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Recommended: 1280x720px, Max 2MB (JPG, PNG, WebP)
                  </span>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea required rows={3} value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors shadow-sm shadow-gold-900/20 font-medium">Save Event</button>
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
                    <button className="text-zinc-600 dark:text-zinc-400 hover:underline mr-3" title="Edit">
                      <Edit className="w-4 h-4 inline" />
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="text-red-600 dark:text-red-400 hover:underline" title="Delete">
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
