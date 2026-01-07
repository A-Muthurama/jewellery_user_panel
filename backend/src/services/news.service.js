import axios from "axios";

const NEWS_API_URL = "https://newsapi.org/v2/everything";

export const fetchNewsFromAPI = async () => {
  const response = await axios.get(NEWS_API_URL, {
    params: {
      q: "gold OR jewellery OR bullion OR diamond OR platinum",
      searchIn: "title,description",
      language: "en",
      sortBy: "publishedAt",
      pageSize: 10,
      apiKey: process.env.NEWS_API_KEY
    }
  });

  return response.data.articles;
};
