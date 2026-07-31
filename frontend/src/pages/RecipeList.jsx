import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getRecipes } from '../services/recipeRepository';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function RecipeList() {
  const query = useQuery();
  const [recipes, setRecipes] = useState([]);
  
  const tag = query.get('tag');
  const ingredient = query.get('ingredient');
  const cuisine = query.get('cuisine');
  const course = query.get('course');
  
  useEffect(() => {
    async function loadRecipes() {
      try {
        const result = await getRecipes({
          tag,
          ingredient,
          cuisine,
          course
        });
        if (result && result.recipes) {
          setRecipes(result.recipes);
        }
      } catch (err) {
        console.error("Failed to load recipes", err);
      }
    }
    
    loadRecipes();
  }, [tag, ingredient, cuisine, course]);

  let title = "All";
  if (tag) title = tag;
  if (ingredient) title = ingredient;
  if (cuisine) title = cuisine;
  if (course) title = course;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{title} Recipes</h1>
      
      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {recipes.map(recipe => (
          <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="hover:scale-110 transition-transform">
            <div className="bg-orange-50 shadow-lg rounded-lg overflow-hidden flex flex-col h-full text-left">
              {/* Recipe Image */}
              {recipe.image ? (
                <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="h-48 bg-gray-300"></div>
              )}
              
              {/* Recipe Details */}
              <div className="p-4 flex-grow flex flex-col">
                <h2 className="text-xl font-semibold text-gray-800">{recipe.title}</h2>
                <p className="text-sm text-gray-500">July 31, 2026</p>
                <p className="text-gray-700 mt-2 line-clamp-3">{recipe.description?.substring(0, 80)}...</p>
              </div>
            </div>
          </Link>
        ))}
      </div> 

      {/* Pagination (Mocked visual for now to match exactly) */}
      {recipes.length > 0 && (
        <div className="mt-20 flex justify-center">
            <nav aria-label="Page navigation">
                <ul className="inline-flex items-center -space-x-px">
                    <li>
                        <span className="px-2 py-2 leading-tight text-gray-400 bg-gray-200 border border-gray-300 rounded-l-lg cursor-not-allowed">
                            <strong>❮</strong>
                        </span>
                    </li>
                    
                    <li>
                        <span className="px-3 py-2 text-white bg-sepia-800 border border-gray-300">1</span>
                    </li>
                    
                    <li>
                        <span className="px-2 py-2 leading-tight text-gray-400 bg-gray-200 border border-gray-300 rounded-r-lg cursor-not-allowed">
                        ❯
                        </span>
                    </li>
                </ul>
            </nav>
        </div>
      )}
    </div>
  );
}
