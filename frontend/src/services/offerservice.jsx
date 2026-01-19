// Use VITE_API_BASE_URL from env, fallback to relative /api for local testing
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const PUBLIC_API_URL = `${API_BASE_URL}/public/offers`;

export const fetchOffers = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.state) params.append('state', filters.state);
    if (filters.city) params.append('city', filters.city);
    if (filters.pincode) params.append('pincode', filters.pincode);
    if (filters.sort) params.append('sort', filters.sort);

    const queryString = params.toString();
    const url = queryString ? `${PUBLIC_API_URL}?${queryString}` : PUBLIC_API_URL;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch offers: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching offers:", error);
    return [];
  }
};

export const fetchOfferById = async (id) => {
  try {
    const response = await fetch(`${PUBLIC_API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch offer detail");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching offer detail:", error);
    return null;
  }
};

export const likeOffer = async (id, action = 'like') => {
  try {
    const response = await fetch(`${PUBLIC_API_URL}/${id}/like`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action })
    });
    if (!response.ok) {
      throw new Error("Failed to like offer");
    }
    return await response.json();
  } catch (error) {
    console.error("Error liking offer:", error);
    return null;
  }
};
