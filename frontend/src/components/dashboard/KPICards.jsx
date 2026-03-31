import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Eye, MousePointerClick, TrendingUp, DollarSign } from 'lucide-react';

export function KPICards({ summary }) {
  const cards = [
    {
      title: "Total Impressions",
      value: new Intl.NumberFormat('en-US').format(summary.totalImpressions),
      icon: Eye,
      trend: "+12.5%",
      trendUp: true
    },
    {
      title: "Average CTR",
      value: `${summary.avgCTR}%`,
      icon: MousePointerClick,
      trend: "+1.2%",
      trendUp: true
    },
    {
      title: "Average ROAS",
      value: `${summary.avgROAS}x`,
      icon: TrendingUp,
      trend: "-0.4%",
      trendUp: false
    },
    {
      title: "Total Spend",
      value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(summary.totalSpend),
      icon: DollarSign,
      trend: "+5.1%",
      trendUp: false
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">{card.title}</CardTitle>
              <div className="bg-primary/10 p-2 rounded-full">
                <Icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className={`text-xs mt-1 font-medium ${card.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {card.trend} <span className="text-slate-500 dark:text-slate-400 font-normal">from last month</span>
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  );
}
