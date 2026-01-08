import axios from "axios";
import fs from "fs";
import path from "path";

// CACHE CONFIG
const CACHE_TTL = 10 * 60 * 60 * 1000; // 10 HOURS
const CACHE_FILE = path.resolve("news-cache.json");

let cachedNews = null;
let cacheTimestamp = null;

// MOVIE/STREAMING FOCUSED DEDUPLICATION
function removeDuplicates(articles) {
  const seenUrls = new Set();
  const seenTitles = new Set();
  const unique = [];
  
  for (const article of articles) {
    if (!article || !article.title || !article.url) continue;
    
    // Normalize title
    const normalizedTitle = article.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Skip if duplicate
    if (seenUrls.has(article.url) || seenTitles.has(normalizedTitle)) {
      continue;
    }
    
    seenUrls.add(article.url);
    seenTitles.add(normalizedTitle);
    unique.push(article);
  }
  
  console.log(`🔍 Deduplication: ${articles.length} → ${unique.length} unique`);
  return unique;
}

// MOVIE/STREAMING FILTER
function isMovieStreamingNews(article) {
  if (!article || !article.title) return false;
  
  const text = `${article.title} ${article.description || ""}`.toLowerCase();
  
  const movieKeywords = [
    "movie", "film", "cinema", "trailer", "marvel", "dc", "mcu",
    "netflix", "disney", "disney+", "prime video", "amazon prime",
    "hotstar", "hbo", "star wars", "starwars", "franchise",
    "box office", "casting", "sequel", "prequel", "series",
    "streaming", "ott", "superhero", "avengers", "batman", "superman"
  ];
  
  const hasMovieKeyword = movieKeywords.some(keyword => text.includes(keyword));
  
  // EXCLUDE these topics
  const excludeKeywords = [
    "election",
    "crime",
    "politics",
    "trump",
    "election",
    "murder",
    "football",
    "basketball"
  ];
  
  const hasExcluded = excludeKeywords.some(keyword => text.includes(keyword));
  
  return hasMovieKeyword && !hasExcluded;
}

// FETCH MULTIPLE QUERIES
async function fetchMovieNews() {
  const queries = [
    "Marvel OR MCU OR Avengers",
    "Batman OR Superman",
    "Netflix movies OR Netflix series",
    "Disney+ OR Disney Plus",
    "Amazon Prime Video OR Prime Video",
    "Hotstar OR Disney Hotstar",
    "Star Wars",
    "movie trailer OR film trailer",
    "box office OR cinema",
    "movie casting OR film casting"
  ];
  
  console.log(`📡 Fetching from ${queries.length} targeted queries...`);
  
  const allArticles = [];
  
  for (let i = 0; i < queries.length; i++) {
    try {
    
      if (i > 0) await new Promise(resolve => setTimeout(resolve, 300));
      
      const response = await axios.get("https://gnews.io/api/v4/search", {
        params: {
          q: queries[i],
          lang: "en",
          max: 10,
          sortby: "publishedAt",
          apikey: process.env.NEWS_API_KEY,
        },
        timeout: 10000,
      });
      
      const articles = response.data?.articles || [];
      console.log(`   Query ${i + 1}: "${queries[i]}" → ${articles.length} articles`);
      allArticles.push(...articles);
      
    } catch (error) {
      console.warn(`   ⚠️ Query ${i + 1} failed:`, error.message);
    }
  }
  
  console.log(`📰 Total fetched: ${allArticles.length} articles`);
  return allArticles;
}

// MAIN CONTROLLER
export const getLatestNews = async (req, res, next) => {
  try {
    const now = Date.now();
    
    // CHECK MEMORY CACHE (10 HOUR TTL)
    if (cachedNews && cacheTimestamp && (now - cacheTimestamp < CACHE_TTL)) {
      const cacheAge = Math.floor((now - cacheTimestamp) / (60 * 60 * 1000));
      console.log(`📰 Serving from cache (${cacheAge}h old, refreshes in ${10 - cacheAge}h)`);

      return res.json({
        success: true,
        source: "cache",
        count: cachedNews.length,
        articles: cachedNews,
        cachedHoursAgo: cacheAge,
      });
    }
    
    console.log("Cache expired or empty, fetching fresh news...");
    
    // CHECK API KEY
    if (!process.env.NEWS_API_KEY) {
      throw new Error("NEWS_API_KEY not configured");
    }
    
    // FETCH FROM MULTIPLE QUERIES
    const allArticles = await fetchMovieNews();
    
    if (allArticles.length === 0) {
      throw new Error("No articles fetched from API");
    }
    
    // FILTER FOR MOVIE/STREAMING (FAIL-SAFE)
    let relevantArticles = allArticles.filter(isMovieStreamingNews);
    console.log(`Relevant movie/streaming articles: ${relevantArticles.length}`);

    // If filters remove everything, fallback gracefully
    if (relevantArticles.length === 0) {
      console.warn("No articles matched filters — falling back to unfiltered results");
      relevantArticles = allArticles;
    }

    
    // REMOVE DUPLICATES
    const uniqueArticles = removeDuplicates(relevantArticles);
    console.log(` Unique articles: ${uniqueArticles.length}`);
    
    // SORT BY DATE & TAKE TOP 20
    const finalArticles = uniqueArticles
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 20); // Keep top 20
    
    console.log(`Final selection: ${finalArticles.length} articles`);
    
    // Log first 5 titles
    console.log("Sample articles:");
    finalArticles.slice(0, 5).forEach((article, i) => {
      console.log(`   ${i + 1}. ${article.title.substring(0, 60)}...`);
    });
    
    // SAVE TO MEMORY CACHE
    cachedNews = finalArticles;
    cacheTimestamp = now;
    
    // SAVE TO FILE CACHE (BACKUP)
    try {
      fs.writeFileSync(
        CACHE_FILE,
        JSON.stringify({
          timestamp: now,
          cachedAt: new Date().toISOString(),
          articles: finalArticles,
        }, null, 2)
      );
      console.log(" Saved to disk cache");
    } catch (fileError) {
      console.warn(" Disk cache write failed:", fileError.message);
    }
    
    return res.json({
      success: true,
      source: "fresh-api",
      count: finalArticles.length,
      articles: finalArticles,
    });
    
  } catch (error) {
    console.error(" ERROR:", error.message);
    
    // FALLBACK TO FILE CACHE
    if (fs.existsSync(CACHE_FILE)) {
      console.log(" Loading from file cache (fallback)...");
      
      try {
        const fileData = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
        
        if (fileData.articles && Array.isArray(fileData.articles)) {
          cachedNews = fileData.articles;
          cacheTimestamp = fileData.timestamp || Date.now();
          
          console.log(`Loaded ${cachedNews.length} articles from file cache`);
          
          return res.json({
            success: true,
            source: "file-cache",
            count: cachedNews.length,
            articles: cachedNews,
          });
        }
      } catch (parseError) {
        console.error("❌ File cache parse error:", parseError.message);
      }
    }
    
    console.log("⚠️ No cache available, returning empty");
    
    return res.json({
      success: false,
      message: "Unable to fetch news. Please try again later.",
      count: 0,
      articles: [],
    });
  }
};