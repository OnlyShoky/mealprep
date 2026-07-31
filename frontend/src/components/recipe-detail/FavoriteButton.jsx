import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFavorites } from '../../context/FavoritesContext';

export default function FavoriteButton({ recipe, className = '' }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(recipe.id);

  return (
    <button
      onClick={() => toggleFavorite(recipe)}
      className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide transition-all shadow-button-flat-nopressed active:shadow-button-flat-pressed ${
        favorite 
          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
          : 'bg-sepia-200 text-sepia-800 hover:bg-sepia-warn hover:text-white'
      } ${className}`}
    >
      <FontAwesomeIcon icon={favorite ? ['fas', 'heart'] : ['far', 'heart']} className="text-lg" />
      {favorite ? 'Saved to Favorites' : 'Save Recipe'}
    </button>
  );
}
