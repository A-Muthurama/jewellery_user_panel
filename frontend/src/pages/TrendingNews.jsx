import React, { useEffect, useState } from "react";
import { ExternalLink, Globe, TrendingUp, Newspaper, Zap } from "lucide-react";
import { fetchTrendingNews } from "../services/news.service";
import "./TrendingNews.css";

const NEWS_CATEGORIES = ["All", "India", "Global", "Market"];

const TrendingNews = () => {
  const [news, setNews] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await fetchTrendingNews();
        setNews(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  // --- Category heuristics ---
  const isMarketArticle = (a) => {
    const t = `${a.title} ${a.summary || ""}`.toLowerCase();
    return /\b(market|markets|price|prices|gold|bullion|commodity|commodities|rate|rates|demand|supply|inflation)\b/.test(t);
  };

  const isIndiaArticle = (a) => {
    const src = (a.source || "").toLowerCase();
    const indiaSources = [
      "the-times-of-india",
      "times of india",
      "economic-times",
      "the economic times",
      "livemint",
      "the hindu",
      "hindustan",
      "indiatoday",
      "ndtv",
      "zeenews",
      "business-standard",
      "business standard",
    ];

    if (indiaSources.some(s => src.includes(s))) return true;

    const t = `${a.title} ${a.summary || ""}`.toLowerCase();
    return /\b(india|indian|mumbai|delhi|bengaluru|chennai|kolkata|hyderabad|rbi)\b/.test(t);
  };

  const isGlobalArticle = (a) => {
    const src = (a.source || "").toLowerCase();
    const globalSources = ["reuters", "bloomberg", "wsj", "financial times", "guardian", "forbes", "cnn", "nbc", "bbc"];
    if (globalSources.some(s => src.includes(s))) return true;

    const t = `${a.title} ${a.summary || ""}`.toLowerCase();
    return /\b(global|international|world|worldwide)\b/.test(t);
  };

  const getCategoryForArticle = (a) => {
    if (isMarketArticle(a)) return "Market";
    if (isIndiaArticle(a)) return "India";
    if (isGlobalArticle(a)) return "Global";
    return "Global"; // default
  };

  const filteredNews =
    activeCategory === "All"
      ? news
      : news.filter(n => getCategoryForArticle(n) === activeCategory);

return (
    <div className="news-page container section">
      {/* HEADER */}
      <div className="news-header">
        <h1>Jewellery & Gold Market News</h1>
        <p>
          Verified updates from trusted Indian and global sources related to
          gold, jewellery, and bullion markets.
        </p>
      </div>

      {/* CATEGORY TABS */}
      <div className="news-tabs">
        {NEWS_CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`news-tab ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === "Global" && <Globe size={16} />}
            {cat === "Market" && <TrendingUp size={16} />}
            {cat === "India" && <Newspaper size={16} />}
            {cat}
          </button>
        ))}
      </div>

      {/* STATES */}
      {loading && <p className="text-center">Loading latest news…</p>}
      {error && (
        <p className="text-center error-text">
          Unable to load news at the moment.
        </p>
      )}

      {!loading && !error && news.length === 0 && (
        <p className="text-center">No news available.</p>
      )}

      {/* NEWS LIST */}
      <div className="news-grid">
        {filteredNews.map((item, index) => (
          <div key={index} className="news-card">
            <div className="news-meta">
              <span className="news-source">
                <Zap size={14} style={{ marginRight: "4px", color: "var(--tn-plum)" }} />
                {item.source}
              </span>
              <span className="news-category">{getCategoryForArticle(item)}</span>
              <span className="news-date">
                {new Date(item.publishedAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="news-title">{item.title}</h3>

            {item.summary && (
              <p className="news-summary">{item.summary}</p>
            )}

            <div className="news-footer">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read full article <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* DISCLAIMER */}
      <div className="news-disclaimer">
        News content is sourced from publicly available third-party publishers.
        We do not claim ownership of external articles.
      </div>
    </div>
  );
};

export default TrendingNews;
