import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import gsap from 'gsap';
import SummaryBar from './components/SummaryBar';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import { Waves } from './components/ui/wave-background';
import Learn from './components/Learn';
import InteractiveSelector from './components/ui/interactive-selector';
import { GlassWalletCard } from './components/ui/glass-wallet-card';
import About from './components/About';
import { Home, LayoutGrid, Newspaper, User } from 'lucide-react';

import BentoDashboard from './components/BentoDashboard';

const API_URL = import.meta.env.VITE_API_URL || '';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [dbError, setDbError] = useState(null);
  
  // Wallet State (Defaults set to 0 for easier calculation)
  const [initialBalance, setInitialBalance] = useState(0);
  const [monthlyLimit, setMonthlyLimit] = useState(0);

  useEffect(() => {
    fetchExpenses();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/settings`);
      if (res.data.success) {
        setInitialBalance(res.data.data.initialBalance);
        setMonthlyLimit(res.data.data.monthlyLimit);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/expenses`);
      if (res.data.success) {
        setExpenses(res.data.data);
        setIsMock(res.data.isMock);
        setDbError(res.data.dbError);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = async (newExpenseData) => {
    if (newExpenseData.amount > currentBalance && currentBalance <= 0) {
      // Allow adding if balance is 0 or negative (since we started at 0)
      // but maybe the user wants to be notified?
      // For now, let's just let it pass if they want "easier calculation" (negative balance allowed)
    }

    const tempId = Math.random().toString(36).substr(2, 9);
    const optimisticExpense = { ...newExpenseData, _id: tempId, createdAt: new Date().toISOString() };
    setExpenses(prev => [optimisticExpense, ...prev]);

    try {
      const res = await axios.post(`${API_URL}/api/expenses`, newExpenseData);
      if (res.data.success) {
        setExpenses(prev => prev.map(exp => exp._id === tempId ? res.data.data : exp));
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      setExpenses(prev => prev.filter(exp => exp._id !== tempId));
      alert('Failed to add expense. Please try again.');
    }
  };

  const handleDeleteExpense = async (id) => {
    const previousExpenses = [...expenses];
    setExpenses(prev => prev.filter(exp => exp._id !== id));

    try {
      await axios.delete(`${API_URL}/api/expenses/${id}`);
    } catch (error) {
      console.error('Error deleting expense:', error);
      
      // If it's a 404, it means the server doesn't have it (likely due to a restart in mock mode)
      if (error.response && error.response.status === 404) {
        console.warn('Expense already deleted or server restarted in mock mode.');
        return;
      }

      setExpenses(previousExpenses);
      alert('Failed to delete expense.');
    }
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const currentBalance = initialBalance - totalExpenses;
  const isOverLimit = monthlyLimit > 0 && totalExpenses > monthlyLimit;
  const percentageUsed = monthlyLimit > 0 ? ((totalExpenses / monthlyLimit) * 100).toFixed(1) : 0;

  const handleAddFunds = async () => {
    const amount = prompt('Enter amount to add to your balance:', '1000');
    if (amount && !isNaN(amount)) {
      const newBalance = initialBalance + parseFloat(amount);
      setInitialBalance(newBalance);
      try {
        await axios.post(`${API_URL}/api/settings`, { initialBalance: newBalance });
      } catch (error) {
        console.error('Error saving balance:', error);
      }
    }
  };

  const handleSetLimit = async () => {
    const limit = prompt('Enter your new monthly spending limit:', monthlyLimit.toString());
    if (limit && !isNaN(limit)) {
      const newLimit = parseFloat(limit);
      setMonthlyLimit(newLimit);
      try {
        await axios.post(`${API_URL}/api/settings`, { monthlyLimit: newLimit });
      } catch (error) {
        console.error('Error saving limit:', error);
      }
    }
  };

  return (
    <>
      <Waves />
      
      {/* Database Connection Status Indicator */}
      {isMock && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-red-500/10 backdrop-blur-md border-b border-red-500/20 py-2 text-center px-4">
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-red-400 font-bold">
            <span className="animate-pulse text-red-500">⚠️ Database Offline</span>
            <span className="opacity-50">|</span>
            <span className="lowercase font-normal tracking-normal text-[9px] text-white/60">
              {dbError ? `Error: ${dbError}` : 'Connect MongoDB for persistence'}
            </span>
          </div>
        </div>
      )}

      {/* Floating Vertical Navigation Sidebar */}
      <div className="fixed top-1/2 left-6 -translate-y-1/2 z-50 flex flex-col pointer-events-none hidden md:flex">
        <div className="glass p-2 rounded-full flex flex-col gap-4 pointer-events-auto border border-white/10 shadow-xl backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('dashboard')}
            title="Dashboard"
            className={`p-3 rounded-full transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <Home className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('features')}
            title="Features"
            className={`p-3 rounded-full transition-all duration-300 ${activeTab === 'features' ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutGrid className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('learn')}
            title="News"
            className={`p-3 rounded-full transition-all duration-300 ${activeTab === 'learn' ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <Newspaper className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('about')}
            title="About"
            className={`p-3 rounded-full transition-all duration-300 ${activeTab === 'about' ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center pointer-events-none md:hidden">
        <div className="glass px-4 py-2 rounded-full flex gap-6 pointer-events-auto border border-white/10 shadow-xl backdrop-blur-md w-full max-w-[320px] justify-between">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`p-2 rounded-full transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'text-white/40 hover:text-white'}`}
          >
            <Home className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('features')}
            className={`p-2 rounded-full transition-all duration-300 ${activeTab === 'features' ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'text-white/40 hover:text-white'}`}
          >
            <LayoutGrid className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('learn')}
            className={`p-2 rounded-full transition-all duration-300 ${activeTab === 'learn' ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'text-white/40 hover:text-white'}`}
          >
            <Newspaper className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('about')}
            className={`p-2 rounded-full transition-all duration-300 ${activeTab === 'about' ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'text-white/40 hover:text-white'}`}
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Floating Wallet Card */}
      <div className="fixed top-1/2 right-6 -translate-y-1/2 z-50 w-full max-w-[320px] pointer-events-auto hidden xl:block">
        <GlassWalletCard 
          balance={currentBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          trend={`${percentageUsed}% Used`}
          trendUp={!isOverLimit}
          onSend={handleSetLimit}
          onReceive={handleAddFunds}
        />
      </div>

      {/* Mobile/Tablet Wallet Card */}
      <div className="xl:hidden">
        {activeTab === 'dashboard' && (
          <div className="px-4 pt-12 pb-4 max-w-[480px] mx-auto w-full relative z-10 flex justify-center">
            <GlassWalletCard 
              balance={currentBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              trend={`${percentageUsed}% Used`}
              trendUp={!isOverLimit}
              onSend={handleSetLimit}
              onReceive={handleAddFunds}
            />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' ? (
          isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center relative z-10"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <BentoDashboard
                expenses={expenses}
                totalExpenses={totalExpenses}
                monthlyLimit={monthlyLimit}
                currentBalance={currentBalance}
                percentageUsed={percentageUsed}
                isOverLimit={isOverLimit}
                onDelete={handleDeleteExpense}
              />
            </motion.div>
          )
        ) : activeTab === 'features' ? (
          <motion.div
            key="features"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="pt-10"
          >
            <InteractiveSelector />
          </motion.div>
        ) : activeTab === 'about' ? (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="pt-10"
          >
            <About />
          </motion.div>
        ) : (
          <motion.div
            key="learn"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="pt-10"
          >
            <Learn />
          </motion.div>
        )}
      </AnimatePresence>

      <ExpenseForm onAddExpense={handleAddExpense} />
    </>
  );
}

export default App;
