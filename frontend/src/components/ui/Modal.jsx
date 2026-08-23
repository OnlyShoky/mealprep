import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Darkened Backdrop with Soft Blur */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Warm Sepia Solid Opaque Modal Container */}
      <div className="relative bg-[#fffcf6] text-[#2f1107] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col z-10 border-2 border-sepia-600/40 overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-[#fff5e4] border-b border-sepia-300">
          <h2 className="text-xl font-bold text-[#2f1107] capitalize tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-sepia-300 flex items-center justify-center text-[#705C53] hover:bg-[#feeed2] hover:text-[#2f1107] transition-colors shadow-2xs cursor-pointer font-bold"
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        {/* Body Content */}
        <div className="p-6 overflow-y-auto bg-[#fffcf6]">
          {children}
        </div>

      </div>
    </div>
  );
}
