import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { TrendingUp, TrendingDown, Flame, Shield, Zap, Calendar } from 'lucide-react';
import ExpenseList from './ExpenseList';

const categoryConfig = {
  Food: { emoji: '🍕', color: '#fb923c' },
  Travel: { emoji: '🚗', color: '#38bdf8' },
  Coffee: { emoji: '☕', color: '#fbbf24' },
  Shopping: { emoji: '🛍️', color: '#f472b6' },
  Entertainment: { emoji: '🎮', color: '#a78bfa' },
  Other: { emoji: '📦', color: '#94a3b8' },
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return { text: 'Late night, huh?', emoji: '🌙' };
  if (hour < 12) return { text: 'Good Morning', emoji: '☀️' };
  if (hour < 17) return { text: 'Good Afternoon', emoji: '🌤️' };
  if (hour < 21) return { text: 'Good Evening', emoji: '🌆' };
  return { text: 'Night Owl Mode', emoji: '🦉' };
}

function BudgetRing({ percentage, isOver }) {
  const ringRef = useRef(null);
  const clamped = Math.min(percentage, 100);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (clamped / 100) * circumference;

  const getColor = () => {
    if (percentage > 90) return '#ef4444';
    if (percentage > 70) return '#f59e0b';
    if (percentage > 50) return '#3b82f6';
    return '#10b981';
  };

  useEffect(() => {
    if (ringRef.current) {
      gsap.fromTo(ringRef.current,
        { strokeDashoffset: circumference },
        { strokeDashoffset: offset, duration: 1.5, ease: 'power3.out', delay: 0.3 }
      );
    }
  }, [offset, circumference]);

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60" cy="60" r="54"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        <circle
          ref={ringRef}
          cx="60" cy="60" r="54"
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{
            filter: `drop-shadow(0 0 8px ${getColor()}80)`,
            transition: 'stroke 0.5s ease',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black font-mono-numbers" style={{ color: getColor() }}>
          {Math.round(clamped)}%
        </span>
        <span className="text-[10px] uppercase tracking-widest text-white/40 mt-0.5">
          {isOver ? 'Over Limit!' : 'Used'}
        </span>
      </div>
      {percentage > 90 && (
        <div className="absolute inset-0 rounded-full animate-ping opacity-10" 
          style={{ border: `2px solid ${getColor()}` }} 
        />
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subtext, accentColor, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, delay }}
      whileHover={{ y: -8, scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      style={{ transition: 'box-shadow 0.3s ease' }}
      className="glass rounded-2xl p-5 border border-white/5 relative overflow-hidden group cursor-default hover:border-white/15 hover:shadow-[0_8px_32px_rgba(255,255,255,0.06)]"
    >
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500"
        style={{ background: accentColor, filter: 'blur(20px)', transform: 'translate(30%, -30%)' }}
      />
      <div className="flex items-center gap-2.5 mb-3">
        <div className="p-2 rounded-lg border border-white/10" style={{ background: `${accentColor}15` }}>
          <Icon className="w-4 h-4" style={{ color: accentColor }} />
        </div>
        <span className="text-[11px] uppercase tracking-widest text-white/40 font-semibold">{label}</span>
      </div>
      <p className="text-2xl font-black font-mono-numbers text-white tracking-tight">{value}</p>
      {subtext && (
        <p className="text-xs text-white/35 mt-1.5">{subtext}</p>
      )}
    </motion.div>
  );
}

export default function BentoDashboard({ expenses, totalExpenses, monthlyLimit, currentBalance, percentageUsed, isOverLimit, onDelete }) {
  const headerRef = useRef(null);
  const greeting = getGreeting();
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });

  // Computed stats
  const biggestHit = useMemo(() => {
    if (expenses.length === 0) return null;
    return expenses.reduce((max, exp) => exp.amount > max.amount ? exp : max, expenses[0]);
  }, [expenses]);

  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - today.getDate();
  const remaining = monthlyLimit - totalExpenses;
  const safeToSpend = daysLeft > 0 ? Math.max(0, remaining / daysLeft) : 0;

  // Today's spending
  const todaySpent = useMemo(() => {
    const todayStr = today.toISOString().split('T')[0];
    return expenses
      .filter(e => e.date && e.date.startsWith(todayStr))
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses, today]);

  // Top category
  const topCategory = useMemo(() => {
    if (expenses.length === 0) return null;
    const cats = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
    const top = Object.entries(cats).sort((a, b) => b[1] - a[1])[0];
    return top ? { name: top[0], amount: top[1] } : null;
  }, [expenses]);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current, 
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <div className="min-h-screen pb-24 pt-6 md:pt-10 px-4 max-w-[560px] mx-auto w-full relative z-10">
      
      {/* Greeting Header */}
      <header ref={headerRef} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-4xl font-extrabold text-white tracking-tighter"
            >
              BrokeBoy<span className="text-white/40">.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/40 text-[11px] mt-1 font-bold uppercase tracking-[0.2em]"
            >
              {greeting.emoji} {greeting.text} — {dateStr}
            </motion.p>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.4 }}
            className="glass px-3 py-1.5 rounded-full border border-white/10 text-xs text-white/50 font-semibold"
          >
            {daysLeft}d left
          </motion.div>
        </div>
      </header>

      {/* Budget Ring + Total */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass rounded-3xl p-6 mb-6 border border-white/5 relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--accent)] rounded-full opacity-[0.03] blur-2xl" />
        <div className="flex items-center gap-6">
          <BudgetRing percentage={parseFloat(percentageUsed)} isOver={isOverLimit} />
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-semibold mb-1">Total Spent</p>
            <div className="flex items-baseline gap-1">
              <span className="text-[var(--accent)] text-lg font-bold">₹</span>
              <span className="text-3xl font-black font-mono-numbers tracking-tight">
                {totalExpenses.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="h-px bg-white/5 my-3" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-semibold mb-1">Monthly Limit</p>
            <div className="flex items-baseline gap-1">
              <span className="text-white/40 text-sm">₹</span>
              <span className="text-lg font-bold font-mono-numbers text-white/60">
                {monthlyLimit.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={Flame}
          label="Biggest Hit"
          value={biggestHit ? `₹${biggestHit.amount.toLocaleString('en-IN')}` : '—'}
          subtext={biggestHit ? biggestHit.title : 'No expenses yet'}
          accentColor="#ffffff"
          delay={0.3}
        />
        <StatCard
          icon={Shield}
          label="Safe to Spend"
          value={`₹${Math.round(safeToSpend).toLocaleString('en-IN')}`}
          subtext="per day this month"
          accentColor="#ffffff"
          delay={0.4}
        />
        <StatCard
          icon={Zap}
          label="Today"
          value={`₹${todaySpent.toLocaleString('en-IN')}`}
          subtext={todaySpent === 0 ? 'Clean slate!' : 'spent today'}
          accentColor="#ffffff"
          delay={0.5}
        />
        <StatCard
          icon={topCategory ? Calendar : Calendar}
          label="Top Category"
          value={topCategory ? `${categoryConfig[topCategory.name]?.emoji || '📦'} ${topCategory.name}` : '—'}
          subtext={topCategory ? `₹${topCategory.amount.toLocaleString('en-IN')} total` : 'No data'}
          accentColor="#ffffff"
          delay={0.6}
        />
      </div>

      {/* Category Pills */}
      {expenses.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex gap-2 overflow-x-auto py-2 mb-4 no-scrollbar"
        >
          {Object.entries(
            expenses.reduce((acc, e) => {
              acc[e.category] = (acc[e.category] || 0) + e.amount;
              return acc;
            }, {})
          )
            .sort((a, b) => b[1] - a[1])
            .map(([cat, amount]) => {
              const config = categoryConfig[cat] || categoryConfig.Other;
              return (
                <div
                  key={cat}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] transition-colors cursor-default"
                >
                  <span className="text-sm">{config.emoji}</span>
                  <span className="text-xs font-bold text-white tracking-tight">{cat}</span>
                  <span className="text-xs font-mono-numbers text-white/40">₹{amount}</span>
                </div>
              );
            })}
        </motion.div>
      )}

      {/* Recent Expenses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="font-display text-lg font-extrabold text-white tracking-tighter flex items-center gap-2 uppercase">
            Recent Transactions
            {expenses.length > 0 && (
              <span className="text-[10px] bg-white/5 text-white/40 px-2 py-0.5 rounded-full font-mono-numbers font-normal tracking-normal lowercase">
                {expenses.length}
              </span>
            )}
          </h2>
          {isOverLimit && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
              <TrendingDown className="w-3 h-3 text-red-400" />
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Over Budget</span>
            </div>
          )}
          {!isOverLimit && totalExpenses > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">On Track</span>
            </div>
          )}
        </div>
        <ExpenseList expenses={expenses} onDelete={onDelete} />
      </motion.div>
    </div>
  );
}
