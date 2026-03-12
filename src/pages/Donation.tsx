import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, CreditCard, X, QrCode, Building } from 'lucide-react';

interface DonationSideProps {
  title: string;
}

const DonationSide: React.FC<DonationSideProps> = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, side: title, amount: 'Variable' }),
      });
      
      if (res.ok) {
        console.log('Sending email to admin:', {
          side: title,
          datetime: new Date().toLocaleString(),
          ...formData
        });
        console.log(`Sending confirmation email to user: ${formData.email}`);
        setIsSubmitting(false);
        setIsSubmitted(true);
      } else {
        alert('Failed to process donation. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      alert('Network error. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="cursor-pointer p-8 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-gold-200/50 dark:border-gold-900/30 hover:border-gold-500 dark:hover:border-gold-500 transition-all flex flex-col items-center justify-center min-h-[400px] shadow-sm hover:shadow-md group"
      >
        <div className="w-20 h-20 bg-gold-100 dark:bg-gold-900/30 rounded-full flex items-center justify-center mb-6 text-gold-600 dark:text-gold-400 group-hover:bg-gold-500 group-hover:text-black transition-colors">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-extrabold text-black dark:text-white mb-4">{title}</h2>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium text-center">Click here to proceed with option {title}</p>
      </motion.div>
    );
  }

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-gold-200/50 dark:border-gold-900/30 min-h-[400px] flex flex-col"
      >
        <h2 className="text-2xl font-bold text-black dark:text-white mb-6 text-center border-b border-zinc-200 dark:border-zinc-800 pb-4">
          {title} - Payment Details
        </h2>
        <div className="flex flex-col items-center space-y-8 flex-grow justify-center">
          <div className="text-center space-y-4">
            <div className="inline-block bg-white p-4 rounded-xl shadow-sm border border-zinc-200">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Donation_${title}_${formData.contact}`} alt="QR Code" className="w-48 h-48" referrerPolicy="no-referrer" />
            </div>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center justify-center">
              <QrCode className="w-4 h-4 mr-2" /> Scan to Pay
            </p>
          </div>

          <div className="w-full bg-white dark:bg-black p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2 text-gold-500" /> Bank Details (Netbanking)
            </h3>
            <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <span className="font-medium text-black dark:text-white">Bank Name:</span> 
                <span>Example Bank</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <span className="font-medium text-black dark:text-white">Account Name:</span> 
                <span>EduLMS Foundation</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <span className="font-medium text-black dark:text-white">Account Number:</span> 
                <span className="font-mono">123456789012</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-black dark:text-white">IFSC Code:</span> 
                <span className="font-mono">EXBK0001234</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsSubmitted(false); setIsOpen(false); setFormData({name:'', email:'', contact:'', message:''}); }} 
            className="text-sm text-zinc-500 hover:text-black dark:hover:text-white transition-colors underline underline-offset-4"
          >
            Start Over
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-gold-200/50 dark:border-gold-900/30 shadow-md relative min-h-[400px]"
    >
      <div className="flex justify-between items-center mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h2 className="text-2xl font-bold text-black dark:text-white flex items-center">
          <span className="w-8 h-8 bg-gold-500 text-black rounded-lg flex items-center justify-center mr-3 text-lg">
            {title}
          </span>
          Donation Details
        </h2>
        <button 
          onClick={() => setIsOpen(false)} 
          className="p-2 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white bg-zinc-200/50 dark:bg-zinc-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Full Name *</label>
          <input 
            required 
            type="text" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors" 
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email Address *</label>
          <input 
            required 
            type="email" 
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors" 
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Contact Number *</label>
          <input 
            required 
            type="tel" 
            value={formData.contact}
            onChange={e => setFormData({...formData, contact: e.target.value})}
            className="w-full p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors" 
            placeholder="+91 98765 43210"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Message (Optional)</label>
          <textarea 
            rows={3}
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
            className="w-full p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors resize-none" 
            placeholder="Leave a message with your donation..."
          ></textarea>
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-4 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors font-bold shadow-sm shadow-gold-900/20 disabled:opacity-70 mt-2 flex justify-center items-center"
        >
          {isSubmitting ? 'Processing...' : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Proceed to Payment
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default function Donation() {
  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-black dark:text-white mb-4 tracking-tight"
          >
            Support Our Mission
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            Your generous donation helps us provide quality education to students worldwide, regardless of their financial background.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <DonationSide title="A" />
          <DonationSide title="B" />
        </div>
      </div>
    </div>
  );
}
