import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecipes, getMetadata } from '../services/recipeRepository';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [metadata, setMetadata] = useState({ totalRecipes: 0, totalIngredients: 0, tags: [], cuisines: [], courses: [], popularIngredients: [] });

  useEffect(() => {
    async function loadData() {
      try {
        const [recipesResult, meta] = await Promise.all([getRecipes(), getMetadata()]);
        if (recipesResult && recipesResult.recipes) {
          setRecipes(recipesResult.recipes);
        }
        if (meta) {
          setMetadata(meta);
        }
      } catch (err) {
        console.error("Failed to load home data", err);
      }
    }
    loadData();
  }, []);

  function toggleAccordion(id) {
    const element = document.getElementById(id);
    if (element) element.classList.toggle('hidden');
  }

  return (
    <div className="text-center py-10">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-normal">Welcome to Meal Prep Codex</h1>
        <p className="text-gray-700 text-lg mb-6">Your ultimate destination for delicious recipes and cooking inspiration from around the world. </p>

        {/* Stats Section */}
        <div className="flex justify-center items-center space-x-10 text-lg">
          <div className="bg-orange-50 rounded-lg px-6 py-4 shadow-md hover:shadow-lg transition-shadow duration-300">
            <p className="font-semibold text-gray-800">Total Recipes</p>
            <p className="text-sepia-warn text-xl font-bold">{metadata.totalRecipes}</p>
          </div>
          <div className="bg-orange-50 rounded-lg px-6 py-4 shadow-md hover:shadow-lg transition-shadow duration-300">
            <p className="font-semibold text-gray-800">Total Ingredients</p>
            <p className="text-sepia-warn text-xl font-bold">{metadata.totalIngredients}</p>
          </div>
        </div>

        {/* Donation Buttons */}
        <div className="flex justify-center space-x-4 mt-8 mb-4">
          <a href="https://www.paypal.com/donate/?hosted_button_id=P49L3AK8RDVMN" target="_blank" rel="noopener noreferrer" className="flex items-center px-6 py-2 bg-[#cc8b86] text-black shadow-md hover:shadow-lg font-semibold rounded-lg transform transition-transform hover:scale-105 transition-colors duration-300">
            <i className="fab fa-paypal mr-2"></i>
            Support via PayPal
          </a>
          <a href="https://www.buymeacoffee.com/shoky" target="_blank" rel="noopener noreferrer" className="flex items-center px-6 py-2 bg-[#c08552] text-black shadow-md hover:shadow-lg font-semibold rounded-lg transform transition-transform hover:scale-105 transition-colors duration-300">
            <i className="fas fa-coffee mr-2"></i>
            Buy Me a Coffee
          </a>
        </div>

        <p className="font-sm text-gray-600 mb-4">
          Help keep this site and API free! Your support covers server costs and ensures we can continue providing great content. <br />
          Currently 0 supporters.       
        </p>

      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Latest Recipes Section */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Latest Recipes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recipes.map(recipe => (
              <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="transform transition-transform hover:scale-105">
                <div className="bg-orange-50 shadow-lg rounded-lg overflow-hidden flex flex-col h-full">
                  {/* Recipe Image */}
                  {recipe.image ? (
                    <img src={recipe.image} alt={recipe.title} className="w-full h-32 sm:h-36 lg:h-40 object-cover" />
                  ) : (
                    <div className="h-32 sm:h-36 lg:h-40 bg-gray-300 flex items-center justify-center">
                      <p className="text-gray-500">No Image Available</p>
                    </div>
                  )}

                  {/* Recipe Details */}
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{recipe.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">July 31, 2026</p>
                    <p className="text-gray-700 mt-2 line-clamp-3">{recipe.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="">
        {/* Ingredients Accordion — starts visible (no hidden), matches Django */}
        <div>
          <button onClick={() => toggleAccordion('ingredients')} className="w-full text-center p-4 text-3xl font-bold rounded-lg hover:bg-orange-200">Popular Ingredients</button>
          <div id="ingredients" className="mt-4 mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {metadata.popularIngredients.map(ingredient => (
                <Link to={`/recipes?ingredient=${encodeURIComponent(ingredient)}`} key={ingredient} className="bg-orange-50 shadow rounded-lg text-center py-4 px-2 hover:shadow-lg">
                  <p className="text-gray-700 font-semibold truncate">{ingredient}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Tags Accordion — starts visible */}
        <div>
          <button onClick={() => toggleAccordion('tags')} className="w-full text-center p-4 text-3xl font-bold rounded-lg hover:bg-orange-200">Tags</button>
          <div id="tags" className="mb-4 mt-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {metadata.tags.map(tag => (
                <Link to={`/recipes?tag=${encodeURIComponent(tag)}`} key={tag} className="bg-orange-50 shadow rounded-lg text-center py-4 px-2 hover:shadow-lg">
                  <p className="text-gray-700 font-semibold truncate">{tag}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Cuisines Accordion — starts visible */}
        <div>
          <button onClick={() => toggleAccordion('cuisines')} className="w-full text-center p-4 text-3xl font-bold rounded-lg hover:bg-orange-200">Cuisines</button>
          <div id="cuisines" className="mb-4 mt-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {metadata.cuisines.map(cuisine => (
                <Link to={`/recipes?cuisine=${encodeURIComponent(cuisine)}`} key={cuisine} className="bg-orange-50 shadow rounded-lg text-center py-4 px-2 hover:shadow-lg">
                  <p className="text-gray-700 font-semibold truncate">{cuisine}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Courses Accordion — starts visible */}
        <div>
          <button onClick={() => toggleAccordion('courses')} className="w-full text-center p-4 text-3xl font-bold rounded-lg hover:bg-orange-200">Courses</button>
          <div id="courses" className="mb-4 mt-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {metadata.courses.map(course => (
                <Link to={`/recipes?course=${encodeURIComponent(course)}`} key={course} className="bg-orange-50 shadow rounded-lg text-center py-4 px-2 hover:shadow-lg">
                  <p className="text-gray-700 font-semibold truncate">{course}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
