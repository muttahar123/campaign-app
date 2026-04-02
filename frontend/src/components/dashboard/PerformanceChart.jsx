import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function PerformanceChart({ trendsData }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card text-card-foreground border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="capitalize">{entry.name}:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {entry.name === 'Spend' ? `$${new Intl.NumberFormat('en-US').format(entry.value)}` : new Intl.NumberFormat('en-US').format(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Performance Trends (30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full mt-4">
          <ResponsiveContainer width="100%" height={400} minWidth={0}>
            <LineChart
              data={trendsData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                yAxisId="left" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                dx={-10}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                dx={10}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="impressions" 
                name="Impressions"
                stroke="#6366f1" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="spend" 
                name="Spend"
                stroke="#14b8a6" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
