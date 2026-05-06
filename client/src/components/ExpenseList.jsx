import { AnimatePresence } from 'framer-motion';
import ExpenseCard from './ExpenseCard';

export default function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 px-4 opacity-0" id="empty-state">
        <div className="text-6xl mb-4">☕</div>
        <h3 className="text-[var(--text)] font-display text-xl mb-2">No expenses yet.</h3>
        <p className="text-[var(--muted)]">Start adding your micro-expenses!</p>
      </div>
    );
  }

  return (
    <div className="expense-list-container pb-24">
      <AnimatePresence mode="popLayout">
        {expenses.map((expense) => (
          <ExpenseCard 
            key={expense._id} 
            expense={expense} 
            onDelete={onDelete} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
