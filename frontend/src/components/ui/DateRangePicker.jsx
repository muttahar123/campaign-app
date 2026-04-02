import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function formatDate(d) {
  if (!d) return '';
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function formatShort(d) {
  if (!d) return '';
  return `${MONTHS[d.getMonth()].slice(0,3)} ${d.getDate()}`;
}

export function DateRangePicker({ onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const presets = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
    { label: 'This month', days: 'month' },
  ];

  const applyPreset = (preset) => {
    const end = new Date();
    let start;
    if (preset.days === 'month') {
      start = new Date(end.getFullYear(), end.getMonth(), 1);
    } else {
      start = new Date();
      start.setDate(end.getDate() - preset.days);
    }
    setStartDate(start);
    setEndDate(end);
    setViewYear(start.getFullYear());
    setViewMonth(start.getMonth());
    setIsOpen(false);
    if (onChange) onChange({ start, end, label: preset.label });
  };

  const handleDayClick = (day) => {
    const clicked = new Date(viewYear, viewMonth, day);
    if (!startDate || (startDate && endDate)) {
      setStartDate(clicked);
      setEndDate(null);
    } else {
      if (clicked < startDate) {
        setEndDate(startDate);
        setStartDate(clicked);
      } else {
        setEndDate(clicked);
      }
      setIsOpen(false);
      // Notify parent with the final range
      const finalStart = clicked < startDate ? clicked : startDate;
      const finalEnd = clicked < startDate ? startDate : clicked;
      if (onChange) onChange({ start: finalStart, end: finalEnd, label: 'Custom' });
    }
  };

  const isInRange = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    const s = startDate;
    const e = endDate || hoverDate;
    if (!s || !e) return false;
    const lo = s < e ? s : e;
    const hi = s < e ? e : s;
    return d > lo && d < hi;
  };

  const isStart = (day) => startDate && new Date(viewYear, viewMonth, day).toDateString() === startDate.toDateString();
  const isEnd = (day) => {
    const target = endDate || hoverDate;
    return target && new Date(viewYear, viewMonth, day).toDateString() === target.toDateString();
  };
  const isToday = (day) => new Date(viewYear, viewMonth, day).toDateString() === new Date().toDateString();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const displayLabel = startDate && endDate
    ? `${formatShort(startDate)} – ${formatShort(endDate)}`
    : startDate
    ? `${formatShort(startDate)} – ...`
    : 'Select dates';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-background border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <Calendar className="w-4 h-4 text-slate-500" />
        <span className="max-w-[160px] truncate">{displayLabel}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-[60] p-0 flex overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Presets Panel */}
          <div className="w-36 border-r border-border py-3 hidden sm:block">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Select</p>
            {presets.map(p => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className="w-full text-left px-4 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="p-4 w-[280px]">
            {/* Month Nav */}
            <div className="flex items-center justify-between mb-3">
              <button onClick={prevMonth} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <ChevronLeft className="w-4 h-4 text-slate-500" />
              </button>
              <span className="text-sm font-semibold text-slate-800 dark:text-white">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button onClick={nextMonth} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase py-1">{d}</div>
              ))}
            </div>

            {/* Day Cells */}
            <div className="grid grid-cols-7">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const selected = isStart(day) || isEnd(day);
                const inRange = isInRange(day);
                const today = isToday(day);

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    onMouseEnter={() => { if (startDate && !endDate) setHoverDate(new Date(viewYear, viewMonth, day)); }}
                    className={`
                      w-full aspect-square flex items-center justify-center text-xs rounded-md transition-all duration-100
                      ${selected
                        ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                        : inRange
                        ? 'bg-primary/10 text-primary'
                        : today
                        ? 'ring-1 ring-primary/50 text-primary font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            {startDate && (
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {formatDate(startDate)} → {endDate ? formatDate(endDate) : '...'}
                </span>
                <button
                  onClick={() => { setStartDate(null); setEndDate(null); }}
                  className="text-[10px] text-rose-500 hover:underline font-medium"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
