import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

export default function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDbWaking, setIsDbWaking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsDbWaking(false);
    setIsLoading(true);

    try {
      await onAuth(mode, { name, email, password });
    } catch (err) {
      const msg = err.message || 'Something went wrong';
      setError(msg);
      if (msg.toLowerCase().includes('waking up') || msg.toLowerCase().includes('database is')) {
        setIsDbWaking(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="w-full max-w-[420px]"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-5xl font-extrabold text-white tracking-tighter mb-2">
            BrokeBoy
          </h1>
          <p className="text-white/30 text-sm font-semibold uppercase tracking-[0.2em]">
            Your expenses, your privacy
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          layout
          className="glass rounded-3xl p-8 border border-white/5 relative overflow-hidden"
        >
          {/* Accent glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--accent)] rounded-full opacity-[0.04] blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500 rounded-full opacity-[0.03] blur-3xl" />

          {/* Tab switcher */}
          <div className="flex bg-white/[0.03] rounded-xl p-1 mb-8 border border-white/5">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                mode === 'login'
                  ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                mode === 'signup'
                  ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name (signup only) */}
            <AnimatePresence mode="popLayout">
              {mode === 'signup' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <label className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2 block">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Swapnil"
                      className="w-full bg-white/[0.03] border border-white/8 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-white/15 outline-none focus:border-white/20 transition-all text-sm"
                      required={mode === 'signup'}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/[0.03] border border-white/8 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-white/15 outline-none focus:border-white/20 transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/8 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder:text-white/15 outline-none focus:border-white/20 transition-all text-sm"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="text-[10px] text-white/20 mt-1.5 ml-1">Minimum 6 characters</p>
              )}
            </div>

            {/* DB Waking Warning */}
            <AnimatePresence>
              {isDbWaking && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 space-y-1"
                >
                  <p className="text-amber-400 text-sm font-semibold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                    Connecting to Database...
                  </p>
                  <p className="text-amber-400/80 text-[11px] leading-relaxed italic">
                    {error || "Database is waking up — please wait a few seconds and try again."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && !isDbWaking && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                >
                  <p className="text-red-400 text-sm font-semibold">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl font-display font-bold text-lg text-black bg-white shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] transition-shadow flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'signup' ? (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Create Account
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </>
              )}
            </motion.button>
          </form>

          {/* Toggle */}
          <p className="text-center text-white/25 text-sm mt-6">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={toggleMode}
              className="text-white/60 hover:text-white font-semibold transition-colors underline underline-offset-2 decoration-white/20 hover:decoration-white/50"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-white/10 text-[10px] mt-6 uppercase tracking-widest">
          Your data stays private. Always.
        </p>
      </motion.div>
    </div>
  );
}
