import api from "./api";

export const productService = {
  // GET /api/v1/recommendations/homepage
  getHomeRecommendations: async () => {
    const response = await api.get("/recommendations/homepage");
    return response.data;
  },

  // GET /api/v1/products?page=0&size=10&sort=price,desc
  getProducts: async ({ page = 0, size = 12, sort = "id,desc" }) => {
    const response = await api.get("/products", { 
      params: { page, size, sort } 
    });
    return response.data;
  },

  // GET /api/v1/products/search?query=...
  searchProducts: async (query) => {
    const response = await api.get("/products/search", { 
      params: { query: query } // Backend expects 'query', not 'q'
    });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getRelatedProducts: async (id) => {
    const response = await api.get(`/products/${id}/related`);
    return response.data;
  },

  getProductReviews: async (id) => {
    const response = await api.get(`/products/${id}/reviews`);
    return response.data;
  },

  addReview: async (id, reviewData) => {
    const response = await api.post(`/products/${id}/reviews`, reviewData);
    return response.data;
  },

  trackView: async (id) => {
    const response = await api.post(`/tracking/view/${id}`);
    return response.data;
  },
  
  getLeaderboard: async () => {
    const response = await api.get("/leaderboard/global");
    return response.data;
  }
};