import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import Search from './pages/Search';
import PreepWeek from './pages/PreepWeek';
import Favorites from './pages/Favorites';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'recipes', element: <RecipeList /> },
      { path: 'recipes/:id', element: <RecipeDetail /> },
      { path: 'search', element: <Search /> },
      { path: 'preepweek', element: <PreepWeek /> },
      { path: 'favorites', element: <Favorites /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'faq', element: <FAQ /> },
      { path: '*', element: <div className="text-center py-20 text-2xl font-bold text-normal">Page not found</div> },
    ],
  },
]);

function App() {
  return (
    <FavoritesProvider>
      <RouterProvider router={router} />
    </FavoritesProvider>
  );
}

export default App;
