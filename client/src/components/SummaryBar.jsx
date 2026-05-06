import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function SummaryBar({ expenses }) {
  const totalRef = useRef(null);
  
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Calculate category totals
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const categoryConfig = {
    Food: { emoji: '🍕', color: 'text-orange-400', bg: 'bg-orange-400/10' },
    Travel: { emoji: '🚗', color: 'text-sky-400', bg: 'bg-sky-400/10' },
    Coffee: { emoji: '☕', color: 'text-amber-400', bg: 'bg-amber-400/10' },
    Shopping: { emoji: '🛍️', color: 'text-pink-400', bg: 'bg-pink-400/10' },
    Entertainment: { emoji: '🎮', color: 'text-purple-400', bg: 'bg-purple-400/10' },
    Other: { emoji: '📦', color: 'text-slate-400', bg: 'bg-slate-400/10' },
  };

  useEffect(() => {
    if (totalRef.current) {
      gsap.to(totalRef.current, {
        innerHTML: totalSpent,
        duration: 1,
        snap: { innerHTML: 1 },
        ease: 'power3.out',
        // Optional: formatting to add commas could be done via onUpdate, 
        // but simple integers are fine here for student expenses.
      });
    }
  }, [totalSpent]);

  return (
    <div className="mb-8">
      <div className="glass p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
        <h2 className="text-[var(--muted)] text-sm uppercase tracking-widest font-semibold mb-2 font-sans">Total Spent</h2>
        <div className="flex items-start">
          <span className="text-[var(--accent)] text-2xl font-bold mt-2 mr-1">₹</span>
          <span ref={totalRef} className="text-5xl font-extrabold tracking-tight font-display font-mono-numbers">
            0
          </span>
        </div>
      </div>

      {Object.keys(categoryTotals).length > 0 && (
        <div className="flex gap-3 overflow-x-auto py-4 mt-2 no-scrollbar">
          {Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1]) // Sort by amount descending
            .map(([category, amount]) => {
              const config = categoryConfig[category] || categoryConfig.Other;
              return (
                <div 
                  key={category} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap border border-[var(--border)] ${config.bg}`}
                >
                  <span className="text-sm">{config.emoji}</span>
                  <span className={`font-semibold text-sm ${config.color}`}>{category}</span>
                  <span className="text-[var(--text)] font-mono-numbers text-sm ml-1">₹{amount}</span>
                </div>
              );
          })}
        </div>
      )}
    </div>
  );
}
