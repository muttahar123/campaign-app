import React, { useState } from 'react';
import { X } from 'lucide-react';

export function CreateCampaignModal({ isOpen, onClose, onCreated, token }) {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    budget: '',
    status: 'draft'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:4000/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          client: formData.client,
          budget: Number(formData.budget),
          status: formData.status
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create campaign');

      onCreated(data); 
      onClose();
      setFormData({ name: '', client: '', budget: '', status: 'draft' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold">Create New Campaign</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="text-rose-500 text-sm bg-rose-50 p-3 rounded-lg dark:bg-rose-500/10 text-center font-medium">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium mb-1">Campaign Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background border border-border p-2.5 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all" placeholder="Summer Ad Boost" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Client Name</label>
            <input required type="text" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} className="w-full bg-background border border-border p-2.5 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all" placeholder="Acme Corp" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Total Budget ($)</label>
              <input required type="number" min="0" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="w-full bg-background border border-border p-2.5 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all" placeholder="10000" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-background border border-border p-2.5 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all">
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-70">
              {isSubmitting ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
