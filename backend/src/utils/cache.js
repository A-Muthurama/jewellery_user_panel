let cachedNews = null;
let lastFetchTime = null;

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const getCachedNews = () => {
  if (
    cachedNews &&
    lastFetchTime &&
    Date.now() - lastFetchTime < CACHE_DURATION
  ) {
    return cachedNews;
  }
  return null;
};

export const setCachedNews = (news) => {
  cachedNews = news;
  lastFetchTime = Date.now();
};
