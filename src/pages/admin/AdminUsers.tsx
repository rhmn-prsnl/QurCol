import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types';
import { Users, Shield, ShieldAlert, Plus, Video, VideoOff } from 'lucide-react';

export default function AdminUsers() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');

  const fetchUsers = () => {
    // Mock data for now since we don't have a real backend
    const mockUsers = [
      { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', created_at: new Date().toISOString(), videoAccess: true },
      { id: '2', name: 'Student One', email: 'student1@example.com', role: 'user', created_at: new Date().toISOString(), videoAccess: true },
      { id: '3', name: 'Student Two', email: 'student2@example.com', role: 'user', created_at: new Date().toISOString(), videoAccess: false },
    ];
    setUsers(mockUsers);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Mock adding user
    const addedUser = {
      id: Math.random().toString(),
      ...newUser,
      created_at: new Date().toISOString(),
      videoAccess: true
    };
    
    setUsers([...users, addedUser]);
    setIsAdding(false);
    setNewUser({ name: '', email: '', password: '', role: 'user' });
  };

  const toggleVideoAccess = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        return { ...u, videoAccess: !u.videoAccess };
      }
      return u;
    }));
  };

  if (isLoading) return <div>Loading users...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">Manage Users</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors shadow-sm shadow-gold-900/20 font-medium"
        >
          <Plus className="w-5 h-5 mr-2" /> Add User
        </button>
      </div>

      {isAdding && (
        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 mb-8">
          <h2 className="text-lg font-bold text-black dark:text-white mb-4">Add New User</h2>
          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Name</label>
                <input required type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
                <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Password</label>
                <input required type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Role</label>
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full p-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500">
                  <option value="user">Student</option>
                  {currentUser?.role === 'super_admin' && (
                    <option value="admin">Admin (Employee)</option>
                  )}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors shadow-sm shadow-gold-900/20 font-medium">Create User</button>
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
                <th scope="col" className="px-6 py-3">Video Access</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id} className="bg-zinc-50 border-b border-gold-100 dark:bg-zinc-900 dark:border-gold-900/20 hover:bg-white dark:hover:bg-black transition-colors">
                  <td className="px-6 py-4 font-medium text-black dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 flex items-center justify-center font-bold border border-gold-200 dark:border-gold-800/50">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    {user.name}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'super_admin'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800/50'
                        : user.role === 'admin' 
                        ? 'bg-gold-100 text-gold-800 dark:bg-gold-900/30 dark:text-gold-300 border border-gold-200 dark:border-gold-800/50' 
                        : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    {user.role === 'user' && (
                      <button 
                        onClick={() => toggleVideoAccess(user.id)}
                        className={`flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          user.videoAccess 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50'
                        }`}
                      >
                        {user.videoAccess ? <Video className="w-3 h-3 mr-1" /> : <VideoOff className="w-3 h-3 mr-1" />}
                        {user.videoAccess ? 'Allowed' : 'Denied'}
                      </button>
                    )}
                  </td>
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
