const https = require('https');

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
];

const FALLBACK_NEWS = [
  { id: 'f1', title: "Global Markets Rally as Tech Stocks Lead the Way", description: "Investors remain optimistic as major tech companies report stronger-than-expected earnings, pushing indices to new highs across international markets.", image: FALLBACK_IMAGES[0], url: "https://economictimes.indiatimes.com/markets", pubDate: new Date().toISOString(), color: "blue" },
  { id: 'f2', title: "India's Fintech Sector Set for Massive Growth in 2026", description: "Analysts predict a 25% CAGR for the Indian fintech landscape, driven by digital payments, UPI expansion, and AI-powered financial platforms.", image: FALLBACK_IMAGES[1], url: "https://economictimes.indiatimes.com/industry/banking/finance", pubDate: new Date().toISOString(), color: "orange" },
  { id: 'f3', title: "How to Build a High-Yield Investment Portfolio", description: "Experts share top tips for diversifying assets and maximizing returns in a volatile market environment with disciplined long-term strategies.", image: FALLBACK_IMAGES[2], url: "https://economictimes.indiatimes.com/wealth/invest", pubDate: new Date().toISOString(), color: "purple" },
  { id: 'f4', title: "UPI Crosses 10 Billion Monthly Transactions", description: "India's Unified Payments Interface hits a new milestone, cementing its position as the world's largest real-time payments network by volume.", image: FALLBACK_IMAGES[3], url: "https://economictimes.indiatimes.com/tech/technology", pubDate: new Date().toISOString(), color: "green" },
  { id: 'f5', title: "AI-Powered Personal Finance Tools on the Rise", description: "A new wave of AI-driven budgeting apps is helping Gen-Z track spending and make smarter financial decisions automatically.", image: FALLBACK_IMAGES[4], url: "https://economictimes.indiatimes.com/tech/artificial-intelligence", pubDate: new Date().toISOString(), color: "red" },
  { id: 'f6', title: "Smart Budgeting Tips for Students in 2026", description: "Financial experts weigh in on how students can manage expenses, avoid debt traps, and build healthy money habits from day one.", image: FALLBACK_IMAGES[5], url: "https://economictimes.indiatimes.com/wealth/personal-finance-news", pubDate: new Date().toISOString(), color: "blue" }
];

const fetchUrl = (url) => {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BrokeBoy/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
};

// Clean a string — strips CDATA, HTML tags, and HTML entities
const cleanText = (str) => {
  if (!str) return '';
  return str
    .replace(/<!\[CDATA\[/gi, '')
    .replace(/\]\]>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .trim();
};

// Extract raw content between XML tags (includes CDATA wrapper if present)
const extractTag = (xml, tag) => {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const match = xml.match(re);
  return match ? match[1] : '';
};

const extractImage = (itemXml) => {
  let match = itemXml.match(/<media:content[^>]+url="([^"]+)"[^>]*>/i);
  if (match) return match[1];
  match = itemXml.match(/<media:thumbnail[^>]+url="([^"]+)"[^>]*>/i);
  if (match) return match[1];
  match = itemXml.match(/<enclosure[^>]+url="([^"]+)"[^>]*type="image[^"]*"/i);
  if (match) return match[1];
  match = itemXml.match(/<img[^>]+src="([^"]+)"/i);
  if (match) return match[1];
  return null;
};

const parseRSS = (xml, limit = 6) => {
  const colors = ['blue', 'orange', 'purple', 'green', 'red', 'blue'];
  const items = [];
  const itemMatches = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];

  for (let i = 0; i < Math.min(itemMatches.length, limit); i++) {
    const item = itemMatches[i];

    const title = cleanText(extractTag(item, 'title'));
    const link = cleanText(extractTag(item, 'link')) || cleanText(extractTag(item, 'guid'));
    const rawDesc = extractTag(item, 'description');
    const description = cleanText(rawDesc).substring(0, 200);
    const pubDate = cleanText(extractTag(item, 'pubDate'));
    const image = extractImage(item);

    if (!title || !link) continue;

    items.push({
      id: `article-${i}`,
      title,
      description: description + (description.length >= 200 ? '...' : ''),
      image: image || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
      url: link,
      pubDate: pubDate || new Date().toISOString(),
      color: colors[i % colors.length]
    });
  }
  return items;
};

const RSS_FEEDS = [
  'https://economictimes.indiatimes.com/markets/rssfeeds/1977021502.cms',
  'https://economictimes.indiatimes.com/rssfeedsdefault.cms',
  'https://www.moneycontrol.com/rss/business.xml',
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Content-Type');
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method not allowed' });

  for (const feed of RSS_FEEDS) {
    try {
      const xml = await fetchUrl(feed);
      if (!xml || xml.length < 100) continue;
      const articles = parseRSS(xml, 6);
      if (articles.length > 0) {
        return res.status(200).json({ success: true, data: articles, isFallback: false });
      }
    } catch (err) {
      console.error(`Feed failed (${feed}):`, err.message);
      continue;
    }
  }

  return res.status(200).json({ success: true, data: FALLBACK_NEWS, isFallback: true });
};
