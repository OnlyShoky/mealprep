import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getRandomRecipes, getRecipes } from '../services/recipeRepository';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function PreepWeek() {
  const [recipes, setRecipes] = useState([]);
  const [latestRecipes, setLatestRecipes] = useState([]);
  const [mealSlots, setMealSlots] = useState({});
  const [grocerySidebarOpen, setGrocerySidebarOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [random, latest] = await Promise.all([
          getRandomRecipes(21),
          getRecipes()
        ]);
        if (random) setRecipes(random);
        if (latest && latest.recipes) setLatestRecipes(latest.recipes);

        // Initialise slots: Monday breakfast gets first recipe, rest are empty
        const slots = {};
        let idx = 0;
        DAYS.forEach(day => {
          ['breakfast', 'lunch', 'dinner'].forEach(meal => {
            slots[`${day}-${meal}`] = random && random[idx] ? random[idx] : null;
            idx++;
          });
        });
        setMealSlots(slots);
      } catch (err) {
        console.error('Failed to load preepweek data', err);
      }
    }
    loadData();
  }, []);

  const generateWeeklyMeals = async () => {
    try {
      const random = await getRandomRecipes(21);
      if (!random) return;
      const slots = {};
      let idx = 0;
      DAYS.forEach(day => {
        ['breakfast', 'lunch', 'dinner'].forEach(meal => {
          slots[`${day}-${meal}`] = random[idx] || null;
          idx++;
        });
      });
      setMealSlots(slots);
    } catch (err) {
      console.error('Failed to generate meals', err);
    }
  };

  return (
    <>
      <div className="planner-container">
        {/* Header */}
        <div className="planner-header">
          <h1 className="text-3xl font-bold">Weekly Meal Planner</h1>
          <div>
            <button className="btn">💾 Save Plan</button>
            <button className="btn secondary">🧍 Set Profile</button>
          </div>
        </div>

        {/* Prep Options */}
        <div className="prep-options">
          <div className="prep-option active">🔁 Cook each day</div>
          <div className="prep-option">📦 Prep for 2 days</div>
          <div className="prep-option">🧊 Prep for whole week</div>
          <button className="btn secondary" style={{marginLeft: 'auto'}}>🕐 Show Prep Days</button>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn secondary">⚙ Preferences</button>
          <button className="btn" onClick={() => setGrocerySidebarOpen(true)}>🧾 Generate Grocery List</button>
          <button className="btn" id="generate-weekly-meals" onClick={generateWeeklyMeals}>🎲 Generate Weekly Meals</button>
          <button className="btn secondary">⏱ Copy to Next Day</button>
          <button className="btn secondary">🧹 Clear All</button>
          <button className="btn secondary">🖨 Print / PDF</button>
        </div>

        {/* Calendar Grid */}
        <div className="calendar">
          {/* Day headers */}
          <div className="day-header">Monday</div>
          <div className="day-header">Tuesday</div>
          <div className="day-header">Wednesday</div>
          <div className="day-header">Thursday</div>
          <div className="day-header">Friday</div>
          <div className="day-header">Saturday</div>
          <div className="day-header">Sunday</div>

          {/* Breakfast slots */}
          {DAYS.map((day, i) => {
            const recipe = mealSlots[`${day}-breakfast`];
            return recipe ? (
              <div key={`${day}-breakfast`} className="meal-slot" data-day={day} data-meal-type="breakfast">
                <div className="meal-time">Breakfast</div>
                <Link to={`/recipes/${recipe.id}`} className="transform transition-transform hover:scale-105">
                  <div className="meal-content">{recipe.title}</div>
                </Link>
                <button className="add-meal">✏️ Edit</button>
              </div>
            ) : (
              <div key={`${day}-breakfast`} className="meal-slot empty" data-day={day} data-meal-type="breakfast">
                <button className="add-meal">+ Add Meal</button>
              </div>
            );
          })}

          {/* Lunch slots */}
          {DAYS.map((day, i) => {
            const recipe = mealSlots[`${day}-lunch`];
            return recipe ? (
              <div key={`${day}-lunch`} className="meal-slot" data-day={day} data-meal-type="lunch">
                <div className="meal-time">Lunch</div>
                <div className="meal-content">{recipe.title}</div>
                <button className="add-meal">✏️ Edit</button>
              </div>
            ) : (
              <div key={`${day}-lunch`} className="meal-slot empty" data-day={day} data-meal-type="lunch">
                <button className="add-meal">+ Add Meal</button>
              </div>
            );
          })}

          {/* Dinner slots */}
          {DAYS.map((day, i) => {
            const recipe = mealSlots[`${day}-dinner`];
            return recipe ? (
              <div key={`${day}-dinner`} className="meal-slot" data-day={day} data-meal-type="dinner">
                <div className="meal-time">Dinner</div>
                <div className="meal-content">{recipe.title}</div>
                <button className="add-meal">✏️ Edit</button>
              </div>
            ) : (
              <div key={`${day}-dinner`} className="meal-slot empty" data-day={day} data-meal-type="dinner">
                <button className="add-meal">+ Add Meal</button>
              </div>
            );
          })}

          {/* Nutrient Summary Slots */}
          <div className="meal-slot nutrient-summary">
            <div className="nutrient-day">
              <div className="nutrient-item">Calories: 1850kcal</div>
              <div className="nutrient-bar"><div className="nutrient-progress nutrient-optimal" style={{width: '92%'}}></div></div>
            </div>
          </div>
          <div className="meal-slot nutrient-summary">
            <div className="nutrient-day">
              <div className="nutrient-item">Calories: 1720kcal</div>
              <div className="nutrient-bar"><div className="nutrient-progress nutrient-optimal" style={{width: '86%'}}></div></div>
            </div>
          </div>
          <div className="meal-slot nutrient-summary">
            <div className="nutrient-day">
              <div className="nutrient-item">Calories: 1850kcal</div>
              <div className="nutrient-bar"><div className="nutrient-progress nutrient-optimal" style={{width: '92%'}}></div></div>
            </div>
          </div>
          <div className="meal-slot nutrient-summary">
            <div className="nutrient-day">
              <div className="nutrient-item">Calories: 1720kcal</div>
              <div className="nutrient-bar"><div className="nutrient-progress nutrient-optimal" style={{width: '86%'}}></div></div>
            </div>
          </div>
          <div className="meal-slot nutrient-summary">
            <div className="nutrient-day">
              <div className="nutrient-item">Calories: 1850kcal</div>
              <div className="nutrient-bar"><div className="nutrient-progress nutrient-optimal" style={{width: '92%'}}></div></div>
            </div>
          </div>
          <div className="meal-slot nutrient-summary">
            <div className="nutrient-day">
              <div className="nutrient-item">Calories: 1720kcal</div>
              <div className="nutrient-bar"><div className="nutrient-progress nutrient-optimal" style={{width: '86%'}}></div></div>
            </div>
          </div>
          <div className="meal-slot nutrient-summary">
            <div className="nutrient-day">
              <div className="nutrient-item">Calories: 1720kcal</div>
              <div className="nutrient-bar"><div className="nutrient-progress nutrient-optimal" style={{width: '86%'}}></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Grocery List Sidebar */}
      <div className="grocery-sidebar" style={{display: grocerySidebarOpen ? 'block' : 'none'}} id="grocery-sidebar">
        <span className="close-modal" onClick={() => setGrocerySidebarOpen(false)}>×</span>
        <h2>Grocery List</h2>

        <div className="grocery-category">
          <h3>Produce</h3>
          <div className="grocery-item"><span>Tomatoes</span><span>4</span></div>
          <div className="grocery-item"><span>Lettuce</span><span>1 head</span></div>
          <div className="grocery-item"><span>Bell peppers</span><span>3</span></div>
        </div>

        <div className="grocery-category">
          <h3>Meat &amp; Fish</h3>
          <div className="grocery-item"><span>Chicken breast</span><span>2 lbs</span></div>
          <div className="grocery-item"><span>Ground beef</span><span>1 lb</span></div>
          <div className="grocery-item"><span>Salmon fillet</span><span>1 lb</span></div>
        </div>

        <div className="grocery-category">
          <h3>Dairy</h3>
          <div className="grocery-item"><span>Eggs</span><span>12</span></div>
          <div className="grocery-item"><span>Milk</span><span>1 gal</span></div>
          <div className="grocery-item"><span>Cheese</span><span>8 oz</span></div>
        </div>

        <button className="btn" style={{width: '100%', marginTop: '15px'}}>Print List</button>
      </div>

      {/* Latest Recipes Section */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Latest Recipes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestRecipes.map(recipe => (
              <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="transform transition-transform hover:scale-105">
                <div className="bg-orange-50 shadow-lg rounded-lg overflow-hidden flex flex-col h-full">
                  {recipe.image ? (
                    <img src={recipe.image} alt={recipe.title} className="w-full h-32 sm:h-36 lg:h-40 object-cover" />
                  ) : (
                    <div className="h-32 sm:h-36 lg:h-40 bg-gray-300 flex items-center justify-center">
                      <p className="text-gray-500">No Image Available</p>
                    </div>
                  )}
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
    </>
  );
}
