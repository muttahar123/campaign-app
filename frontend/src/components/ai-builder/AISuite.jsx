import React, { useState } from 'react';
import { CreativeBriefBuilder } from './CreativeBriefBuilder';
import { SocialGenerator } from './SocialGenerator';
import { HashtagGenerator } from './HashtagGenerator';
import { FileText, Share2, Hash } from 'lucide-react';

export function AISuite({ jwtToken }) {
  const [activeTab, setActiveTab] = useState('brief');

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      <div className="flex justify-center mb-6 pt-4">
        <div className="inline-flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl shadow-inner">
          <button onClick={() => setActiveTab('brief')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'brief' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            <FileText className="w-4 h-4" /> Creative Brief
          </button>
          <button onClick={() => setActiveTab('social')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'social' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            <Share2 className="w-4 h-4" /> Social Content
          </button>
          <button onClick={() => setActiveTab('hashtags')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'hashtags' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            <Hash className="w-4 h-4" /> Hashtags
          </button>
        </div>
      </div>

      <div className="flex-1 w-full relative">
        {activeTab === 'brief' && <CreativeBriefBuilder jwtToken={jwtToken} />}
        {activeTab === 'social' && <SocialGenerator jwtToken={jwtToken} />}
        {activeTab === 'hashtags' && <HashtagGenerator jwtToken={jwtToken} />}
      </div>
    </div>
  );
}
