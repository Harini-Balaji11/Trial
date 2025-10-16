import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 points to the existing root-level data folder
const DATA_DIR = path.join(__dirname, "../data");

// static payload (themes data)
const THEMES_PAYLOAD = path.join(__dirname, "../frontend/public/themes_payload.json");

const app = express();
app.use(cors());
app.use(express.json());

const exists = (p) => { try { fs.accessSync(p); return true; } catch { return false; } };

// Generate mock tweets for themes
const generateMockTweets = (themeId, limit = 10) => {
  const themes = {
    0: { name: "User Engagement and Experience Insights", keywords: ["noise", "environment", "clothing", "children"] },
    1: { name: "Walmart User Feedback Insights", keywords: ["exclusivity", "fulfillment", "inventory", "delivery"] },
    2: { name: "User Feedback on Price Concerns", keywords: ["pricing", "coffee", "increases", "transparency"] },
    3: { name: "Walmart User Feedback Insights", keywords: ["support", "online", "fulfillment", "community"] },
    4: { name: "User Sentiment on Food Products", keywords: ["quality", "freshness", "availability", "produce"] },
    5: { name: "User Satisfaction and Engagement Insights", keywords: ["availability", "reliability", "inventory", "communication"] },
    6: { name: "Walmart User Experience Insights", keywords: ["accessibility", "responsiveness", "economy", "community"] },
    7: { name: "User Feedback on Pricing Issues", keywords: ["pricing", "gouging", "tariffs", "safety"] },
    8: { name: "Customer Service and Order Feedback", keywords: ["responsiveness", "returns", "delivery", "communication"] },
    9: { name: "User Insights: American & Indian Perspectives", keywords: ["hiring", "H1B", "management", "diversity"] },
    10: { name: "Radioactive Shrimp User Feedback", keywords: ["shrimp", "safety", "FDA", "contamination"] },
    11: { name: "User Engagement and Feedback Trends", keywords: ["organization", "security", "placement", "safety"] }
  };

  const theme = themes[themeId] || themes[0];
  const sentiments = ['positive', 'neutral', 'negative'];
  const aspects = ['pricing', 'delivery', 'returns', 'staff', 'app/ux'];
  
  const tweets = [];
  for (let i = 0; i < limit; i++) {
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    const aspect = aspects[Math.floor(Math.random() * aspects.length)];
    const keyword = theme.keywords[Math.floor(Math.random() * theme.keywords.length)];
    
    const tweetTexts = [
      `Just had an amazing experience with ${keyword} at Walmart! The staff was so helpful and friendly.`,
      `Walmart's ${keyword} service has really improved lately. Much better than before!`,
      `Had some issues with ${keyword} at Walmart today, but they resolved it quickly.`,
      `The ${keyword} at my local Walmart store is always top-notch. Highly recommend!`,
      `Walmart's ${keyword} could use some improvement. Not the best experience today.`,
      `Love shopping at Walmart! Their ${keyword} is exactly what I needed.`,
      `Walmart's ${keyword} policy is very customer-friendly. Great service!`,
      `Had to return something due to ${keyword} issues, but Walmart made it easy.`,
      `Walmart's ${keyword} team went above and beyond to help me today.`,
      `The ${keyword} at Walmart is consistently good. No complaints here!`
    ];
    
    const tweetText = tweetTexts[Math.floor(Math.random() * tweetTexts.length)];
    
    tweets.push({
      id: `${themeId}_${i + 1}`,
      twitterurl: `https://twitter.com/user/status/${Math.random().toString(36).substr(2, 9)}`,
      text_clean: tweetText,
      text: tweetText,
      clean_tweet: tweetText,
      sentiment_label: sentiment,
      sentiment_score: sentiment === 'positive' ? (Math.random() * 0.5 + 0.5).toFixed(2) : 
                      sentiment === 'negative' ? (Math.random() * 0.5 - 0.5).toFixed(2) : 
                      (Math.random() * 0.2 - 0.1).toFixed(2),
      aspect_dominant: aspect,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdat: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      lang: 'en',
      has_url: Math.random() > 0.7,
      has_hashtag: Math.random() > 0.8
    });
  }
  
  return tweets;
};

// List themes (uses static JSON)
app.get("/api/themes", async (req, res) => {
  try {
    if (exists(THEMES_PAYLOAD)) {
      const payload = JSON.parse(fs.readFileSync(THEMES_PAYLOAD, "utf8"));
      return res.json(payload);
    }

    // Fallback if file doesn't exist
    res.json({ 
      themes: [], 
      updated_at: new Date().toISOString(),
      error: "Themes payload file not found"
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e) });
  }
});

// Drill-down tweets for a theme (mock data)
app.get("/api/themes/:id/tweets", async (req, res) => {
  try {
    const themeId = Number(req.params.id);
    const limit = Math.min(Number(req.query.limit || 10), 50);
    const q = (req.query.q || "").toString().trim();

    console.log(`Fetching tweets for theme ${themeId}, limit: ${limit}`);

    // Generate mock tweets
    let tweets = generateMockTweets(themeId, limit);
    
    // Filter by search query if provided
    if (q) {
      tweets = tweets.filter(tweet => 
        tweet.text_clean.toLowerCase().includes(q.toLowerCase()) ||
        tweet.text.toLowerCase().includes(q.toLowerCase()) ||
        tweet.clean_tweet.toLowerCase().includes(q.toLowerCase())
      );
    }

    console.log(`Generated ${tweets.length} tweets for theme ${themeId}`);

    res.json({ 
      theme: themeId, 
      count: tweets.length, 
      items: tweets,
      note: "This is mock data for demonstration purposes"
    });
  } catch (e) {
    console.error("Error in tweets endpoint:", e);
    res.status(500).json({ 
      error: String(e),
      message: "Failed to generate mock tweets",
      theme: req.params.id
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Themes API running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   GET /api/themes - List all themes`);
  console.log(`   GET /api/themes/:id/tweets - Get tweets for a theme`);
});
