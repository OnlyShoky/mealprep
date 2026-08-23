import React, { useState, useMemo } from 'react';
import { usePrepWeek } from '../../context/PrepWeekContext';
import Modal from '../ui/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faUtensils, faClock, faFire } from '@fortawesome/free-solid-svg-icons';

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
      <div className="flex flex-col max-h-[65vh]">
        
        {/* Search Input */}
        <div className="relative mb-5">
          <input
            type="text"
            placeholder="Search by recipe title..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-sepia-400 rounded-xl py-2.5 pl-10 pr-10 text-[#2f1107] font-semibold text-sm focus:border-[#705C53] focus:outline-none shadow-2xs placeholder-sepia-700/60"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-3.5 text-[#705C53]" />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-3 text-[#705C53] hover:text-[#2f1107] font-bold cursor-pointer"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>

        {/* Recipe Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          {filteredRecipes.length === 0 ? (
            <div className="text-center text-[#705C53] py-12 bg-white rounded-xl border border-dashed border-sepia-300">
              <FontAwesomeIcon icon={faUtensils} className="text-3xl text-sepia-500 mb-2" />
              <div className="font-bold text-[#2f1107] text-base">No recipes found</div>
              <div className="text-xs text-[#705C53] mt-1 font-medium">Try searching with a different term</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredRecipes.map(recipe => (
                <button
                  key={recipe.id}
                  onClick={() => {
                    onSelect(recipe.id);
                    onClose();
                  }}
                  className="flex flex-col text-left bg-white rounded-xl overflow-hidden border border-sepia-300 hover:border-sepia-800 hover:shadow-md transition-all duration-200 group cursor-pointer"
                >
                  <div className="h-36 bg-[#fff5e4] w-full overflow-hidden relative">
                    {recipe.image_card ? (
                      <img 
                        src={recipe.image_card} 
                        alt={recipe.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#705C53] font-bold">
                        No Image Available
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-[#2f1107]/90 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-xs backdrop-blur-2xs flex items-center gap-1">
                      <FontAwesomeIcon icon={faFire} className="text-orange-400" size="xs" />
                      {recipe.nutrition_per_serving?.calories ?? '--'} kcal
                    </div>
                  </div>

                  <div className="p-3.5 flex flex-col justify-between flex-1 bg-white">
                    <div>
                      <h3 className="font-bold text-[#2f1107] text-sm line-clamp-1 group-hover:text-orange-800 transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="text-xs text-[#705C53] mt-1 line-clamp-2 leading-relaxed font-medium">
                        {recipe.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-sepia-200 text-xs font-semibold text-[#2f1107]">
                      <span className="text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 font-bold">
                        {recipe.nutrition_per_serving?.protein ?? '--'}g Protein
                      </span>
                      <span className="text-[#705C53] font-medium flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} size="xs" />
                        {recipe.total_time ? recipe.total_time.replace(/^00:/, '').replace(/:00$/, 'm') : '15m'}
                      </span>
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
