import React from 'react';
import { CampaignTable } from './CampaignTable';
import { Plus } from 'lucide-react';

export function CampaignsView({ campaigns, onEditClick, onDeleteClick, setCreateModalOpen }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">All Campaigns</h1>
          <p className="text-slate-500 mt-1 dark:text-slate-400">View and manage the complete directory of your tracking metrics.</p>
        </div>
        <button 
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      <CampaignTable 
        campaigns={campaigns} 
        onEditClick={onEditClick} 
        onDeleteClick={onDeleteClick} 
      />
    </div>
  );
}
