import React from 'react';
import { LayoutDashboard, Megaphone, Settings, Users, Box } from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'builder', label: 'AI Builder', icon: Box },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border hidden lg:flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 pt-6 flex flex-col gap-1">
        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Navigation</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          )
        })}
      </div>
    </aside>
  );
}
