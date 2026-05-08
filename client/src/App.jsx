import { useState, useEffect, useRef } from 'react';
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDbConnected, setIsDbConnected] = useState(false);
  
  // Wallet State
  const [initialBalance, setInitialBalance] = useState(0);
  const [monthlyLimit, setMonthlyLimit] = useState(0);

  useEffect(() => {
    checkHealth();
    fetchExpenses();
    fetchSettings();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/health`);
      setIsDbConnected(res.data.dbConnected);
    } catch (error) {
      console.error('Health check failed:', error);
      setIsDbConnected(false);
    }
  };

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

  const saveSettings = async (newBalance, newLimit) => {
    try {
      await axios.post(`${API_URL}/api/settings`, {
        initialBalance: newBalance !== undefined ? newBalance : initialBalance,
        monthlyLimit: newLimit !== undefined ? newLimit : monthlyLimit
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/expenses`);
      if (res.data.success) {
        setExpenses(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = async (newExpenseData) => {
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
      setExpenses(previousExpenses);
      alert('Failed to delete expense.');
    }
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const currentBalance = initialBalance - totalExpenses;
  const isOverLimit = totalExpenses > monthlyLimit;
  const percentageUsed = monthlyLimit > 0 ? ((totalExpenses / monthlyLimit) * 100).toFixed(1) : 0;

  const handleAddFunds = () => {
    const amount = prompt('Enter amount to add to your balance:', '1000');
    if (amount && !isNaN(amount)) {
      const newBalance = initialBalance + parseFloat(amount);
      setInitialBalance(newBalance);
      saveSettings(newBalance, undefined);
    }
  };

  const handleSetLimit = () => {
    const limit = prompt('Enter your new monthly spending limit:', monthlyLimit.toString());
    if (limit && !isNaN(limit)) {
      const newLimit = parseFloat(limit);
      setMonthlyLimit(newLimit);
      saveSettings(undefined, newLimit);
    }
  };

  return (
    <>
      <Waves />
      
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

      <div className="fixed top-6 right-6 z-[60] flex items-center gap-3">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full glass border transition-all duration-500 ${isDbConnected ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
          <div className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isDbConnected ? 'text-emerald-400' : 'text-red-400'}`}>
            {isDbConnected ? 'Database Online' : 'Database Offline'}
          </span>
        </div>
      </div>
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

      {activeTab === 'dashboard' ? (
        isLoading ? (
          <div className="min-h-screen flex items-center justify-center relative z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <BentoDashboard 
            expenses={expenses}
            totalExpenses={totalExpenses}
            monthlyLimit={monthlyLimit}
            currentBalance={currentBalance}
            percentageUsed={percentageUsed}
            isOverLimit={isOverLimit}
            onDelete={handleDeleteExpense}
          />
        )
      ) : activeTab === 'features' ? (
        <div className="pt-10">
          <InteractiveSelector />
        </div>
      ) : activeTab === 'about' ? (
        <div className="pt-10">
          <About />
        </div>
      ) : (
        <div className="pt-10">
          <Learn />
        </div>
      )}

      <ExpenseForm onAddExpense={handleAddExpense} />
    </>
  );
}

export default App;
