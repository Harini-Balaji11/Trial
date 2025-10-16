import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Simple themes data
const themes = [
  { id: 0, name: "User Engagement and Experience Insights", tweet_count: 410 },
  { id: 1, name: "Walmart User Feedback Insights", tweet_count: 364 },
  { id: 2, name: "User Feedback on Price Concerns", tweet_count: 349 },
  { id: 3, name: "Walmart User Feedback Insights", tweet_count: 328 },
  { id: 4, name: "User Sentiment on Food Products", tweet_count: 299 },
  { id: 5, name: "User Satisfaction and Engagement Insights", tweet_count: 635 },
  { id: 6, name: "Walmart User Experience Insights", tweet_count: 335 },
  { id: 7, name: "User Feedback on Pricing Issues", tweet_count: 503 },
  { id: 8, name: "Customer Service and Order Feedback", tweet_count: 468 },
  { id: 9, name: "User Insights: American & Indian Perspectives", tweet_count: 394 },
  { id: 10, name: "Radioactive Shrimp User Feedback", tweet_count: 95 },
  { id: 11, name: "User Engagement and Feedback Trends", tweet_count: 820 }
];

// Generate simple mock tweets
const generateTweets = (themeId, limit = 10) => {
  const tweets = [];
  for (let i = 0; i < limit; i++) {
    tweets.push({
      id: `${themeId}_${i + 1}`,
      twitterurl: `https://twitter.com/user/status/${Math.random().toString(36).substr(2, 9)}`,
      text_clean: `Sample tweet ${i + 1} for theme ${themeId} about Walmart experience.`,
      text: `Sample tweet ${i + 1} for theme ${themeId} about Walmart experience.`,
      clean_tweet: `Sample tweet ${i + 1} for theme ${themeId} about Walmart experience.`,
      sentiment_label: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
      sentiment_score: (Math.random() - 0.5).toFixed(2),
      aspect_dominant: ['pricing', 'delivery', 'returns', 'staff', 'app/ux'][Math.floor(Math.random() * 5)],
      date: new Date().toISOString().split('T')[0],
      createdat: new Date().toISOString(),
      lang: 'en',
      has_url: Math.random() > 0.7,
      has_hashtag: Math.random() > 0.8
    });
  }
  return tweets;
};

// Get themes
app.get("/api/themes", (req, res) => {
  res.json({
    updated_at: new Date().toISOString(),
    themes: themes
  });
});

// Get tweets for a theme
app.get("/api/themes/:id/tweets", (req, res) => {
  const themeId = parseInt(req.params.id);
  const limit = Math.min(parseInt(req.query.limit || 10), 50);
  
  console.log(`Getting tweets for theme ${themeId}, limit: ${limit}`);
  
  const tweets = generateTweets(themeId, limit);
  
  res.json({
    theme: themeId,
    count: tweets.length,
    items: tweets,
    note: "This is mock data for demonstration purposes"
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Simple Themes API running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   GET /api/themes - List all themes`);
  console.log(`   GET /api/themes/:id/tweets - Get tweets for a theme`);
});
