import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import Search from './pages/Search';
import PrepWeek from './pages/PrepWeek';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';

import { PrepWeekProvider } from './context/PrepWeekContext';
import { getAllRecipes } from './services/recipeRepository';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'recipes', element: <RecipeList /> },
      { path: 'recipes/:id', element: <RecipeDetail /> },
      { path: 'search', element: <Search /> },
      { path: 'prepweek', element: <PrepWeek /> },
      { path: 'profile', element: <Profile /> },
      { path: 'favorites', element: <Favorites /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'faq', element: <FAQ /> },
      { path: '*', element: <div className="text-center py-20 text-2xl font-bold text-normal">Page not found</div> },
    ],
  },
]);

function App() {
  const [recipes, setRecipes] = React.useState([]);

  React.useEffect(() => {
    // In a real app, you might only load recipes when entering the planner,
    // but doing it once globally is fine for our setup.
    getAllRecipes().then(setRecipes).catch(console.error);
  }, []);

  return (
    <FavoritesProvider>
      <PrepWeekProvider recipes={recipes}>
        <RouterProvider router={router} />
      </PrepWeekProvider>
    </FavoritesProvider>
  );
}

export default App;
