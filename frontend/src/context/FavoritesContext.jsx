import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('favoriteRecipes');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load favorites', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (recipe) => {
    setFavorites(prev => {
      if (prev.some(r => r.id === recipe.id)) return prev;
      return [...prev, recipe];
    });
  };

  const removeFavorite = (recipeId) => {
    setFavorites(prev => prev.filter(r => r.id !== recipeId));
  };

  const isFavorite = (recipeId) => {
    return favorites.some(r => r.id === recipeId);
  };

  const toggleFavorite = (recipe) => {
    if (isFavorite(recipe.id)) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
