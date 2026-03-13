import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Download, Filter, CheckCircle, XCircle } from 'lucide-react';

export default function AdminSubscribers() {
  const { token } = useAuth();
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchSubscribers();
  }, [token]);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/admin/subscribers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data);
      }
    } catch (err) {
      console.error('Failed to fetch subscribers', err);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/subscribers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchSubscribers();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Email,Status\n"
      + subscribers.map(s => `"${new Date(s.created_at).toLocaleDateString()}","${s.email}","${s.status}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || subscriber.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">Newsletter Subscribers</h1>
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shadow-sm font-medium"
        >
          <Download className="w-5 h-5 mr-2" /> Export CSV
        </button>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="text-zinc-400 w-5 h-5" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
            <thead className="text-xs text-zinc-700 uppercase bg-white dark:bg-black dark:text-zinc-300 border-b border-gold-200/50 dark:border-gold-900/30">
              <tr>
                <th scope="col" className="px-6 py-3">Date Subscribed</th>
                <th scope="col" className="px-6 py-3">Email Address</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map(subscriber => (
                <tr key={subscriber.id} className="bg-zinc-50 border-b border-gold-100 dark:bg-zinc-900 dark:border-gold-900/20 hover:bg-white dark:hover:bg-black transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(subscriber.created_at).toLocaleDateString()}<br/>
                    <span className="text-xs text-zinc-400 font-normal">{new Date(subscriber.created_at).toLocaleTimeString()}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-black dark:text-white">
                    {subscriber.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      subscriber.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/50' 
                        : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                    }`}>
                      {subscriber.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {subscriber.status === 'active' ? (
                      <button 
                        onClick={() => handleUpdateStatus(subscriber.id, 'unsubscribed')}
                        className="text-red-600 dark:text-red-400 hover:underline flex items-center justify-end w-full"
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Unsubscribe
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleUpdateStatus(subscriber.id, 'active')}
                        className="text-green-600 dark:text-green-400 hover:underline flex items-center justify-end w-full"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredSubscribers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                    No subscribers found matching your criteria.
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
