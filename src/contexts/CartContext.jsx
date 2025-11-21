import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { cartService } from "../services/cartService";

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated, hasRole, loading: authLoading } = useAuth();
  
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated && hasRole("ROLE_CUSTOMER")) {
        loadCart();
      } else {
        setCart(null);
      }
    }
  }, [isAuthenticated, user, authLoading]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productData) => {
    try {
      const data = await cartService.addToCart(productData);
      setCart(data);
      return data;
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  };

  const updateCartItem = async (id, quantity) => {
    try {
      const data = await cartService.updateCartItem(id, quantity);
      setCart(data);
      return data;
    } catch (error) {
      console.error("Failed to update cart item:", error);
      throw error;
    }
  };

  const removeFromCart = async (id) => {
    try {
      const data = await cartService.removeFromCart(id);
      setCart(data);
      return data;
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      throw error;
    }
  };

  const checkout = async (checkoutData) => {
    try {
      const data = await cartService.checkout(checkoutData);
      setCart(null);
      return data;
    } catch (error) {
      console.error("Failed to checkout:", error);
      throw error;
    }
  };

  const getCartItemCount = () => {
    return cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const getCartTotal = () => {
    return cart?.total || 0;
  };

  const value = {
    cart,
    loading,
    setCart, // <--- FIX: EXPOSED THIS FUNCTION
    loadCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    checkout,
    getCartItemCount,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};