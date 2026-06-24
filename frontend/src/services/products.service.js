const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const PRODUCTS_URL = `${API_BASE_URL}/public/products`;

export const fetchProducts = async () => {
  try {
    const response = await fetch(PRODUCTS_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};
