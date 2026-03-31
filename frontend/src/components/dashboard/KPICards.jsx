import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Eye, MousePointerClick, TrendingUp, DollarSign, Target, ActivitySquare } from 'lucide-react';

export function KPICards({ summary }) {
  const cards = [
    {
      title: "Total Impressions",
      value: new Intl.NumberFormat('en-US').format(summary.totalImpressions),
      icon: Eye,
      trend: "+12.5%", trendUp: true
    },
    {
      title: "Total Clicks",
      value: new Intl.NumberFormat('en-US').format(summary.totalClicks),
      icon: MousePointerClick,
      trend: "+8.2%", trendUp: true
    },
    {
      title: "Conversions",
      value: new Intl.NumberFormat('en-US').format(summary.totalConversions),
      icon: Target,
      trend: "+15.3%", trendUp: true
    },
    {
      title: "Average CTR",
      value: `${summary.avgCTR}%`,
      icon: ActivitySquare,
      trend: "+1.2%", trendUp: true
    },
    {
      title: "Average ROAS",
      value: `${summary.avgROAS}x`,
      icon: TrendingUp,
      trend: "-0.4%", trendUp: false
    },
    {
      title: "Total Spend",
      value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(summary.totalSpend),
      icon: DollarSign,
      trend: "+5.1%", trendUp: false
    }
  ];

  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-6 mt-8">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
              <CardTitle className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">{card.title}</CardTitle>
              <div className="bg-primary/10 p-1.5 rounded-md">
                <Icon className="h-3 w-3 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-xl font-bold">{card.value}</div>
              <p className={`text-[10px] mt-1 font-medium ${card.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {card.trend} <span className="text-slate-500 dark:text-slate-400 font-normal">vs last mo</span>
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  );
}
