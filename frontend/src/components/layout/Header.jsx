import React, { useState } from 'react';
import { Moon, Sun, Activity, Bell } from 'lucide-react';

export function Header({ isDark, toggleDarkMode, notifications = [] }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">CampaignHQ</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-transparent text-foreground hover:bg-border/50 transition-colors mr-2"
            >
              <Bell className="h-4 w-4 text-slate-700 dark:text-slate-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-white dark:border-slate-900"></span>
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50 py-2">
                <div className="px-4 py-2 border-b border-border flex justify-between items-center">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <span className="text-xs text-primary cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">No new alerts</div>
                  ) : (
                    notifications.map((notif, i) => (
                      <div key={i} className={`p-4 text-sm border-b border-border last:border-0 ${!notif.is_read ? 'bg-primary/5' : ''}`}>
                        <p className="text-slate-800 dark:text-slate-200">{notif.message}</p>
                        <span className="text-xs text-slate-400 mt-1 block">Just now</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={toggleDarkMode}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-transparent text-foreground hover:bg-border/50 transition-colors"
            arial-label="Toggle dark mode"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
}
