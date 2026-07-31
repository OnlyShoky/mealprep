import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import RecipeGrid from '../components/recipes/RecipeGrid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div>
      <div className="flex items-center gap-4 mb-8 border-b-2 border-sepia-300 pb-4">
        <FontAwesomeIcon icon={faHeart} className="text-4xl text-red-500" />
        <h1 className="text-4xl font-bold text-normal ruslan-display">
          Your Favorite Recipes
        </h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-sepia-100 rounded-2xl border border-sepia-200">
          <FontAwesomeIcon icon={faHeart} className="text-6xl text-sepia-300 mb-4 block mx-auto" />
          <h2 className="text-2xl font-bold text-normal mb-2">No favorites yet</h2>
          <p className="text-sepia-800 mb-6">
            You haven't saved any recipes to your favorites. 
            Click the heart icon on any recipe to save it for later!
          </p>
          <Link 
            to="/recipes" 
            className="inline-block bg-sepia-500 hover:bg-sepia-warn hover:text-white text-sepia-800 font-bold px-6 py-3 rounded-full transition-colors shadow-button-flat-nopressed active:shadow-button-flat-pressed"
          >
            Browse Recipes
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 text-sm font-semibold text-sepia-800">
            You have {favorites.length} saved {favorites.length === 1 ? 'recipe' : 'recipes'}
          </div>
          <RecipeGrid recipes={favorites} />
        </>
      )}
    </div>
  );
}
