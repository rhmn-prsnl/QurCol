import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Download, Eye, CheckCircle } from 'lucide-react';

export default function AdminInquiries() {
  const { token } = useAuth();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchInquiries();
  }, [token]);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/admin/inquiries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries', err);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'read' })
      });
      if (res.ok) {
        fetchInquiries();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Name,Email,Phone,Gender,Course,Message,Status\n"
      + inquiries.map(i => `"${new Date(i.created_at).toLocaleDateString()}","${i.name}","${i.email}","${i.phone}","${i.gender}","${i.course}","${i.message}","${i.status}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inquiries.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inquiry.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">Inquiries</h1>
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </button>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 overflow-hidden">
        <div className="p-4 border-b border-gold-200/50 dark:border-gold-900/30 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gold-200/50 dark:border-gold-900/30 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
            <thead className="text-xs text-zinc-700 uppercase bg-white dark:bg-black dark:text-zinc-300 border-b border-gold-200/50 dark:border-gold-900/30">
              <tr>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Donor Info</th>
                <th scope="col" className="px-6 py-3">Course</th>
                <th scope="col" className="px-6 py-3">Message</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="bg-zinc-50 border-b border-gold-100 dark:bg-zinc-900 dark:border-gold-900/20 hover:bg-white dark:hover:bg-black transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-black dark:text-white">{inquiry.name}</div>
                    <div className="text-xs">{inquiry.email}</div>
                    <div className="text-xs">{inquiry.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 rounded-full text-xs font-medium">
                      {inquiry.course}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate" title={inquiry.message}>
                    {inquiry.message || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inquiry.status === 'new' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}>
                      {inquiry.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {inquiry.status === 'new' && (
                      <button 
                        onClick={() => handleMarkAsRead(inquiry.id)}
                        className="text-gold-600 dark:text-gold-400 hover:underline flex items-center justify-end w-full"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Mark Read
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredInquiries.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                    No inquiries found matching your criteria.
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
