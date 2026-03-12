import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Plus, GraduationCap } from 'lucide-react';

export default function AdminFaculties() {
  const { token } = useAuth();
  const [faculties, setFaculties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newFaculty, setNewFaculty] = useState({ name: '', email: '', password: '', role: 'faculty' });
  const [error, setError] = useState('');

  const fetchFaculties = () => {
    // Mock data for now since we don't have a real backend
    const mockFaculties = [
      { id: 'f1', name: 'John Doe', email: 'john.doe@example.com', role: 'faculty', created_at: new Date().toISOString() },
      { id: 'f2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'faculty', created_at: new Date().toISOString() },
      { id: 'f3', name: 'Dr. Alan Turing', email: 'alan.turing@example.com', role: 'faculty', created_at: new Date().toISOString() },
    ];
    setFaculties(mockFaculties);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFaculties();
  }, [token]);

  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Mock adding faculty
    const addedFaculty = {
      id: Math.random().toString(),
      ...newFaculty,
      created_at: new Date().toISOString(),
    };
    
    setFaculties([...faculties, addedFaculty]);
    setIsAdding(false);
    setNewFaculty({ name: '', email: '', password: '', role: 'faculty' });
  };

  if (isLoading) return <div>Loading faculties...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">Manage Faculties</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors shadow-sm shadow-gold-900/20 font-medium"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Faculty
        </button>
      </div>

      {isAdding && (
        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 mb-8">
          <h2 className="text-lg font-bold text-black dark:text-white mb-4">Add New Faculty</h2>
          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
          <form onSubmit={handleAddFaculty} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Name</label>
                <input required type="text" value={newFaculty.name} onChange={e => setNewFaculty({...newFaculty, name: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
                <input required type="email" value={newFaculty.email} onChange={e => setNewFaculty({...newFaculty, email: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Password</label>
                <input required type="password" value={newFaculty.password} onChange={e => setNewFaculty({...newFaculty, password: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors shadow-sm shadow-gold-900/20 font-medium">Create Faculty</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
            <thead className="text-xs text-zinc-700 uppercase bg-white dark:bg-black dark:text-zinc-300 border-b border-gold-200/50 dark:border-gold-900/30">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3">Joined</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((faculty: any) => (
                <tr key={faculty.id} className="bg-zinc-50 border-b border-gold-100 dark:bg-zinc-900 dark:border-gold-900/20 hover:bg-white dark:hover:bg-black transition-colors">
                  <td className="px-6 py-4 font-medium text-black dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 flex items-center justify-center font-bold border border-gold-200 dark:border-gold-800/50">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    {faculty.name}
                  </td>
                  <td className="px-6 py-4">{faculty.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                      {faculty.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(faculty.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gold-600 dark:text-gold-400 hover:underline mr-3" title="Edit Role">
                      <Shield className="w-4 h-4 inline" />
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
