import React from 'react';
import { LayoutDashboard, Users, Megaphone, Settings, Sparkles, X } from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const tabs = [
    { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'clients', icon: <Users className="w-5 h-5" />, label: 'Clients' },
    { id: 'campaigns', icon: <Megaphone className="w-5 h-5" />, label: 'Campaigns' },
    { id: 'builder', icon: <Sparkles className="w-5 h-5" />, label: 'AI Builder' },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  ];

  const handleTabClick = (id) => {
    setActiveTab(id);
    if (setIsOpen) setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[45] lg:hidden animate-in fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`fixed lg:static inset-y-0 left-0 z-[50] w-64 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="flex justify-end p-4 lg:hidden">
          <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Navigation</p>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              AU
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Active User</p>
              <p className="text-xs text-slate-500 truncate">user@neoagency.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
