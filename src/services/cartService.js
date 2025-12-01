import api from "./api";

export const cartService = {
  getCart: async () => {
    const response = await api.get("/cart");
    return response.data;
  },

  addToCart: async (productData) => {
    const response = await api.post("/cart/add", productData);
    return response.data;
  },

  updateCartItem: async (cartItemId, quantity) => {
    const response = await api.put(`/cart/update/${cartItemId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (cartItemId) => {
    const response = await api.delete(`/cart/remove/${cartItemId}`);
    return response.data;
  },

  getShippingOptions: async (addressId) => {
    const response = await api.get(`/cart/shipping-options/${addressId}`);
    return response.data;
  },

  selectShipping: async (addressId) => {
    const response = await api.post("/cart/select-shipping", { addressId });
    return response.data;
  },

  applyDiscount: async (code) => {
    const response = await api.post("/cart/apply-discount", { discountCode: code });
    return response.data;
  },

  // --- NEW ---
  getAvailableDiscounts: async () => {
    const response = await api.get("/cart/discounts");
    return response.data;
  },
  // -----------

  checkout: async (checkoutData) => {
    const response = await api.post("/checkout", checkoutData);
    return response.data;
  }
};