import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DateRangePicker } from './components/ui/DateRangePicker';
import { KPICards } from './components/dashboard/KPICards';
import { PerformanceChart } from './components/dashboard/PerformanceChart';
import { CampaignTable } from './components/dashboard/CampaignTable';
import { CreativeBriefBuilder } from './components/ai-builder/CreativeBriefBuilder';
import { useDarkMode } from './hooks/useDarkMode';
import mockData from './data/mockData.json';
import { io } from 'socket.io-client';

function App() {
  const [isDark, toggleDarkMode] = useDarkMode();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [token, setToken] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Silent automatic login to fetch JWT on load
    const fetchToken = async () => {
      try {
        const username = "demo_" + Math.random().toString(36).substring(7);
        await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password: 'password123' })
        });
        
        const res = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password: 'password123' })
        });
        
        const data = await res.json();
        if (data.token) {
          setToken(data.token);
        }
      } catch (err) {
        console.error("Silent authentication failed:", err);
      }
    };
    fetchToken();
  }, []);

  // Set up socket integration for Notifications Requirement
  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    
    newSocket.on('budget_alert', (data) => {
      // Append unread alert
      setNotifications(prev => [{ is_read: false, ...data }, ...prev].slice(0, 10));
    });

    // Mock initial notification for display
    setNotifications([{ is_read: false, message: 'Alert: Campaign App Install Sprint dropped below 1% CTR.' }]);

    return () => newSocket.close();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <Header isDark={isDark} toggleDarkMode={toggleDarkMode} notifications={notifications} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 overflow-y-auto w-full p-4 lg:p-8">
          <div className="container mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out">
            
            {activeTab === 'dashboard' ? (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 mt-2 animate-in fade-in slide-in-from-left-2 gap-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-1 dark:text-slate-400">Track your campaign performance metrics in real-time.</p>
                  </div>
                  <DateRangePicker />
                </div>

                <KPICards summary={mockData.summary} />
                <PerformanceChart trendsData={mockData.trends} />
                <CampaignTable campaigns={mockData.campaigns} />
              </>
            ) : activeTab === 'builder' ? (
               <CreativeBriefBuilder jwtToken={token} />
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500">
                <p>Select Dashboard or AI Builder to explore.</p>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
