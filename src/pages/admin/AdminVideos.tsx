import React, { useState } from 'react';
import { Plus, Edit, Trash2, Video as VideoIcon } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  youtubeLink: string;
  courseId: string;
  categories: string[];
}

export default function AdminVideos() {
  const [videos, setVideos] = useState<Video[]>([
    {
      id: '1',
      title: 'Introduction to Trading',
      description: 'Learn the basics of trading in this introductory video.',
      youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      courseId: '1',
      categories: ['Free Video', 'Recent Video']
    }
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newVideo, setNewVideo] = useState<Omit<Video, 'id'>>({
    title: '',
    description: '',
    youtubeLink: '',
    courseId: '',
    categories: []
  });

  const availableCategories = ['Free Video', 'Weekly Video', 'Recent Video', 'Popular Video', 'Featured Video'];
  const mockCourses = [{ id: '1', title: 'Advanced Trading Strategies' }, { id: '2', title: 'Beginner Basics' }];

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const video: Video = {
      ...newVideo,
      id: Date.now().toString()
    };
    setVideos([...videos, video]);
    setIsAdding(false);
    setNewVideo({ title: '', description: '', youtubeLink: '', courseId: '', categories: [] });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      setVideos(videos.filter(v => v.id !== id));
    }
  };

  const toggleCategory = (category: string) => {
    setNewVideo(prev => {
      if (prev.categories.includes(category)) {
        return { ...prev, categories: prev.categories.filter(c => c !== category) };
      } else {
        return { ...prev, categories: [...prev.categories, category] };
      }
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">Manage Videos</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors shadow-sm shadow-gold-900/20 font-medium"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Video
        </button>
      </div>

      {isAdding && (
        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 mb-8">
          <h2 className="text-lg font-bold text-black dark:text-white mb-4">Add New Video</h2>
          <form onSubmit={handleAddVideo} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Video Title</label>
                <input required type="text" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">YouTube Link</label>
                <input required type="url" value={newVideo.youtubeLink} onChange={e => setNewVideo({...newVideo, youtubeLink: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea required rows={3} value={newVideo.description} onChange={e => setNewVideo({...newVideo, description: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"></textarea>
              </div>
              
              <div className="md:col-span-2 border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-2">
                <h3 className="text-md font-semibold text-black dark:text-white mb-3">Video Placement</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Assign to Course (Optional)</label>
                  <select 
                    value={newVideo.courseId} 
                    onChange={e => setNewVideo({...newVideo, courseId: e.target.value})} 
                    className="w-full md:w-1/2 p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  >
                    <option value="">None (Standalone Video)</option>
                    {mockCourses.map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Display in Sections (Multiple selection allowed)</label>
                  <div className="flex flex-wrap gap-3">
                    {availableCategories.map(category => (
                      <label key={category} className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={newVideo.categories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="w-4 h-4 text-gold-500 bg-white border-zinc-300 rounded focus:ring-gold-500 dark:focus:ring-gold-600 dark:ring-offset-zinc-800 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600"
                        />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">Cancel</button>
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
                <th scope="col" className="px-6 py-3">Course</th>
                <th scope="col" className="px-6 py-3">Sections</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map(video => (
                <tr key={video.id} className="bg-zinc-50 border-b border-gold-100 dark:bg-zinc-900 dark:border-gold-900/20 hover:bg-white dark:hover:bg-black transition-colors">
                  <td className="px-6 py-4 font-medium text-black dark:text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded flex items-center justify-center text-zinc-500">
                      <VideoIcon className="w-5 h-5" />
                    </div>
                    {video.title}
                  </td>
                  <td className="px-6 py-4">
                    {video.courseId ? mockCourses.find(c => c.id === video.courseId)?.title : <span className="text-zinc-400 italic">None</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {video.categories.map(cat => (
                        <span key={cat} className="px-2 py-1 text-xs bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 rounded-full">
                          {cat}
                        </span>
                      ))}
                      {video.categories.length === 0 && <span className="text-zinc-400 italic">Unassigned</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-zinc-600 dark:text-zinc-400 hover:underline mr-3" title="Edit">
                      <Edit className="w-4 h-4 inline" />
                    </button>
                    <button onClick={() => handleDelete(video.id)} className="text-red-600 dark:text-red-400 hover:underline" title="Delete">
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
              {videos.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                    No videos found. Click "Add Video" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
