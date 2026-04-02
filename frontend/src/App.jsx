import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DateRangePicker } from './components/ui/DateRangePicker';
import { KPICards } from './components/dashboard/KPICards';
import { PerformanceChart } from './components/dashboard/PerformanceChart';
import { CampaignTable } from './components/dashboard/CampaignTable';
import { CampaignsView } from './components/dashboard/CampaignsView';
import { ClientsView } from './components/dashboard/ClientsView';
import { SettingsView } from './components/dashboard/SettingsView';
import { AISuite } from './components/ai-builder/AISuite';
import { AuthScreens } from './components/auth/AuthScreens';
import { CreateCampaignModal } from './components/dashboard/CreateCampaignModal';
import { EditCampaignModal } from './components/dashboard/EditCampaignModal';
import { useDarkMode } from './hooks/useDarkMode';
import { io } from 'socket.io-client';
import { Plus } from 'lucide-react';

function App() {
  const [isDark, toggleDarkMode] = useDarkMode();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [token, setToken] = useState(localStorage.getItem('jwt_token') || null);
  
  const [campaigns, setCampaigns] = useState([]);
  const [kpiSummary, setKpiSummary] = useState({
    totalImpressions: 0, totalClicks: 0, totalConversions: 0, avgCTR: 0, avgROAS: 0, totalSpend: 0
  });
  
  const [notifications, setNotifications] = useState([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [campaignToEdit, setCampaignToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Authentication persistence
  useEffect(() => {
    if (token) {
      localStorage.setItem('jwt_token', token);
      fetchCampaigns();
    } else {
      localStorage.removeItem('jwt_token');
    }
  }, [token]);

  // Socket Integration
  useEffect(() => {
    if (!token) return;
    
    // Explicitly connect to :4000 as configured
    const newSocket = io('http://localhost:4000');
    
    newSocket.on('budget_alert', (data) => {
      setNotifications(prev => [{ is_read: false, ...data }, ...prev].slice(0, 10));
    });

    return () => newSocket.close();
  }, [token]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/campaigns?limit=50', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok) {
        setCampaigns(json.data || []);
        computeKPIs(json.data || []);
      } else {
        if (res.status === 401 || res.status === 403) setToken(null);
      }
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    } finally {
      setIsLoading(false);
    }
  };

  const computeKPIs = (data) => {
    let spend = 0; let imp = 0; let clicks = 0; let conversions = 0; let budget = 0;
    data.forEach(c => {
      spend += Number(c.spend);
      imp += Number(c.impressions);
      clicks += Number(c.clicks);
      conversions += Number(c.conversions);
    });
    
    const ctr = imp > 0 ? ((clicks / imp) * 100).toFixed(2) : 0;
    const roas = spend > 0 ? (conversions / spend).toFixed(2) : 0;
    
    setKpiSummary({
      totalImpressions: imp,
      totalClicks: clicks,
      totalConversions: conversions,
      avgCTR: ctr,
      avgROAS: roas,
      totalSpend: spend
    });
  };

  const logout = () => {
    setToken(null);
    setCampaigns([]);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const markOneRead = (index) => {
    setNotifications(prev => prev.map((n, i) => i === index ? { ...n, is_read: true } : n));
  };

  const handleEditClick = (campaign) => {
    setCampaignToEdit(campaign);
    setEditModalOpen(true);
  };

  const handleDeleteClick = async (campaign) => {
    if (!confirm(`Are you sure you want to delete ${campaign.name}?`)) return;
    try {
      const res = await fetch(`http://localhost:4000/api/campaigns/${campaign.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCampaigns(prev => {
          const filtered = prev.filter(c => c.id !== campaign.id);
          computeKPIs(filtered);
          return filtered;
        });
      } else {
        alert('Failed to delete campaign');
      }
    } catch(err) {
      console.error(err);
    }
  };

  if (!token) {
    return <AuthScreens setToken={setToken} />;
  }

  // Generate basic mock trends for chart to keep it looking nice
  const mockTrends = [
    { date: "Day 1", impressions: Math.random()*100000, spend: Math.random()*5000 },
    { date: "Day 5", impressions: Math.random()*100000, spend: Math.random()*5000 },
    { date: "Day 10", impressions: Math.random()*100000, spend: Math.random()*5000 },
    { date: "Day 15", impressions: Math.random()*100000, spend: Math.random()*5000 },
    { date: "Day 20", impressions: Math.random()*100000, spend: Math.random()*5000 },
  ];

  return (
    <div className="h-screen flex flex-col bg-background text-foreground transition-colors duration-200 overflow-hidden">
      <Header 
        isDark={isDark} 
        toggleDarkMode={toggleDarkMode} 
        notifications={notifications}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onMarkAllRead={markAllRead}
        onMarkOneRead={markOneRead}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
        />
        
        <main className="flex-1 overflow-y-auto w-full p-4 lg:p-8">
          <div className="container mx-auto max-w-7xl">
            <div className="flex justify-end mb-4 pr-1">
               <button onClick={logout} className="text-xs font-semibold text-slate-500 hover:text-rose-500 transition-colors uppercase tracking-wider">Sign Out</button>
            </div>
            
            {activeTab === 'dashboard' ? (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 mt-2 gap-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-1 dark:text-slate-400">Track your campaign performance metrics in real-time.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <DateRangePicker />
                    <button 
                      onClick={() => setCreateModalOpen(true)}
                      className="flex items-center gap-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-white transition-colors"
                    >
                      <Plus className="w-4 h-4" /> New Campaign
                    </button>
                  </div>
                </div>

                <KPICards summary={kpiSummary} />
                <PerformanceChart trendsData={mockTrends} />
                
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center mt-6 border border-border rounded-lg text-slate-500">Loading live data from PostgreSQL...</div>
                ) : (
                  <CampaignTable 
                    campaigns={campaigns} 
                    onEditClick={handleEditClick} 
                    onDeleteClick={handleDeleteClick} 
                  />
                )}

              </>
            ) : activeTab === 'clients' ? (
              <ClientsView campaigns={campaigns} />
            ) : activeTab === 'campaigns' ? (
              <CampaignsView 
                campaigns={campaigns} 
                onEditClick={handleEditClick} 
                onDeleteClick={handleDeleteClick} 
                setCreateModalOpen={setCreateModalOpen} 
              />
            ) : activeTab === 'builder' ? (
               <AISuite jwtToken={token} />
            ) : activeTab === 'settings' ? (
               <SettingsView 
                 isDark={isDark} 
                 toggleDarkMode={toggleDarkMode} 
                 onLogout={logout} 
               />
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500">
                <p>Development in progress...</p>
              </div>
            )}

          </div>
        </main>
      </div>

      <CreateCampaignModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
        token={token} 
        onCreated={(newCamp) => {
          setCampaigns([newCamp, ...campaigns]);
          computeKPIs([newCamp, ...campaigns]);
        }} 
      />
      
      <EditCampaignModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        token={token}
        campaign={campaignToEdit}
        onUpdated={(updatedCamp) => {
          setCampaigns(prev => {
            const mapped = prev.map(c => c.id === updatedCamp.id ? updatedCamp : c);
            computeKPIs(mapped);
            return mapped;
          });
        }}
      />
    </div>
  );
}

export default App;
