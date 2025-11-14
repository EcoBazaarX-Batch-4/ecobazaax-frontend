import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // We need this to know if the user is logged in
import * as cartService from '../services/cartService'; // Import all our cart API functions

// 1. Create the Context
const CartContext = createContext(null);

// 2. Create the "Provider" Component
export function CartProvider({ children }) {
  const [cart, setCart] = useState(null); // This will hold our cart object { items: [], ... }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get the user's auth status AND loading state
  const { isAuthenticated, user, roles, loading: authLoading } = useAuth();

  // 3. This effect fetches the cart *when the user logs in*
  useEffect(() => {
    const fetchCart = async () => {
      
      // THIS IS THE FIX: We wait for auth to be done (!authLoading)
      // and check if the user is a CUSTOMER.
      if (isAuthenticated && !authLoading && roles.includes('ROLE_CUSTOMER')) {
        setLoading(true);
        try {
          const response = await cartService.getCart();
          setCart(response.data);
        } catch (err) {
          console.error("Failed to fetch cart:", err);
          setError("Failed to load your cart.");
        } finally {
          setLoading(false);
        }
      } else if (!isAuthenticated) {
        // If user logs out, or is not a customer, clear the cart
        setCart(null);
      }
    };

    fetchCart();
    
    // This hook re-runs when auth state changes
  }, [isAuthenticated, user, roles, authLoading]);

  // 4. Create wrapper functions that call our API and update state
  
  const addToCart = async (productId, quantity) => {
    setLoading(true);
    try {
      const response = await cartService.addToCart(productId, quantity);
      setCart(response.data); // Update the global state with the new cart
      setError(null);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      setError("Failed to add item. Please try again.");
      throw err; // Re-throw error so the component can catch it
    } finally {
      setLoading(false);
    }
  };

  const updateCartQuantity = async (cartItemId, quantity) => {
    setLoading(true);
    try {
      const response = await cartService.updateCartQuantity(cartItemId, quantity);
      setCart(response.data); // Update the global state
      setError(null);
    } catch (err) {
      console.error("Failed to update cart:", err);
      setError("Failed to update item.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    setLoading(true);
    try {
      const response = await cartService.removeFromCart(cartItemId);
      setCart(response.data); // Update the global state
      setError(null);
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      setError("Failed to remove item.");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // 5. This is the value our components will get
  // We'll also calculate the cart item count here
  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const value = {
    cart,
    setCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    loading,
    error,
    cartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// 6. Create a "hook"
// This is a simple shortcut for our components to get the cart data
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};