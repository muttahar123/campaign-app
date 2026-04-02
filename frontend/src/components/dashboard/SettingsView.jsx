import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { User, Shield, Moon, Sun } from 'lucide-react';

export function SettingsView({ isDark, toggleDarkMode, onLogout }) {
  const [profileData, setProfileData] = useState({ name: 'Active User', email: 'user@neoagency.com' });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out max-w-3xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 mt-1 dark:text-slate-400">Manage your account preferences and application settings.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
          <CardHeader className="border-b border-border bg-slate-50/50 dark:bg-slate-900/50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-primary" /> Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Display Name</label>
                  <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full bg-background border border-border p-2.5 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Email Address</label>
                  <input type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} className="w-full bg-background border border-border p-2.5 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none text-slate-900 dark:text-white" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                <button type="button" onClick={onLogout} className="text-sm px-4 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg font-medium transition-colors">Sign Out</button>
                <div className="flex items-center gap-3">
                  {isSaved && <span className="text-sm text-emerald-500 animate-in fade-in">Preferences Saved!</span>}
                  <button type="submit" className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">Save Profile</button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
          <CardHeader className="border-b border-border bg-slate-50/50 dark:bg-slate-900/50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-primary" /> Application Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Appearance Theme</h3>
                <p className="text-sm text-slate-500 mt-1">Toggle between light and dark visual modes.</p>
              </div>
              <button type="button" onClick={toggleDarkMode} className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl shadow-sm hover:ring-2 ring-primary/50 transition-all pointer-events-auto">
                {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>
            
            <hr className="border-border" />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">
                  Real-time Notifications
                </h3>
                <p className="text-sm text-slate-500 mt-1">Receive WebSocket budget alert pushes immediately.</p>
              </div>
              <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold uppercase tracking-wider">
                Enabled
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
