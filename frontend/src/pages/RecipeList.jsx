import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { getRecipes } from '../services/recipeRepository';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function RecipeList() {
  const query = useQuery();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  
  const tag = query.get('tag');
  const ingredient = query.get('ingredient');
  const cuisine = query.get('cuisine');
  const course = query.get('course');
  const page = parseInt(query.get('page') || '1', 10);
  
  useEffect(() => {
    async function loadRecipes() {
      try {
        const result = await getRecipes({
          tag,
          ingredient,
          cuisine,
          course,
          page,
          pageSize: 12
        });
        if (result && result.recipes) {
          setRecipes(result.recipes);
          setTotalPages(result.totalPages || 1);
        }
      } catch (err) {
        console.error("Failed to load recipes", err);
      }
    }
    
    loadRecipes();
  }, [tag, ingredient, cuisine, course, page]);

  let title = "All";
  if (tag) title = tag;
  if (ingredient) title = ingredient;
  if (cuisine) title = cuisine;
  if (course) title = course;

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(location.search);
    if (tag) params.set('tag', tag);
    if (ingredient) params.set('ingredient', ingredient);
    if (cuisine) params.set('cuisine', cuisine);
    if (course) params.set('course', course);
    params.set('page', newPage);
    navigate(`/recipes?${params.toString()}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{title} Recipes</h1>
      
      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {recipes.map(recipe => (
          <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="hover:scale-105 transition-transform">
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

      {/* Dynamic Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
            <nav aria-label="Page navigation">
                <ul className="inline-flex items-center space-x-1">
                    <li>
                        <button
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page <= 1}
                          className={`px-3 py-2 leading-tight rounded-l-lg border border-gray-300 ${
                            page <= 1
                              ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                              : 'text-gray-700 bg-white hover:bg-gray-100 cursor-pointer'
                          }`}
                        >
                            <strong>❮</strong>
                        </button>
                    </li>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <li key={p}>
                        <button
                          onClick={() => handlePageChange(p)}
                          className={`px-3 py-2 border border-gray-300 rounded ${
                            p === page
                              ? 'text-white bg-sepia-800 font-bold'
                              : 'text-gray-700 bg-white hover:bg-gray-100 cursor-pointer'
                          }`}
                        >
                          {p}
                        </button>
                      </li>
                    ))}
                    
                    <li>
                        <button
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page >= totalPages}
                          className={`px-3 py-2 leading-tight rounded-r-lg border border-gray-300 ${
                            page >= totalPages
                              ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                              : 'text-gray-700 bg-white hover:bg-gray-100 cursor-pointer'
                          }`}
                        >
                            ❯
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
      )}
    </div>
  );
}

