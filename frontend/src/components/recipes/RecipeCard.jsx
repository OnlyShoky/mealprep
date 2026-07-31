import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUser } from '@fortawesome/free-solid-svg-icons';
import { formatDuration } from '../../utils/formatDuration';
import { useFavorites } from '../../context/FavoritesContext';

export default function RecipeCard({ recipe }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(recipe.id);

  return (
    <div className="bg-sepia-100 rounded-2xl shadow-box-up overflow-hidden flex flex-col h-full hover-scale">
      <Link to={`/recipes/${recipe.id}`} className="block relative">
        <img 
          src={recipe.image_card || recipe.image} 
          alt={recipe.title} 
          className="w-full h-48 object-cover border-b-2 border-sepia-200"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          {recipe.courses && recipe.courses[0] && (
            <span className="bg-white bg-opacity-80 text-sepia-800 text-xs font-bold px-2 py-1 rounded-full">
              {recipe.courses[0]}
            </span>
          )}
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/recipes/${recipe.id}`}>
            <h3 className="text-xl font-bold text-normal hover:text-sepia-warn transition-colors line-clamp-2 leading-tight">
              {recipe.title}
            </h3>
          </Link>
        </div>
        
        <p className="text-sm text-sepia-800 line-clamp-3 mb-4 flex-grow">
          {recipe.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-sepia-800 font-medium">
          <div className="flex gap-3">
            <span className="flex items-center" title="Total Time">
              <FontAwesomeIcon icon={faClock} className="mr-1 text-sepia-warn" />
              {formatDuration(recipe.total_time)}
            </span>
            <span className="flex items-center" title="Servings">
              <FontAwesomeIcon icon={faUser} className="mr-1 text-sepia-warn" />
              {recipe.servings}
            </span>
          </div>
          
          <button 
            onClick={(e) => { e.preventDefault(); toggleFavorite(recipe); }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-button-flat-nopressed active:shadow-button-flat-pressed ${
              favorite ? 'text-red-500 bg-red-100' : 'text-sepia-800 bg-sepia-200 hover:bg-sepia-300'
            }`}
            title={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <i className={`${favorite ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
          </button>
        </div>
      </div>
    </div>
  );
}
