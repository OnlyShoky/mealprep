import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function ServingAdjuster({ currentServings, originalServings, onAdjust }) {
  return (
    <div className="flex items-center gap-4 bg-sepia-200 p-3 rounded-lg shadow-inner w-fit">
      <span className="text-sm font-bold text-normal">Servings:</span>
      <div className="flex items-center gap-3">
        <button 
          onClick={() => onAdjust(Math.max(1, currentServings - 1))}
          className="w-8 h-8 rounded-full bg-sepia-100 flex items-center justify-center text-sepia-800 hover:bg-sepia-300 transition-colors shadow-button-flat-nopressed active:shadow-button-flat-pressed"
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
        <span className="font-bold w-6 text-center text-lg">{currentServings}</span>
        <button 
          onClick={() => onAdjust(currentServings + 1)}
          className="w-8 h-8 rounded-full bg-sepia-100 flex items-center justify-center text-sepia-800 hover:bg-sepia-300 transition-colors shadow-button-flat-nopressed active:shadow-button-flat-pressed"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      {currentServings !== originalServings && (
        <button 
          onClick={() => onAdjust(originalServings)}
          className="text-xs text-sepia-warn hover:underline ml-2"
        >
          Reset
        </button>
      )}
    </div>
  );
}
