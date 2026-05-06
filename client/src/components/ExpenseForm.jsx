import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';

const categories = [
  { id: 'Food', emoji: '🍕', label: 'Food' },
  { id: 'Travel', emoji: '🚗', label: 'Travel' },
  { id: 'Coffee', emoji: '☕', label: 'Coffee' },
  { id: 'Shopping', emoji: '🛍️', label: 'Shopping' },
  { id: 'Entertainment', emoji: '🎮', label: 'Entertainment' },
  { id: 'Other', emoji: '📦', label: 'Other' },
];

export default function ExpenseForm({ onAddExpense }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !category) return;

    onAddExpense({
      title,
      amount: Number(amount),
      category,
      date
    });

    // Reset and close
    setTitle('');
    setAmount('');
    setCategory('Food');
    setDate(new Date().toISOString().split('T')[0]);
    setIsOpen(false);
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-lg z-40 transition-shadow fab-glow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
      >
        <Plus size={24} />
      </motion.button>

      {/* Overlay & Form Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto glass rounded-t-3xl border-b-0 p-6 z-50 h-[85vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold text-[var(--text)]">Add Expense</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-[var(--surface)] transition-colors text-[var(--muted)] hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Amount */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-[var(--muted)]">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)] font-bold text-xl">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl py-4 pl-10 pr-4 text-2xl font-mono-numbers font-bold text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors"
                      placeholder="0"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-[var(--muted)]">What was it?</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl py-3 px-4 text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors"
                    placeholder="e.g., Chai at canteen"
                  />
                </div>

                {/* Category Chips */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--muted)]">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setCategory(c.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                          category === c.id 
                            ? 'bg-[var(--accent)] border-[var(--accent)] text-white' 
                            : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] hover:text-white'
                        }`}
                      >
                        <span>{c.emoji}</span>
                        <span className="text-sm font-semibold">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-[var(--muted)]">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl py-3 px-4 text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors [color-scheme:dark]"
                  />
                </div>

                <div className="pt-4 pb-8">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl font-display font-bold text-lg text-white bg-gradient-to-r from-[var(--accent)] to-[#1a63c4] shadow-[0_0_20px_rgba(59,142,243,0.3)] hover:shadow-[0_0_30px_rgba(59,142,243,0.5)] transition-shadow"
                  >
                    Add Expense
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
