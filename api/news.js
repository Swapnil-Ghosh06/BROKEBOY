const https = require('https');
const http = require('http');

// Fallback articles if all feeds fail
const FALLBACK_NEWS = [
  {
    id: 'f1',
    title: "Global Markets Rally as Tech Stocks Lead the Way",
    description: "Investors remain optimistic as major tech companies report stronger-than-expected earnings, pushing indices to new highs across international markets.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    url: "https://moneycontrol.com",
    pubDate: new Date().toISOString(),
    color: "blue"
  },
  {
    id: 'f2',
    title: "India's Fintech Sector Set for Massive Growth in 2026",
    description: "Analysts predict a 25% CAGR for the Indian fintech landscape, driven by digital payments, UPI expansion, and AI-powered financial platforms.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    url: "https://economictimes.com",
    pubDate: new Date().toISOString(),
    color: "orange"
  },
  {
    id: 'f3',
    title: "How to Build a High-Yield Investment Portfolio",
    description: "Experts share top tips for diversifying assets and maximizing returns in a volatile market environment with disciplined long-term strategies.",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
    url: "https://investopedia.com",
    pubDate: new Date().toISOString(),
    color: "purple"
  },
  {
    id: 'f4',
    title: "UPI Crosses 10 Billion Monthly Transactions",
    description: "India's Unified Payments Interface hits a new milestone, cementing its position as the world's largest real-time payments network by volume.",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=800&q=80",
    url: "https://moneycontrol.com",
    pubDate: new Date().toISOString(),
    color: "green"
  },
  {
    id: 'f5',
    title: "AI-Powered Personal Finance Tools on the Rise",
    description: "A new wave of AI-driven budgeting apps is helping Gen-Z track spending, optimize savings, and make smarter financial decisions automatically.",
    image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=800&q=80",
    url: "https://economictimes.com",
    pubDate: new Date().toISOString(),
    color: "red"
  },
  {
    id: 'f6',
    title: "Student Debt and Smart Budgeting in 2026",
    description: "Financial experts weigh in on how students can manage expenses, avoid debt traps, and build healthy money habits from day one of college.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    url: "https://investopedia.com",
    pubDate: new Date().toISOString(),
    color: "blue"
  }
];

// Simple HTTP fetch using Node built-ins (no extra packages needed)
const fetchUrl = (url) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: 8000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
  });
};

const RSS_FEEDS = [
  'https://www.moneycontrol.com/rss/business.xml',
  'https://economictimes.indiatimes.com/markets/rssfeeds/1977021502.cms',
];

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
];

module.exports = async (req, res) => {
  // CORS headers — matches your existing api files
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const colors = ['blue', 'orange', 'purple', 'green', 'red', 'blue'];

  // Try each RSS feed via RSS2JSON
  for (const feed of RSS_FEEDS) {
    try {
      const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}&count=6`;
      const raw = await fetchUrl(rss2jsonUrl);
      const data = JSON.parse(raw);

      if (data && data.items && data.items.length > 0) {
        const articles = data.items.slice(0, 6).map((article, index) => {
          // Try to extract image from multiple sources
          let imageUrl = article.thumbnail;
          if (!imageUrl || imageUrl === '') {
            const imgMatch = article.description?.match(/src="([^"]+)"/);
            if (imgMatch) imageUrl = imgMatch[1];
          }
          // Clean HTML tags from description
          const cleanDesc = article.description
            ? article.description.replace(/<[^>]*>?/gm, '').trim()
            : '';

          return {
            id: article.guid || String(index),
            title: article.title || 'Market Update',
            description: cleanDesc.substring(0, 200) + (cleanDesc.length > 200 ? '...' : ''),
            image: imageUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
            url: article.link,
            pubDate: article.pubDate,
            color: colors[index % colors.length]
          };
        });

        return res.status(200).json({ success: true, data: articles });
      }
    } catch (err) {
      console.error(`Feed failed (${feed}):`, err.message);
      continue;
    }
  }

  // All feeds failed — return fallback
  console.log('All feeds failed, returning fallback news');
  return res.status(200).json({ success: true, data: FALLBACK_NEWS, isFallback: true });
};
