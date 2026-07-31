import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getRecipes } from '../services/recipeRepository';

export default function Search() {
  const [searchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = searchParams.get('q') || '';

  useEffect(() => {
    async function fetchSearchResults() {
      if (!query) {
        setRecipes([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const result = await getRecipes({ search: query });
        if (result && result.recipes) {
          setRecipes(result.recipes);
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Search Results</h1>

      {loading ? (
        <p className="text-gray-600">Searching...</p>
      ) : recipes.length > 0 ? (
        <ul className="p-6">
          {recipes.map(recipe => (
            <li key={recipe.id} className="mb-4">
              <Link to={`/recipes/${recipe.id}`} className="text-gray-800">
                <div className="flex items-center space-x-4">
                  {recipe.image ? (
                    <img src={recipe.image} alt={recipe.title} className="w-16 h-16 object-cover" />
                  ) : (
                    <div className="h-48 bg-gray-300"></div>
                  )}
                  <div className="">
                    <p className="font-semibold text-gray-800">{recipe.title} </p>
                    <p className="text-gray-500">{recipe.description?.substring(0, 100)}...</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No recipes found for &quot;{query}&quot;.</p>
      )}
    </div>
  );
}
