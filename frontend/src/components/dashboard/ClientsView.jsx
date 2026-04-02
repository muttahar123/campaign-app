import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Users, TrendingUp, DollarSign } from 'lucide-react';

export function ClientsView({ campaigns }) {
  const clientsData = useMemo(() => {
    const clientsMap = {};

    campaigns.forEach(c => {
      if (!clientsMap[c.client]) {
        clientsMap[c.client] = {
          name: c.client,
          totalCampaigns: 0,
          totalBudget: 0,
          totalSpend: 0,
          conversions: 0
        };
      }
      clientsMap[c.client].totalCampaigns += 1;
      clientsMap[c.client].totalBudget += Number(c.budget) || 0;
      clientsMap[c.client].totalSpend += Number(c.spend) || 0;
      clientsMap[c.client].conversions += Number(c.conversions) || 0;
    });

    return Object.values(clientsMap).map(client => {
      client.roas = client.totalSpend > 0 ? (client.conversions / client.totalSpend) : 0;
      return client;
    }).sort((a, b) => b.totalSpend - a.totalSpend);
  }, [campaigns]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Clients Directory</h1>
        <p className="text-slate-500 mt-1 dark:text-slate-400">Manage your active clients and their aggregate performance.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase">Total Clients</p>
              <h3 className="text-2xl font-bold">{clientsData.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase">Total Managed Budget</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(clientsData.reduce((acc, curr) => acc + curr.totalBudget, 0))}
              </h3>
            </div>
          </CardContent>
        </Card>

         <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase">Avg Configured ROAS</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {clientsData.length > 0 ? (clientsData.reduce((acc, curr) => acc + curr.roas, 0) / clientsData.length).toFixed(1) : 0}x
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader>
          <CardTitle>Client Roster</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm text-left text-foreground">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900 border-b border-border text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Active Campaigns</th>
                  <th className="px-6 py-4">Total Budget</th>
                  <th className="px-6 py-4">Total Spend</th>
                  <th className="px-6 py-4">Avg ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clientsData.length > 0 ? (
                  clientsData.map((client, idx) => (
                    <tr key={idx} className="bg-card hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                        {client.name}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-300">
                        {client.totalCampaigns}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">
                        {formatCurrency(client.totalBudget)}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">
                        {formatCurrency(client.totalSpend)}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        <span className={client.roas >= 3 ? 'text-emerald-500' : client.roas >= 2 ? 'text-amber-500' : 'text-rose-500'}>
                          {client.roas.toFixed(1)}x
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      No client data available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
