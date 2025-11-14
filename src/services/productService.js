import api from './api'; // Import our main axios instance

/**
 * Fetches the recommendation lists for the homepage.
 * (GET /api/v1/recommendations/homepage)
 */
export const getHomepageRecommendations = () => {
  return api.get('/recommendations/homepage');
};

/**
 * Fetches all products (paginated).
 * (GET /api/v1/products)
 */
export const getProducts = (page = 0, size = 10) => {
  return api.get(`/products?page=${page}&size=${size}`);
};

/**
 * Fetches a single product by its ID.
 * (GET /api/v1/products/{id})
 */
export const getProductById = (id) => {
  return api.get(`/products/${id}`);
};

// We will add getRelatedProducts, searchProducts, etc. here later.