import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-12 gap-2">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-full bg-sepia-200 flex items-center justify-center text-sepia-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sepia-300 transition-colors shadow-button-flat-nopressed active:shadow-button-flat-pressed"
        title="Previous Page"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      <span className="px-4 py-2 text-normal font-semibold">
        Page {currentPage} of {totalPages}
      </span>

      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-full bg-sepia-200 flex items-center justify-center text-sepia-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sepia-300 transition-colors shadow-button-flat-nopressed active:shadow-button-flat-pressed"
        title="Next Page"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}
