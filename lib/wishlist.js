"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext({
  wishlistItems: [],
  wishlistCount: 0,
  toggleWishlist: () => {},
  isLiked: () => {},
  clearWishlist: () => {}
});

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist on mount asynchronously to prevent hydration mismatch and eslint warning
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('neo_mirai_wishlist');
      if (saved) {
        try {
          setWishlistItems(JSON.parse(saved));
        } catch (e) {
          console.error("Failed parsing wishlist", e);
        }
      }
    }
  }, []);

  // Save wishlist changes
  const saveWishlist = (items) => {
    setWishlistItems(items);
    localStorage.setItem('neo_mirai_wishlist', JSON.stringify(items));
  };

  const toggleWishlist = (product) => {
    if (!product || !product.id) return;
    const exists = wishlistItems.some(item => item.id === product.id);

    if (exists) {
      const updated = wishlistItems.filter(item => item.id !== product.id);
      saveWishlist(updated);
    } else {
      saveWishlist([...wishlistItems, product]);
    }
  };

  const isLiked = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    saveWishlist([]);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistCount,
      toggleWishlist,
      isLiked,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
