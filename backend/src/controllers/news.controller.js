import { fetchNewsFromAPI } from "../services/news.service.js";
import { getCachedNews, setCachedNews } from "../utils/cache.js";

const KEYWORDS = [
  "gold",
  "jewellery",
  "jewelry",
  "bullion",
  "hallmark",
  "silver",
  "platinum",
  "diamond"
];

const isRelevant = (article) => {
  const text = `${article.title} ${article.description || ""}`.toLowerCase();
  return KEYWORDS.some(k => text.includes(k));
};

export const getTrendingNews = async (req, res) => {
  try {
    const cached = getCachedNews();
    if (cached) return res.json(cached);

    const response = await fetchNewsFromAPI();

    const cleanedNews = response
      .filter(isRelevant)
      .map(item => ({
        title: item.title,
        summary: item.description,
        source: item.source?.name || "Unknown",
        url: item.url,
        publishedAt: item.publishedAt
      }));

    setCachedNews(cleanedNews);

    // ✅ IMPORTANT: return ARRAY ONLY
    res.json(cleanedNews);

  } catch (error) {
    console.error("NEWS ERROR:", error.message);
    res.status(500).json({ message: "Failed to fetch news" });
  }
};
