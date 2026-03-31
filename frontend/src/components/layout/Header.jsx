import React from 'react';
import { Moon, Sun, Activity } from 'lucide-react';
import { cn } from '../ui/Card';

export function Header({ isDark, toggleDarkMode, activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 mr-4 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="bg-primary/10 p-2 rounded-lg">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">CampaignHQ</span>
          </div>

          <nav className="flex items-center space-x-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                activeTab === 'dashboard' 
                  ? "bg-primary/10 text-primary" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
              )}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('ai-builder')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                activeTab === 'ai-builder' 
                  ? "bg-primary/10 text-primary" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
              )}
            >
              AI Brief Builder
            </button>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
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
