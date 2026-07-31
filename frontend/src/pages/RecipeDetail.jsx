import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecipeById } from '../services/recipeRepository';
import { useFavorites } from '../context/FavoritesContext';
import { formatDuration } from '../utils/formatDuration';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentServings, setCurrentServings] = useState(1);
  const [nutritionOpen, setNutritionOpen] = useState(false);
  
  const { isFavorite, toggleFavorite } = useFavorites();
  
  useEffect(() => {
    async function loadRecipe() {
      setLoading(true);
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
        if (data) {
          setCurrentServings(data.servings || 1);
        }
      } catch (err) {
        console.error("Failed to load recipe", err);
      } finally {
        setLoading(false);
      }
    }
    loadRecipe();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!recipe) return <div className="text-center py-10">Recipe not found</div>;

  const favorite = isFavorite(recipe.id);

  const updateServings = (change) => {
    setCurrentServings(prev => Math.max(1, prev + change));
  };

  const getScaledQuantity = (qty, origServings) => {
    if (!qty) return '';
    const ratio = currentServings / (origServings || 1);
    return (qty * ratio).toFixed(2);
  };

  // Group instructions
  const instructionsLines = (recipe.instructions || '').split('\n').filter(l => l.trim().length > 0);
  let stepCounter = 1;

  // Group ingredients
  const categoriesMap = {};
  recipe.ingredients?.forEach(ing => {
    const cat = ing.groupName || '';
    if (!categoriesMap[cat]) categoriesMap[cat] = [];
    categoriesMap[cat].push(ing);
  });
  const categories = Object.keys(categoriesMap);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-sepia-100 shadow-md rounded-lg p-4 md:p-6 mb-8 flex flex-col md:flex-row justify-between relative">
        {/* Recipe Information */}
        <div className="w-full md:w-7/12">
          {/* Recipe Title */}
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{recipe.title}</h1>
            
            {/* Favorite Button */}
            <button 
              id="favorite-btn" 
              className="absolute top-0 right-0 m-[0.5rem] flex items-center gap-1 px-3 py-1 bg-orange-200 hover:bg-orange-300 text-gray-800 shadow-md hover:shadow-lg transition-shadow flex font-bold py-1 px-3 rounded-full flex items-center" 
              onClick={() => toggleFavorite(recipe)}
            >
              <span className="text-sepia-light p-1">
                {favorite ? (
                  <svg xmlns="http://www.w3.org/2000/svg" focusable="false" width="1rem" height="1rem" viewBox="25 0 500 550"><path fill="currentColor" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" focusable="false" width="1rem" height="1rem" viewBox="25 0 500 550"><path fill="currentColor" d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" /></svg>
                )}
              </span>
              <span className="text-sm hidden md:inline">Save</span>
            </button>
          </div>

          {/* Metadata */}
          <p className="text-sm text-gray-500 mb-4">Published: July 31, 2026</p>

          {/* Recipe Description */}
          <p className="text-gray-700 mb-6">{recipe.description}</p>

          {/* Course and Cuisine */}
          <div className="flex flex-col mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sepia-light">
                <svg xmlns="http://www.w3.org/2000/svg" focusable="false" width="16px" height="16px" viewBox="25 0 500 550"><path fill="currentColor" d="M0 192c0-35.3 28.7-64 64-64c.5 0 1.1 0 1.6 0C73 91.5 105.3 64 144 64c15 0 29 4.1 40.9 11.2C198.2 49.6 225.1 32 256 32s57.8 17.6 71.1 43.2C339 68.1 353 64 368 64c38.7 0 71 27.5 78.4 64c.5 0 1.1 0 1.6 0c35.3 0 64 28.7 64 64c0 11.7-3.1 22.6-8.6 32L8.6 224C3.1 214.6 0 203.7 0 192zm0 91.4C0 268.3 12.3 256 27.4 256l457.1 0c15.1 0 27.4 12.3 27.4 27.4c0 70.5-44.4 130.7-106.7 154.1L403.5 452c-2 16-15.6 28-31.8 28l-231.5 0c-16.1 0-29.8-12-31.8-28l-1.8-14.4C44.4 414.1 0 353.9 0 283.4z" /></svg>
              </span>
              <p className="text-gray-600 font-medium"><strong>Course:</strong> {recipe.courses?.join(', ')}</p>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sepia-light">
                <svg xmlns="http://www.w3.org/2000/svg" focusable="false" width="16px" height="16px" viewBox="25 0 500 550"><path fill="currentColor" d="M57.7 193l9.4 16.4c8.3 14.5 21.9 25.2 38 29.8L163 255.7c17.2 4.9 29 20.6 29 38.5l0 39.9c0 11 6.2 21 16 25.9s16 14.9 16 25.9l0 39c0 15.6 14.9 26.9 29.9 22.6c16.1-4.6 28.6-17.5 32.7-33.8l2.8-11.2c4.2-16.9 15.2-31.4 30.3-40l8.1-4.6c15-8.5 24.2-24.5 24.2-41.7l0-8.3c0-12.7-5.1-24.9-14.1-33.9l-3.9-3.9c-9-9-21.2-14.1-33.9-14.1L257 256c-11.1 0-22.1-2.9-31.8-8.4l-34.5-19.7c-4.3-2.5-7.6-6.5-9.2-11.2c-3.2-9.6 1.1-20 10.2-24.5l5.9-3c6.6-3.3 14.3-3.9 21.3-1.5l23.2 7.7c8.2 2.7 17.2-.4 21.9-7.5c4.7-7 4.2-16.3-1.2-22.8l-13.6-16.3c-10-12-9.9-29.5 .3-41.3l15.7-18.3c8.8-10.3 10.2-25 3.5-36.7l-2.4-4.2c-3.5-.2-6.9-.3-10.4-.3C163.1 48 84.4 108.9 57.7 193zM464 256c0-36.8-9.6-71.4-26.4-101.5L412 164.8c-15.7 6.3-23.8 23.8-18.5 39.8l16.9 50.7c3.5 10.4 12 18.3 22.6 20.9l29.1 7.3c1.2-9 1.8-18.2 1.8-27.5zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" /></svg>
              </span>
              <p className="text-gray-600 font-medium"><strong>Cuisine:</strong> {recipe.cuisines?.join(', ')}</p>
            </div>
            <div className="flex flex-wrap space-y-2 items-center space-x-2 mb-3">
              <span className="text-sepia-light">
                <svg xmlns="http://www.w3.org/2000/svg" focusable="false" width="16px" height="16px" viewBox="25 0 500 550"><path fill="currentColor" d="M345 39.1L472.8 168.4c52.4 53 52.4 138.2 0 191.2L360.8 472.9c-9.3 9.4-24.5 9.5-33.9 .2s-9.5-24.5-.2-33.9L438.6 325.9c33.9-34.3 33.9-89.4 0-123.7L310.9 72.9c-9.3-9.4-9.2-24.6 .2-33.9s24.6-9.2 33.9 .2zM0 229.5L0 80C0 53.5 21.5 32 48 32l149.5 0c17 0 33.3 6.7 45.3 18.7l168 168c25 25 25 65.5 0 90.5L277.3 442.7c-25 25-65.5 25-90.5 0l-168-168C6.7 262.7 0 246.5 0 229.5zM144 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" /></svg>
              </span>
              <p className="text-gray-600 font-medium"><strong>Tags:</strong></p>
              {recipe.tags?.map(tag => (
                <Link key={tag} to={`/recipes?tag=${encodeURIComponent(tag)}`} className="transform transition-transform hover:scale-105">
                  <div className="bg-orange-200 px-2 py-0.5 shadow rounded-lg text-center hover:shadow-lg transition-shadow flex items-center justify-center">
                    <p className="text-black font-semibold">{tag}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sepia-light">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g className="nc-icon-wrapper" fill="currentColor" transform="translate(1.5999999999999996 1.5999999999999996) scale(0.8)"><path fill="currentColor" d="M15,2c0.6,0,1-0.4,1-1s-0.4-1-1-1H1C0.4,0,0,0.4,0,1s0.4,1,1,1h1c0.1,2.4,0.8,4.5,2,6c-1.2,1.4-2,3.6-2,6H1 c-0.6,0-1,0.4-1,1s0.4,1,1,1h14c0.6,0,1-0.4,1-1s-0.4-1-1-1h-1c-0.1-2.5-0.8-4.6-2-6c1.3-1.5,2-3.6,2-6H15z M9.9,7.3L9,8.1l1,0.7 c1.2,0.9,2,2.9,2.1,5.2H4c0.1-2.3,0.9-4.3,2.1-5.2l1-0.7L6.1,7.3C4.8,6.1,4.1,4.2,4,2h8C11.9,4.2,11.2,6.1,9.9,7.3z"></path></g></svg>
              </span>
              <p className="text-gray-600 font-medium"><strong>Total Time:</strong> {formatDuration(recipe.total_time)}</p>
            </div>
          </div>
        </div>

        {/* Recipe Image */}
        {recipe.image && (
          <div className="flex flex-col items-center justify-center w-full md:w-auto p-2">
            <div><img src={recipe.image} alt={recipe.title} className="w-[330px] h-[330px] object-cover rounded-md" /></div>
            <div>
              <section className="mt-2 text-center">
                <p className="text-gray-700">Author : {recipe.author}</p>
                <p className="text-gray-700">Source : {recipe.source || 'N/A'}</p>
              </section>
            </div>
          </div>
        )}
      </div>

      {/* Ingredients */}
      <div className="flex flex-col md:flex-row justify-between mb-10">
        <div className="bg-sepia-100 shadow-md rounded-lg p-4 md:p-6 relative w-full md:w-2/3 md:mr-10 mb-6 md:mb-0">
          <section className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Ingredients</h2>
              <div className="flex items-center justify-between space-x-4 mb-4">
                <button onClick={() => updateServings(-1)} className="bg-orange-200 hover:bg-orange-300 text-gray-800 font-bold py-1 px-3 rounded-full">-</button>
                <p id="servings" className="text-xl text-gray-800">{currentServings}</p>
                <button onClick={() => updateServings(1)} className="bg-orange-200 hover:bg-orange-300 text-gray-800 font-bold py-1 px-3 rounded-full">+</button>
              </div>
            </div>
          </section>

          <section>
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:gap-10 p-2 md:p-4">
                {categories.map(cat => (
                  <div key={cat} className="flex flex-col space-y-3">
                    {cat && <h3 className="text-lg italic font-bold text-gray-600 lg:text-left">{cat}</h3>}
                    <ul className="list-disc pl-6 space-y-2">
                      {categoriesMap[cat].map((ing, idx) => (
                        <li key={idx} className="text-gray-700">
                          <span className="ingredient-quantity">{getScaledQuantity(ing.quantity, recipe.servings)} </span>
                          {ing.unit} <span className="ingredient-name"> of {ing.ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="list-disc pl-6 space-y-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                  {recipe.ingredients?.map((ing, idx) => (
                    <li key={idx} className="text-gray-700">
                      <span className="ingredient-quantity">{getScaledQuantity(ing.quantity, recipe.servings)} </span>
                      {ing.unit} <span className="ingredient-name"> of {ing.ingredient}</span>
                    </li>
                  ))}
                </div>
              </ul>
            )}
          </section>
        </div>

        <div className="w-full md:w-1/3 flex flex-col items-center">
          {recipe.equipment && (
            <div className="bg-sepia-100 shadow-md rounded-lg p-4 md:p-6 w-full mb-6">
              <section className="mb-2">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Equipment</h2>
                <ul className="list-disc flex flex-wrap gap-6 pl-6">
                  {recipe.equipment.split('\n').filter(Boolean).map((eq, idx) => (
                    <li key={idx} className="text-gray-700">{eq}</li>
                  ))}
                </ul>
              </section>
            </div>
          )}

          <div className="bg-sepia-100 shadow-md rounded-lg p-4 md:p-6 w-full">
            <section className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">Nutritional Information</h2>
                <button onClick={() => setNutritionOpen(!nutritionOpen)} className="bg-orange-200 hover:bg-orange-300 text-gray-800 font-bold py-1 px-3 rounded-full flex items-center">
                  <span className={`transition-transform transform ${nutritionOpen ? 'rotate-180' : 'rotate-0'}`}>&#9660;</span>
                </button>
              </div>
              <h2 className="text-sm ml-6 text-gray-700">/ per serving</h2>
            </section>

            <div className={`${nutritionOpen ? '' : 'hidden'} space-y-3`}>
              {recipe.nutrition?.calories && (
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-700">Calories</span>
                  <span className="font-semibold text-gray-900">{recipe.nutrition.calories} kcal</span>
                </div>
              )}
              {recipe.nutrition?.carbohydrates && (
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-700">Carbohydrate</span>
                  <span className="font-semibold text-gray-900">{recipe.nutrition.carbohydrates} g</span>
                </div>
              )}
              {recipe.nutrition?.protein && (
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-700">Protein</span>
                  <span className="font-semibold text-gray-900">{recipe.nutrition.protein} g</span>
                </div>
              )}
              {recipe.nutrition?.fat && (
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-700">Fat</span>
                  <span className="font-semibold text-gray-900">{recipe.nutrition.fat} g</span>
                </div>
              )}
            </div>
            <p className="mt-4 text-sm text-gray-600">The nutritional values provided are generated using an algorithm and are approximate. They may vary depending on the specific ingredients you use and their unique characteristics.</p>
          </div>
        </div>
      </div>

      <div className="bg-sepia-100 shadow-md rounded-lg p-4 md:p-10 relative w-full mb-10">
        <section className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-left">Instructions</h2>
          <ol className="space-y-6 md:p-2">
            {instructionsLines.map((line, idx) => {
              if (line.startsWith('GroupName :')) {
                return (
                  <li key={idx} className="text-xl font-bold text-gray-900 bg-orange-100 md:p-4 rounded-lg text-center">
                    {line.replace('GroupName :', '').trim()}
                  </li>
                );
              } else {
                const stepNum = stepCounter++;
                return (
                  <li key={idx} className="flex flex-row items-start space-x-2 text-gray-700 p-2 rounded-lg">
                    <span className="bg-orange-300 text-gray-900 text-xl rounded-full font-bold w-10 h-10 flex-shrink-0 flex items-center justify-center m-2 md:m-4">
                      {stepNum}
                    </span>
                    <span className="w-11/12 text-left pt-3">{line}</span>
                  </li>
                );
              }
            })}
          </ol>
        </section>
      </div>

      {recipe.notes && (
        <div className="bg-sepia-100 shadow-md rounded-lg p-10 relative w-full">
          <section className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-left">Notes</h2>
            <ul className="list-disc pl-6 space-y-3 mb-2">
              <li className="text-gray-700 whitespace-pre-line">{recipe.notes}</li>
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
