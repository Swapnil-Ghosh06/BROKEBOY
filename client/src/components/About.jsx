import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center z-10 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass p-8 rounded-3xl max-w-2xl border border-white/10 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-6">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-purple-400 mb-4">
            BrokeBoy.
          </h1>
        </div>

        <div className="space-y-6 text-left text-white/80 leading-relaxed">
          <p>
            Swapnil Ghosh is a developer obsessed with making software feel less boring.
          </p>
          <p>
            Instead of building another lifeless finance tracker, he created <strong>BrokeBoy</strong> — an expense app designed with personality, brutal honesty, and a cinematic UI experience.
          </p>
          <p>
            Currently pursuing Computer Science with specialization in AI & ML, he focuses on blending clean engineering with experimental frontend design, motion systems, and immersive user experiences.
          </p>
          <p className="italic text-[var(--accent)]">
            "His approach is simple: If people are forced to use software every day, it should at least feel beautiful."
          </p>
          
          <div className="pt-6 border-t border-white/10 mt-6 text-center">
            <h3 className="text-sm font-bold text-white/50 mb-3 tracking-widest uppercase">The Mastermind</h3>
            <div className="inline-block p-[2px] rounded-full bg-gradient-to-r from-[var(--accent)] to-purple-500 mb-2">
              <img 
                src="/swapnil.jpg" 
                alt="Swapnil Ghosh" 
                className="w-20 h-20 rounded-full object-cover border-2 border-black"
              />
            </div>
            <h2 
              className="text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
              style={{ filter: 'drop-shadow(0px 0px 8px rgba(168,85,247,0.6))' }}
            >
              SWAPNIL GHOSH
            </h2>
            <p className="text-[var(--accent)] font-semibold mt-1 uppercase tracking-widest text-xs">Creator & Full-Stack Visionary</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
