import api from "./api";

export const productService = {
  getHomeRecommendations: async () => {
    const response = await api.get("/recommendations/homepage");
    return response.data;
  },

  getProducts: async ({ page = 0, size = 12, sort = "id,desc" }) => {
    const response = await api.get("/products", { 
      params: { page, size, sort } 
    });
    return response.data;
  },

  // FIX: Backend 'ProductController' uses @RequestParam String query
  searchProducts: async (query) => {
    const response = await api.get("/products/search", { 
      params: { query: query } // Changed 'q' to 'query'
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