import React, { useState, useEffect } from 'react';
import { Download, Filter, Search, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminDonations() {
  const { token } = useAuth();
  const [donations, setDonations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('all');

  useEffect(() => {
    fetchDonations();
  }, [token]);

  const fetchDonations = async () => {
    try {
      const res = await fetch('/api/admin/donations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDonations(data);
      }
    } catch (err) {
      console.error('Failed to fetch donations', err);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/donations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'read' })
      });
      if (res.ok) {
        fetchDonations();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          donation.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOption = filterOption === 'all' || donation.side === filterOption;
    return matchesSearch && matchesOption;
  });

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Name,Email,Contact,Option,Message,Status\n"
      + donations.map(d => `"${new Date(d.created_at).toLocaleDateString()}","${d.name}","${d.email}","${d.contact}","${d.side}","${d.message}","${d.status}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "donations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">Donations</h1>
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
            placeholder="Search by donor name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="text-zinc-400 w-5 h-5" />
          <select 
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500"
          >
            <option value="all">All Options</option>
            <option value="A">Option A</option>
            <option value="B">Option B</option>
          </select>
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
            <thead className="text-xs text-zinc-700 uppercase bg-white dark:bg-black dark:text-zinc-300 border-b border-gold-200/50 dark:border-gold-900/30">
              <tr>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Donor Info</th>
                <th scope="col" className="px-6 py-3">Option</th>
                <th scope="col" className="px-6 py-3">Message</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.map(donation => (
                <tr key={donation.id} className={`bg-zinc-50 border-b border-gold-100 dark:bg-zinc-900 dark:border-gold-900/20 hover:bg-white dark:hover:bg-black transition-colors ${donation.status === 'new' ? 'font-semibold text-black dark:text-white' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(donation.created_at).toLocaleDateString()}<br/>
                    <span className="text-xs text-zinc-400 font-normal">{new Date(donation.created_at).toLocaleTimeString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{donation.name}</div>
                    <div className="text-xs font-normal text-zinc-500">{donation.email}</div>
                    <div className="text-xs font-normal text-zinc-500">{donation.contact}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 rounded-full text-xs font-medium border border-gold-200 dark:border-gold-800/50">
                      Option {donation.side}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate font-normal text-zinc-500" title={donation.message}>
                    {donation.message || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      donation.status === 'new' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/50' 
                        : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                    }`}>
                      {donation.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {donation.status === 'new' && (
                      <button 
                        onClick={() => handleMarkAsRead(donation.id)}
                        className="text-gold-600 dark:text-gold-400 hover:underline flex items-center justify-end w-full"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Mark Read
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredDonations.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                    No donations found matching your criteria.
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
