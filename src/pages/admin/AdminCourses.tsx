import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Course } from '../../types';
import { Plus, Edit, Trash2, Image as ImageIcon, X, Upload } from 'lucide-react';

export default function AdminCourses() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', category: '', level: '', instructor: '', thumbnail: '', duration: '' });
  const [durationSelect, setDurationSelect] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [updateConfirm, setUpdateConfirm] = useState<boolean>(false);
  const [faculties, setFaculties] = useState<any[]>([]);

  useEffect(() => {
    fetchCourses();
    fetchFaculties();
  }, [token]);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error('Failed to fetch courses', err);
    }
  };

  const fetchFaculties = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFaculties(data.filter((u: any) => u.role === 'faculty'));
      }
    } catch (err) {
      console.error('Failed to fetch faculties', err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCourse({ ...newCourse, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCourse = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (isEditing && !updateConfirm) {
      setUpdateConfirm(true);
      return;
    }

    try {
      const url = isEditing ? `/api/admin/courses/${isEditing}` : '/api/admin/courses';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newCourse)
      });

      if (res.ok) {
        setIsAdding(false);
        setIsEditing(null);
        setUpdateConfirm(false);
        setNewCourse({ title: '', description: '', category: '', level: '', instructor: '', thumbnail: '', duration: '' });
        setDurationSelect('');
        fetchCourses();
      }
    } catch (err) {
      console.error('Failed to save course', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchCourses();
      }
    } catch (err) {
      console.error('Failed to delete course', err);
    }
  };

  const handleEditClick = (course: any) => {
    setNewCourse({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      instructor: course.instructor,
      thumbnail: course.thumbnail,
      duration: course.duration || ''
    });
    
    const predefinedDurations = ['1 Month', '1 Month and 15 Days', '3 Months', '6 Months'];
    if (predefinedDurations.includes(course.duration)) {
      setDurationSelect(course.duration);
    } else if (course.duration) {
      setDurationSelect('Custom');
    } else {
      setDurationSelect('');
    }
    
    setIsEditing(course.id.toString());
    setIsAdding(false);
    setUpdateConfirm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">Manage Courses</h1>
        <button
          onClick={() => {
            setIsAdding(true);
            setIsEditing(null);
            setNewCourse({ title: '', description: '', category: '', level: '', instructor: '', thumbnail: '', duration: '' });
            setDurationSelect('');
          }}
          className="flex items-center px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors shadow-sm shadow-gold-900/20 font-medium"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Course
        </button>
      </div>

      {(isAdding || isEditing !== null) && (
        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 mb-8 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-black dark:text-white">{isAdding ? 'Add New Course' : 'Edit Course'}</h2>
            <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="text-zinc-500 hover:text-red-500">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSaveCourse} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Title</label>
                <input required type="text" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Category</label>
                <input required type="text" value={newCourse.category} onChange={e => setNewCourse({...newCourse, category: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Level</label>
                <input required type="text" value={newCourse.level} onChange={e => setNewCourse({...newCourse, level: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Instructor</label>
                <select 
                  required 
                  value={newCourse.instructor} 
                  onChange={e => setNewCourse({...newCourse, instructor: e.target.value})} 
                  className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                >
                  <option value="">Select Instructor</option>
                  {faculties.map(faculty => (
                    <option key={faculty.id} value={faculty.name}>{faculty.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Duration</label>
                <select 
                  required 
                  value={durationSelect} 
                  onChange={e => {
                    setDurationSelect(e.target.value);
                    if (e.target.value !== 'Custom') {
                      setNewCourse({...newCourse, duration: e.target.value});
                    } else {
                      setNewCourse({...newCourse, duration: ''});
                    }
                  }} 
                  className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                >
                  <option value="">Select Duration</option>
                  <option value="1 Month">1 Month</option>
                  <option value="1 Month and 15 Days">1 Month and 15 Days</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="Custom">Custom...</option>
                </select>
              </div>
              
              {durationSelect === 'Custom' && (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Custom Duration</label>
                  <input required type="text" value={newCourse.duration} onChange={e => setNewCourse({...newCourse, duration: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" placeholder="e.g. 45 Days, 2 Years" />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Thumbnail Image</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center justify-center px-4 py-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    <Upload className="w-4 h-4 mr-2" />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {newCourse.thumbnail && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gold-200/50 dark:border-gold-900/30">
                      <img src={newCourse.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setNewCourse({...newCourse, thumbnail: ''})} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea required rows={3} value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => { setIsAdding(false); setIsEditing(null); }} className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors shadow-sm shadow-gold-900/20 font-medium">Save Course</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
            <thead className="text-xs text-zinc-700 uppercase bg-white dark:bg-black dark:text-zinc-300 border-b border-gold-200/50 dark:border-gold-900/30">
              <tr>
                <th scope="col" className="px-6 py-3">Course</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Instructor</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id} className="bg-zinc-50 border-b border-gold-100 dark:bg-zinc-900 dark:border-gold-900/20 hover:bg-white dark:hover:bg-black transition-colors">
                  <td className="px-6 py-4 font-medium text-black dark:text-white flex items-center gap-3">
                    <img src={course.thumbnail || `https://picsum.photos/seed/${course.id}/100/100`} alt="" className="w-10 h-10 rounded object-cover grayscale-[20%]" referrerPolicy="no-referrer" />
                    {course.title}
                  </td>
                  <td className="px-6 py-4">{course.category}</td>
                  <td className="px-6 py-4">{course.instructor}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleEditClick(course)}
                      className="font-medium text-gold-600 dark:text-gold-400 hover:underline mr-3"
                    >
                      <Edit className="w-4 h-4 inline" /> Edit
                    </button>
                    <button onClick={() => setDeleteConfirm(course.id)} className="font-medium text-red-600 dark:text-red-400 hover:underline">
                      <Trash2 className="w-4 h-4 inline" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                    No courses found. Create one to get started.
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
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">Are you sure you want to delete this course? This action cannot be undone.</p>
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
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">Are you sure you want to save these changes to the course?</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setUpdateConfirm(false)}
                className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSaveCourse()}
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
