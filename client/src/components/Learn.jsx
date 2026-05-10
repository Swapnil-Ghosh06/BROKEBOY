import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GlowCard } from './ui/spotlight-card';

// Unsplash fallback images for when articles have no thumbnail
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
];

const FALLBACK_NEWS = [
  {
    id: 'f1',
    title: "Global Markets Rally as Tech Stocks Lead the Way",
    description: "Investors remain optimistic as major tech companies report stronger-than-expected earnings, pushing indices to new highs across international markets.",
    image: FALLBACK_IMAGES[0],
    url: "https://moneycontrol.com",
    pubDate: new Date().toISOString(),
    color: "blue"
  },
  {
    id: 'f2',
    title: "India's Fintech Sector Set for Massive Growth in 2026",
    description: "Analysts predict a 25% CAGR for the Indian fintech landscape, driven by digital payments, UPI expansion, and AI-powered financial platforms.",
    image: FALLBACK_IMAGES[1],
    url: "https://economictimes.com",
    pubDate: new Date().toISOString(),
    color: "orange"
  },
  {
    id: 'f3',
    title: "How to Build a High-Yield Investment Portfolio",
    description: "Experts share top tips for diversifying assets and maximizing returns in a volatile market environment with disciplined long-term strategies.",
    image: FALLBACK_IMAGES[2],
    url: "https://investopedia.com",
    pubDate: new Date().toISOString(),
    color: "purple"
  }
];

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const Learn = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // Call YOUR OWN serverless function — no more CORS issues
      const res = await axios.get(`${API_URL}/api/news`);

      if (res.data.success && res.data.data.length > 0) {
        // Assign fallback images for articles without thumbnails
        const articles = res.data.data.map((article, index) => ({
          ...article,
          image: article.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
        }));
        setNews(articles);
        setLastUpdated(new Date());
        setUsingFallback(false);
      } else {
        setNews(FALLBACK_NEWS);
        setUsingFallback(true);
      }
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setNews(FALLBACK_NEWS);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-6xl mx-auto px-4 w-full text-center relative z-10 pb-20">
      
      {/* Header */}
      <div className="mb-12">
        <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white tracking-tighter mb-2">
          Market News
        </h2>
        <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.2em]">
          Latest Financial Updates & Market Trends
        </p>

        {/* Live indicator */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {usingFallback ? (
            <span className="text-white/20 text-[10px] uppercase tracking-widest">Cached articles</span>
          ) : (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400/60 text-[10px] uppercase tracking-widest">
                Live · Updated {lastUpdated ? formatDate(lastUpdated) : 'just now'}
              </span>
            </>
          )}
          <button
            onClick={fetchNews}
            className="text-white/20 hover:text-white/60 text-[10px] uppercase tracking-widest transition-colors ml-2"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass h-64 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {news.map((item, index) => (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              key={item.id}
              className="block w-full group"
            >
              <GlowCard
                glowColor={item.color}
                className="w-full text-left cursor-pointer transition-all duration-300 h-full flex flex-col border-white/5"
              >
                {/* Thumbnail */}
                <div className="w-full h-40 overflow-hidden rounded-xl relative mb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Date badge */}
                  {item.pubDate && (
                    <div className="absolute bottom-2 left-2 text-[9px] text-white/50 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {formatDate(item.pubDate)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-grow flex flex-col justify-start">
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight tracking-tight line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-white/40 text-sm font-medium line-clamp-4">
                    {item.description}
                  </p>
                </div>
              </GlowCard>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Learn;
