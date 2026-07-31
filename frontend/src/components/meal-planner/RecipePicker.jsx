import React, { useState, useMemo } from 'react';
import { usePrepWeek } from '../../context/PrepWeekContext';
import Modal from '../ui/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function RecipePicker({ isOpen, onClose, onSelect, slotType }) {
  const { recipes } = usePrepWeek();
  const [searchTerm, setSearchTerm] = useState('');
  
  const category = slotType === 'breakfast' ? 'breakfast' : slotType === 'snack' ? 'snack' : 'main';

  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      if (r.category !== category) return false;
      if (searchTerm) {
        return r.title.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    });
  }, [recipes, category, searchTerm]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Select a recipe for ${slotType}`}>
      <div className="flex flex-col h-[70vh]">
        
        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-sepia-300 rounded-full py-2 pl-10 pr-4 text-sepia-800 focus:outline-none focus:ring-2 focus:ring-sepia-400"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-3 text-sepia-400" />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-2.5 text-sepia-400 hover:text-sepia-800"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto pr-2">
          {filteredRecipes.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">No recipes found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredRecipes.map(recipe => (
                <button
                  key={recipe.id}
                  onClick={() => {
                    onSelect(recipe.id);
                    onClose();
                  }}
                  className="flex flex-col text-left bg-orange-50 rounded-xl overflow-hidden border border-sepia-200 hover:border-sepia-400 hover:shadow-md transition-all group"
                >
                  <div className="h-32 bg-sepia-200 w-full overflow-hidden">
                    {recipe.image_card ? (
                      <img src={recipe.image_card} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sepia-400 font-display">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-normal line-clamp-1">{recipe.title}</h3>
                    <div className="text-xs text-gray-500 mt-1">
                      {recipe.nutrition_per_serving?.calories ?? '--'} kcal • {recipe.nutrition_per_serving?.protein ?? '--'}g P
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
