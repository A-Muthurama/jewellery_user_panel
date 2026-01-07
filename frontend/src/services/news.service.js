// Frontend service to fetch news from backend API
export const fetchTrendingNews = async () => {
  try {
    const res = await fetch('/api/news');
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch trending news:', err);
    throw err;
  }
};
