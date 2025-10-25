import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  // Load user's wishlist from localStorage on component mount or user change
  useEffect(() => {
    if (user) {
      const savedWishlist = localStorage.getItem(`wishlist_${user.id}`);
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          setWishlist(parsedWishlist);
        } catch (error) {
          console.error("Error loading wishlist from localStorage:", error);
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
    } else {
      // If no user, clear wishlist
      setWishlist([]);
    }
  }, [user]);

  // Save wishlist to localStorage whenever it changes (only if user exists)
  useEffect(() => {
    if (user && wishlist.length >= 0) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const toggleWishlist = (item) => {
    const normalizedItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      mrp: item.mrp || item.price,
      img: item.img || item.image,
      brand: item.brand || "Bloom",
      category: item.category || "",
      description: item.description || "",
    };
    
    setWishlist((prev) => {
      const exists = prev.find((i) => i.id === normalizedItem.id);
      if (exists) {
        return prev.filter((i) => i.id !== normalizedItem.id);
      } else {
        return [...prev, normalizedItem];
      }
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const clearWishlist = () => {
    setWishlist([]);
    if (user) {
      localStorage.removeItem(`wishlist_${user.id}`);
    }
  };

  const isInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  const addToWishlist = (item) => {
    const normalizedItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      mrp: item.mrp || item.price,
      img: item.img || item.image,
      brand: item.brand || "Bloom",
      category: item.category || "",
      description: item.description || "",
    };

    setWishlist((prev) => {
      const exists = prev.find((i) => i.id === normalizedItem.id);
      if (!exists) {
        return [...prev, normalizedItem];
      }
      return prev;
    });
  };

  return (
    <WishlistContext.Provider
      value={{ 
        wishlist, 
        setWishlist,
        toggleWishlist, 
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        addToWishlist
      }} 
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};