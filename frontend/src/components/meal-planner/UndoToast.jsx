import React, { useEffect } from 'react';
import { usePrepWeek } from '../../context/PrepWeekContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function UndoToast() {
  const { toast, closeToast, undo } = usePrepWeek();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      closeToast();
    }, 6000);
    return () => clearTimeout(timer);
  }, [toast, closeToast]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#2f1107] text-[#fffcf6] px-5 py-3 rounded-full shadow-2xl border border-[#705c53]/40 text-sm animate-bounce-in">
      <span className="font-medium">{toast.message}</span>
      {toast.canUndo && (
        <button
          onClick={() => {
            undo();
            closeToast();
          }}
          className="inline-flex items-center gap-1.5 bg-[#feeed2] text-[#2f1107] font-bold px-3 py-1 rounded-full text-xs hover:bg-[#fff5e4] transition-colors cursor-pointer"
        >
          <FontAwesomeIcon icon={faRotateLeft} className="text-xs" />
          Deshacer
        </button>
      )}
      <button
        onClick={closeToast}
        className="text-[#edd3b6] hover:text-white transition-colors ml-1 cursor-pointer"
        title="Cerrar"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
}
