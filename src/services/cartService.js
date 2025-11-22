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

  // FIX: Backend 'CheckoutRequest' only accepts paymentMethodId & ecoPointsToRedeem
  // The address MUST be set via selectShipping BEFORE calling this.
  checkout: async ({ paymentMethodId, ecoPointsToRedeem = 0 }) => {
    const response = await api.post("/checkout", { 
        paymentMethodId, 
        ecoPointsToRedeem 
    });
    return response.data;
  }
};