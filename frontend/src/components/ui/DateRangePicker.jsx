import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

export function DateRangePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Last 30d');
  
  const presets = ['Last 7d', 'Last 30d', 'Last 90d', 'Custom'];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-background border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <Calendar className="w-4 h-4 text-slate-500" />
        {selectedRange}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 py-1">
          {presets.map(preset => (
            <button
              key={preset}
              onClick={() => {
                setSelectedRange(preset);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 ${selectedRange === preset ? 'text-primary font-semibold' : 'text-slate-700 dark:text-slate-300'}`}
            >
              {preset}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
