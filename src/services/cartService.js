import api from './api'; // Import our main axios instance

/**
 * Fetches the user's current cart from the backend.
 */
export const getCart = () => {
  return api.get('/cart');
};

/**
 * Adds a product to the cart.
 * @param {number} productId - The ID of the product to add.
 * @param {number} quantity - The number of items to add.
 */
export const addToCart = (productId, quantity) => {
  return api.post('/cart/add', {
    productId: productId,
    quantity: quantity,
  });
};

/**
 * Updates the quantity of an item already in the cart.
 * @param {number} cartItemId - The ID of the *cart item* (not the product).
 * @param {number} quantity - The new quantity.
 */
export const updateCartQuantity = (cartItemId, quantity) => {
  return api.put(`/cart/update/${cartItemId}`, {
    quantity: quantity,
  });
};

/**
 * Removes an item from the cart.
 * @param {number} cartItemId - The ID of the *cart item*.
 */
export const removeFromCart = (cartItemId) => {
  return api.delete(`/cart/remove/${cartItemId}`);
};

/**
 * Applies a discount code to the cart.
 * @param {string} discountCode - The code to apply.
 */
export const applyDiscount = (discountCode) => {
  return api.post('/cart/apply-discount', { discountCode });
};

/**
 * Fetches the available shipping options for a selected address.
 * @param {number} addressId - The ID of the user's selected address.
 */
export const getShippingOptions = (addressId) => {
  return api.get(`/cart/shipping-options/${addressId}`);
};

/**
 * Saves the user's final shipping choice to the cart.
 * @param {number} addressId - The ID of the selected address.
 */
export const selectShipping = (addressId) => {
  return api.post('/cart/select-shipping', { addressId });
};