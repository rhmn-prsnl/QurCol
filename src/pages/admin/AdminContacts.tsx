import React, { useState, useEffect } from 'react';
import { Download, Filter, Search, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminContacts() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchContacts();
  }, [token]);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/admin/contacts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (err) {
      console.error('Failed to fetch contacts', err);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/contacts/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'read' })
      });
      if (res.ok) {
        fetchContacts();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Name,Email,Subject,Message,Status\n"
      + contacts.map(c => `"${new Date(c.created_at).toLocaleDateString()}","${c.name}","${c.email}","${c.subject}","${c.message}","${c.status}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contacts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">Contact Forms</h1>
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
            placeholder="Search by name, email, or subject..." 
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
            <option value="new">New</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl shadow-sm border border-gold-200/50 dark:border-gold-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
            <thead className="text-xs text-zinc-700 uppercase bg-white dark:bg-black dark:text-zinc-300 border-b border-gold-200/50 dark:border-gold-900/30">
              <tr>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Sender Info</th>
                <th scope="col" className="px-6 py-3">Subject</th>
                <th scope="col" className="px-6 py-3">Message</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map(contact => (
                <tr key={contact.id} className={`bg-zinc-50 border-b border-gold-100 dark:bg-zinc-900 dark:border-gold-900/20 hover:bg-white dark:hover:bg-black transition-colors ${contact.status === 'new' ? 'font-semibold text-black dark:text-white' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(contact.created_at).toLocaleDateString()}<br/>
                    <span className="text-xs text-zinc-400 font-normal">{new Date(contact.created_at).toLocaleTimeString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-xs font-normal text-zinc-500">{contact.email}</div>
                  </td>
                  <td className="px-6 py-4">{contact.subject}</td>
                  <td className="px-6 py-4 max-w-xs truncate font-normal text-zinc-500" title={contact.message}>
                    {contact.message}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      contact.status === 'new' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/50' 
                        : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                    }`}>
                      {contact.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {contact.status === 'new' && (
                      <button 
                        onClick={() => handleMarkAsRead(contact.id)}
                        className="text-gold-600 dark:text-gold-400 hover:underline flex items-center justify-end w-full"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Mark Read
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                    No contact forms found matching your criteria.
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
