"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth';
import { resolveVariantFromProduct } from './shopify';

const CartContext = createContext({
  cartItems: [],
  cartReady: false,
  isCartOpen: false,
  setCartOpen: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  cartCount: 0,
  cartSubtotal: 0,
  triggerCheckout: () => {}
});

export function CartProvider({ children }) {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartReady, setCartReady] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  // Load cart on mount asynchronously to prevent hydration mismatch and eslint warning
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('neo_mirai_cart');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setTimeout(() => {
            setCartItems(parsed);
            setCartReady(true);
          }, 0);
        } catch (e) {
          console.error("Failed parsing cart", e);
          setCartReady(true);
        }
      } else {
        setCartReady(true);
      }
    }
  }, []);

  // Save cart changes
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('neo_mirai_cart', JSON.stringify(items));
  };

  const addToCart = (product, quantity = 1, color = "", size = "") => {
    if (authLoading) return;
    if (!isLoggedIn) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/profile?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    const cartId = `${product.id}-${color}-${size}`;
    const existingIndex = cartItems.findIndex(item => item.cartId === cartId);

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      saveCart(updated);
    } else {
      const variantId = resolveVariantFromProduct(product, color, size);
      const newItem = {
        cartId,
        id: product.id,
        variantId,
        title: product.title,
        handle: product.handle,
        image: product.images[0],
        price: product.price,
        color,
        size,
        quantity
      };
      saveCart([...cartItems, newItem]);
    }
    setCartOpen(true); // Open cart drawer on add
  };

  const removeFromCart = (cartId) => {
    const filtered = cartItems.filter(item => item.cartId !== cartId);
    saveCart(filtered);
  };

  const updateQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    const updated = cartItems.map(item => 
      item.cartId === cartId ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const triggerCheckout = () => {
    if (cartItems.length === 0) return;
    setCartOpen(false);
    router.push('/checkout');
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartReady,
      isCartOpen,
      setCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      cartCount,
      cartSubtotal,
      triggerCheckout
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
