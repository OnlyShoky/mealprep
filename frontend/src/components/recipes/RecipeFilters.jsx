import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function RecipeFilters({ metadata }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCuisine = searchParams.get('cuisine');
  const activeCourse = searchParams.get('course');
  const activeTag = searchParams.get('tag');

  const handleFilterChange = (type, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(type, value);
    } else {
      newParams.delete(type);
    }
    // Reset page to 1 on filter change
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('cuisine');
    newParams.delete('course');
    newParams.delete('tag');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const hasActiveFilters = activeCuisine || activeCourse || activeTag;

  return (
    <div className="bg-sepia-200 p-6 rounded-2xl shadow-inner mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-normal">Filters</h3>
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="text-sm font-semibold text-sepia-warn hover:text-red-700 flex items-center"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-1" /> Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-sepia-800 mb-2">Cuisine</label>
          <select 
            value={activeCuisine || ''}
            onChange={(e) => handleFilterChange('cuisine', e.target.value)}
            className="w-full bg-white border border-sepia-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sepia-warn"
          >
            <option value="">All Cuisines</option>
            {metadata?.cuisines.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-sepia-800 mb-2">Course</label>
          <select 
            value={activeCourse || ''}
            onChange={(e) => handleFilterChange('course', e.target.value)}
            className="w-full bg-white border border-sepia-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sepia-warn"
          >
            <option value="">All Courses</option>
            {metadata?.courses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-sepia-800 mb-2">Tag</label>
          <select 
            value={activeTag || ''}
            onChange={(e) => handleFilterChange('tag', e.target.value)}
            className="w-full bg-white border border-sepia-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sepia-warn"
          >
            <option value="">All Tags</option>
            {metadata?.tags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
