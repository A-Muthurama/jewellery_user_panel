const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const STORES_URL = `${API_BASE_URL}/public/stores`;

export const fetchStores = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.city && filters.city !== "ALL") params.append("city", filters.city);
    if (filters.state && filters.state !== "ALL") params.append("state", filters.state);
    if (filters.category && filters.category !== "ALL") params.append("category", filters.category);
    if (filters.isVerified) params.append("isVerified", "true");
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    const queryString = params.toString();
    const url = queryString ? `${STORES_URL}?${queryString}` : STORES_URL;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch stores: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching stores:", error);
    return { success: false, total: 0, data: [] };
  }
};

export const fetchStoreFilters = async () => {
  try {
    const response = await fetch(`${STORES_URL}/meta/filters`);
    if (!response.ok) {
      throw new Error("Failed to fetch store filters");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching store filters:", error);
    return { cities: [], states: [], categories: [] };
  }
};

export const fetchStoreBySlugOrId = async (slugOrId) => {
  try {
    const response = await fetch(`${STORES_URL}/${slugOrId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch store profile");
    }
    const data = await response.json();
    return data.store || null;
  } catch (error) {
    console.error("Error fetching store profile:", error);
    return null;
  }
};

export const submitStoreClaim = async (storeId, claimData) => {
  try {
    const response = await fetch(`${STORES_URL}/${storeId}/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(claimData),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Failed to submit claim request");
    }
    return result;
  } catch (error) {
    console.error("Error submitting store claim:", error);
    throw error;
  }
};

export const submitStoreReport = async (storeId, reportData) => {
  try {
    const response = await fetch(`${STORES_URL}/${storeId}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reportData),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Failed to submit report");
    }
    return result;
  } catch (error) {
    console.error("Error submitting store report:", error);
    throw error;
  }
};
