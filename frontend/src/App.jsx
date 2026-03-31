import React from 'react';
import { Header } from './components/layout/Header';
import { KPICards } from './components/dashboard/KPICards';
import { PerformanceChart } from './components/dashboard/PerformanceChart';
import { CampaignTable } from './components/dashboard/CampaignTable';
import { useDarkMode } from './hooks/useDarkMode';
import mockData from './data/mockData.json';

function App() {
  const [isDark, toggleDarkMode] = useDarkMode();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <Header isDark={isDark} toggleDarkMode={toggleDarkMode} />
      
      <main className="flex-1 w-full p-4 lg:p-8">
        <div className="container mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out">
          
          <div className="flex justify-between items-end mb-6 mt-2">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
              <p className="text-slate-500 mt-1 dark:text-slate-400">Track your campaign performance metrics in real-time.</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <KPICards summary={mockData.summary} />
          
          {/* Main Visualizations */}
          <PerformanceChart trendsData={mockData.trends} />
          
          {/* Data Tables */}
          <CampaignTable campaigns={mockData.campaigns} />

        </div>
      </main>
    </div>
  );
}

export default App;
