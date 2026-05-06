import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';

const categoryConfig = {
  Food: { emoji: '🍕', color: 'bg-orange-400', text: 'text-orange-400' },
  Travel: { emoji: '🚗', color: 'bg-sky-400', text: 'text-sky-400' },
  Coffee: { emoji: '☕', color: 'bg-amber-400', text: 'text-amber-400' },
  Shopping: { emoji: '🛍️', color: 'bg-pink-400', text: 'text-pink-400' },
  Entertainment: { emoji: '🎮', color: 'bg-purple-400', text: 'text-purple-400' },
  Other: { emoji: '📦', color: 'bg-slate-400', text: 'text-slate-400' },
};

export default function ExpenseCard({ expense, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);
  const config = categoryConfig[expense.category] || categoryConfig.Other;

  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const formattedDate = new Date(expense.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, x: 40 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="glass rounded-2xl relative overflow-hidden flex mb-4 group cursor-pointer"
    >
      {/* Accent Bar */}
      <div className={`w-1 shrink-0 ${config.color}`} />
      
      <div className="flex-1 p-5 flex items-center justify-between" style={{ transform: "translateZ(30px)" }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-2xl shadow-inner">
            {config.emoji}
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg leading-tight text-[var(--text)] mb-1">
              {expense.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <span className={`font-semibold ${config.text}`}>{expense.category}</span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="text-right flex flex-col items-end">
          <span className="font-mono-numbers font-bold text-xl text-[var(--text)]">
            ₹{expense.amount}
          </span>
          <button
            onClick={() => onDelete(expense._id)}
            className={`mt-1 text-[var(--muted)] hover:text-red-400 transition-colors p-1 rounded-full hover:bg-red-400/10 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label="Delete expense"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
