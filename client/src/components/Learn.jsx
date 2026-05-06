import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GlowCard } from './ui/spotlight-card';

const Learn = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackNews = [
    {
      id: 'f1',
      title: "Global Markets Rally as Tech Stocks Lead the Way",
      description: "Investors remain optimistic as major tech companies report stronger-than-expected earnings, pushing indices to new highs. Global markets witnessed another strong rally this week as major technology companies reported stronger-than-expected earnings, pushing investor confidence higher. Analysts believe the rapid expansion of AI infrastructure and semiconductor demand could continue driving bullish momentum across international markets throughout the year.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
      url: "https://moneybase.com/blog/news/global-markets-rally-tech-stocks-oil-prices-geopolitics",
      color: "blue"
    },
    {
      id: 'f2',
      title: "India's Fintech Sector Set for Massive Growth in 2026",
      description: "Analysts predict a 25% CAGR for the Indian fintech landscape, driven by digital payments and innovative lending solutions. India’s fintech ecosystem is expected to experience significant growth in 2026, fueled by digital banking adoption, UPI expansion, and AI-powered financial platforms. Industry experts predict that student-focused budgeting apps, lending systems, and personalized financial tools will become increasingly mainstream over the next few years.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      url: "https://www.elevationcapital.com/perspectives/the-2026-fintech-agenda-year-one-of-a-decade-of-change",
      color: "orange"
    },
    {
      id: 'f3',
      title: "How to Build a High-Yield Investment Portfolio",
      description: "Experts share their top tips for diversifying your assets and maximizing returns in a volatile market environment. Building a successful investment portfolio requires more than chasing short-term profits. Financial experts recommend balancing long-term assets, diversifying across sectors, and maintaining disciplined investment habits. Understanding market volatility and risk management remains essential for sustainable financial growth over time.",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
      url: "https://www.investopedia.com/articles/stocks/11/construct-high-risk-portfolio.asp",
      color: "purple"
    }
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://www.moneycontrol.com/rss/business.xml');
        if (res.data && res.data.items && res.data.items.length > 0) {
          const articles = res.data.items.slice(0, 6).map((article, index) => {
            const colors = ['blue', 'orange', 'purple', 'green', 'red'];
            let imageUrl = article.thumbnail;
            if (!imageUrl && article.description) {
              const imgMatch = article.description.match(/src="([^"]+)"/);
              if (imgMatch) imageUrl = imgMatch[1];
            }
            const cleanDesc = article.description ? article.description.replace(/<[^>]*>?/gm, '') : '';
            return {
              id: article.guid || index,
              title: article.title,
              description: cleanDesc.substring(0, 100) + '...',
              image: imageUrl || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
              url: article.link,
              color: colors[index % colors.length]
            };
          });
          setNews(articles);
        } else {
          setNews(fallbackNews);
        }
      } catch (err) {
        console.error('Failed to fetch news', err);
        setNews(fallbackNews);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="flex flex-col items-center max-w-6xl mx-auto px-4 w-full text-center relative z-10 pb-20">
      <div className="mb-12">
        <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white tracking-tighter mb-2">Market News</h2>
        <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.2em]">Latest Financial Updates & Market Trends</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass h-64 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {news.map((item) => (
            <a href={item.url} target="_blank" rel="noopener noreferrer" key={item.id} className="block w-full group">
              <GlowCard
                glowColor={item.color}
                className="w-full text-left cursor-pointer transition-all duration-300 h-full flex flex-col border-white/5"
              >
                <div className="w-full h-40 overflow-hidden rounded-xl relative mb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="flex-grow flex flex-col justify-start">
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight tracking-tight line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-white/40 text-sm font-medium line-clamp-8">
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
