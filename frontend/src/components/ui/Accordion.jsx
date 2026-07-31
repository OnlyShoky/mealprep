import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

export default function Accordion({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4 bg-sepia-100 rounded-lg shadow-box-up overflow-hidden">
      <button 
        className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-sepia-200 transition-colors focus:outline-none focus:ring-2 focus:ring-sepia-warn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-bold text-normal text-lg">{title}</span>
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="text-sepia-800" />
      </button>
      
      {isOpen && (
        <div className="px-6 py-4 border-t border-sepia-200">
          {children}
        </div>
      )}
    </div>
  );
}
