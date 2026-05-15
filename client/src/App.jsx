import { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import SummaryBar from './components/SummaryBar';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import { Waves } from './components/ui/wave-background';
import Learn from './components/Learn';
import InteractiveSelector from './components/ui/interactive-selector';
import { GlassWalletCard } from './components/ui/glass-wallet-card';
import About from './components/About';
import AuthScreen from './components/AuthScreen';
import { Home, LayoutGrid, Newspaper, User, LogOut } from 'lucide-react';

import BentoDashboard from './components/BentoDashboard';

const API_URL = import.meta.env.VITE_API_URL || '';

// Configure axios interceptor for auth token
const setupAxiosAuth = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

function App() {
  // Auth State
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('brokeboy_token'));
  const [authChecked, setAuthChecked] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [dbError, setDbError] = useState(null);
  
  // Wallet State
  const [initialBalance, setInitialBalance] = useState(0);
  const [monthlyLimit, setMonthlyLimit] = useState(0);

  // Set auth header on mount and token changes
  useEffect(() => {
    setupAxiosAuth(token);
    if (token) {
      verifyToken();
    } else {
      setAuthChecked(true);
      setIsLoading(false);
    }
  }, []);

  // Verify stored token and restore session
  const verifyToken = async () => {
    try {
      setupAxiosAuth(token);
      const res = await axios.get(`${API_URL}/api/auth/me`);
      if (res.data.success) {
        setUser(res.data.data);
        // Load user data after auth verified
        checkHealth();
        fetchExpenses();
        fetchSettings();
      } else {
        // Bad token response — clear it
        handleLogout();
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 401) {
        // Token is invalid/expired — logout
        handleLogout();
      } else {
        // DB offline / network error — decode token locally to restore user state
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({ _id: payload.id, name: 'User', email: '' }); // minimal user stub
        } catch {
          // Token is malformed — logout
          handleLogout();
          return;
        }
        setIsLoading(false);
        checkHealth();
        fetchExpenses();
        fetchSettings();
      }
    } finally {
      setAuthChecked(true);
    }
  };

  // Handle login/signup
  const handleAuth = async (mode, credentials) => {
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await axios.post(`${API_URL}${endpoint}`, credentials);
      if (res.data.success) {
        const { token: newToken, ...userData } = res.data.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('brokeboy_token', newToken);
        setupAxiosAuth(newToken);
        
        // Load user data
        checkHealth();
        fetchExpenses();
        fetchSettings();
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Something went wrong';
      throw new Error(message);
    }
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setExpenses([]);
    setInitialBalance(0);
    setMonthlyLimit(0);
    localStorage.removeItem('brokeboy_token');
    setupAxiosAuth(null);
    setIsLoading(false);
  };

  const checkHealth = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/health`);
      setIsDbConnected(res.data.dbConnected);
      setDbError(res.data.dbError);
    } catch (error) {
      console.error('Health check failed:', error);
      setIsDbConnected(false);
      setDbError('API Server Unreachable');
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
      if (error.response?.status === 401) handleLogout();
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
      if (error.response?.status === 401) handleLogout();
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

  const handleResetApp = async () => {
    if (!window.confirm('Are you sure you want to reset everything? This will clear your balance, limit, and ALL transactions. This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(`${API_URL}/api/expenses/reset/all`);
      setExpenses([]);
      
      await axios.post(`${API_URL}/api/settings`, {
        initialBalance: 0,
        monthlyLimit: 0
      });
      setInitialBalance(0);
      setMonthlyLimit(0);
      
    } catch (error) {
      console.error('Error resetting app:', error);
      alert('Failed to reset app. Please try again.');
    }
  };

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

  // Show nothing until we've checked auth
  if (!authChecked) {
    return (
      <>
        <Waves />
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </>
    );
  }

  // Not logged in — show auth screen
  if (!user) {
    return (
      <>
        <Waves />
        <AuthScreen onAuth={handleAuth} />
      </>
    );
  }

  // Logged in — show app
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
          <div className="h-px bg-white/10 mx-2" />
          <button 
            onClick={handleLogout}
            title="Logout"
            className="p-3 rounded-full transition-all duration-300 text-red-400/50 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center pointer-events-none md:hidden">
        <div className="glass px-4 py-2 rounded-full flex gap-4 pointer-events-auto border border-white/10 shadow-xl backdrop-blur-md w-full max-w-[360px] justify-between">
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
          <button 
            onClick={handleLogout}
            className="p-2 rounded-full transition-all duration-300 text-red-400/50 hover:text-red-400"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="fixed top-6 right-6 z-[60] flex flex-col items-end gap-2">
        <div 
          title={dbError || (isDbConnected ? 'Connected to MongoDB Atlas' : 'Checking connection...')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full glass border transition-all duration-500 cursor-help ${isDbConnected ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}
        >
          <div className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isDbConnected ? 'text-emerald-400' : 'text-red-400'}`}>
            {isDbConnected ? 'Database Online' : 'Database Offline'}
          </span>
          {dbError && !isDbConnected && (
            <span className="text-[9px] text-red-500/60 font-mono ml-1 max-w-[150px] truncate">
              ({dbError})
            </span>
          )}
        </div>
        
        {!isDbConnected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl backdrop-blur-md shadow-lg shadow-red-500/10"
          >
            <p className="text-[10px] text-red-400 font-bold uppercase tracking-[0.1em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Refresh 2-3 times to wake up database
            </p>
          </motion.div>
        )}
      </div>
      {activeTab === 'dashboard' && (
  <div className="fixed top-1/2 right-6 -translate-y-1/2 z-50 w-full max-w-[320px] pointer-events-auto hidden xl:block">
    <GlassWalletCard
      balance={currentBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
      trend={`${percentageUsed}% Used`}
      trendUp={!isOverLimit}
      onSend={handleSetLimit}
      onReceive={handleAddFunds}
    />
  </div>
)}


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
            onReset={handleResetApp}
            userName={user?.name}
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
