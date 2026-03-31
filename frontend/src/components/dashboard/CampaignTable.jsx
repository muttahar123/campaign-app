import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Search, ArrowUpDown } from 'lucide-react';

export function CampaignTable({ campaigns }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'spend', direction: 'desc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedCampaigns = useMemo(() => {
    let sortableItems = [...campaigns];
    
    // Filter
    if (searchTerm) {
      sortableItems = sortableItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    sortableItems.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sortableItems;
  }, [campaigns, searchTerm, sortConfig]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <Card className="mt-6 border-slate-200 shadow-sm dark:border-slate-800">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
        <CardTitle>Active Campaigns</CardTitle>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="bg-background border border-border text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2 transition-colors outline-none"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm text-left text-foreground">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900 border-b border-border text-slate-500 dark:text-slate-400">
              <tr>
                <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center font-semibold tracking-wider">
                    Campaign Name
                    <ArrowUpDown className="w-3 h-3 ml-2 opacity-70" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('status')}>
                  <div className="flex items-center font-semibold tracking-wider">
                    Status
                    <ArrowUpDown className="w-3 h-3 ml-2 opacity-70" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('budget')}>
                  <div className="flex items-center font-semibold tracking-wider">
                    Budget
                    <ArrowUpDown className="w-3 h-3 ml-2 opacity-70" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('spend')}>
                  <div className="flex items-center font-semibold tracking-wider">
                    Spend
                    <ArrowUpDown className="w-3 h-3 ml-2 opacity-70" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('roas')}>
                  <div className="flex items-center font-semibold tracking-wider">
                    ROAS
                    <ArrowUpDown className="w-3 h-3 ml-2 opacity-70" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAndSortedCampaigns.length > 0 ? (
                filteredAndSortedCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="bg-card hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      {campaign.name}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={campaign.status} className="capitalize">
                        {campaign.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">
                      {formatCurrency(campaign.budget)}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">
                      <div className="flex flex-col gap-1.5">
                        <span>{formatCurrency(campaign.spend)}</span>
                        {campaign.spend > 0 && campaign.budget > 0 && (
                          <div className="w-32 bg-slate-200 rounded-full h-1.5 dark:bg-slate-700 overflow-hidden">
                            <div 
                              className={`h-1.5 rounded-full ${campaign.spend >= campaign.budget * 0.9 ? 'bg-rose-500' : 'bg-primary'}`} 
                              style={{ width: `${Math.min((campaign.spend / campaign.budget) * 100, 100)}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      <span className={campaign.roas >= 3 ? 'text-emerald-500' : campaign.roas >= 2 ? 'text-amber-500' : 'text-rose-500'}>
                        {campaign.roas.toFixed(1)}x
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No campaigns found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
