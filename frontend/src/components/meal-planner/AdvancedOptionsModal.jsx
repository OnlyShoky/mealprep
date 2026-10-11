import React, { useState } from 'react';
import { usePrepWeek } from '../../context/PrepWeekContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUtensils, faClock, faLeaf, faCoins, faCookieBite, faCalculator, faCheck } from '@fortawesome/free-solid-svg-icons';

export default function AdvancedOptionsModal() {
  const {
    isAdvancedModalOpen,
    closeAdvancedModal,
    preferences,
    setPreferences,
    cookMode,
    setCookMode,
    generateWeek,
    openCalculatorModal,
    dailyTargets,
  } = usePrepWeek();

  const [dietary, setDietary] = useState(preferences.dietary || 'none');
  const [style, setStyle] = useState(preferences.style || 'all');
  const [cm, setCm] = useState(cookMode || 'daily');
  const [includeSnacks, setIncludeSnacks] = useState(preferences.includeSnacks || false);

  if (!isAdvancedModalOpen) return null;

  const handleApply = (regenerate = false) => {
    const updated = { dietary, style, includeSnacks };
    setPreferences(updated);
    setCookMode(cm);
    if (regenerate) {
      generateWeek({ dietary, style, cookMode: cm, includeSnacks });
    }
    closeAdvancedModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#fffcf6] w-full max-w-lg rounded-2xl shadow-2xl border border-[#edd3b6] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#edd3b6] flex items-center justify-between bg-[#fff5e4]">
          <div>
            <h2 className="font-display text-2xl text-[#2f1107]">Opciones avanzadas</h2>
            <p className="text-xs text-[#705c53]">Personaliza tu semana a tu medida. Solo lo que necesites.</p>
          </div>
          <button
            onClick={closeAdvancedModal}
            className="w-8 h-8 rounded-full bg-[#fae5c0] text-[#705c53] hover:text-[#2f1107] flex items-center justify-center cursor-pointer transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#2f1107]">
          
          {/* 1. Dieta */}
          <div>
            <label className="text-xs font-bold text-[#705c53] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faLeaf} className="text-[#2e7d32]" />
              Tipo de dieta
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'none', label: 'Todo', desc: 'Sin restricciones' },
                { id: 'vegetarian', label: 'Vegetariano', desc: 'Sin carne ni pescado' },
                { id: 'vegan', label: 'Vegano', desc: '100% vegetal' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDietary(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    dietary === opt.id
                      ? 'border-[#705c53] bg-[#fff5e4] shadow-xs'
                      : 'border-[#edd3b6] bg-white hover:bg-[#fffcf6]'
                  }`}
                >
                  <div className="font-bold text-xs text-[#2f1107]">{opt.label}</div>
                  <div className="text-[10px] text-[#705c53] mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Preferencia de recetas */}
          <div>
            <label className="text-xs font-bold text-[#705c53] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faClock} className="text-[#705c53]" />
              Filtro de recetas
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'Cualquiera', desc: 'Todo el catálogo' },
                { id: 'quick', label: 'Rápidas', desc: '< 25 minutos' },
                { id: 'budget', label: 'Económicas', desc: 'Ingredientes básicos' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStyle(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    style === opt.id
                      ? 'border-[#705c53] bg-[#fff5e4] shadow-xs'
                      : 'border-[#edd3b6] bg-white hover:bg-[#fffcf6]'
                  }`}
                >
                  <div className="font-bold text-xs text-[#2f1107]">{opt.label}</div>
                  <div className="text-[10px] text-[#705c53] mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. ¿Cómo quieres cocinar? */}
          <div>
            <label className="text-xs font-bold text-[#705c53] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faUtensils} className="text-[#705c53]" />
              ¿Cuánto quieres cocinar?
            </label>
            <div className="space-y-2">
              {[
                { id: 'daily', title: 'Cocinar cada día (por defecto)', desc: 'Una receta nueva para cada comida y cena. Más variedad.' },
                { id: 'batch2', title: 'Un poco de todo (Cocinar 1 día y repetir al siguiente)', desc: 'Cocinas lunes, miércoles y viernes. Los martes y jueves comes tapers ya listos.' },
                { id: 'min', title: 'Lo mínimo (Grandes tandas)', desc: 'Cocinas solo 2 veces por semana y comes lo mismo 3 días seguidos. Ahorro de tiempo máximo.' },
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setCm(m.id)}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    cm === m.id
                      ? 'border-[#705c53] bg-[#fff5e4] shadow-xs'
                      : 'border-[#edd3b6] bg-white hover:bg-[#fffcf6]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    cm === m.id ? 'border-[#705c53] bg-[#705c53]' : 'border-[#edd3b6]'
                  }`}>
                    {cm === m.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#2f1107]">{m.title}</div>
                    <div className="text-[11px] text-[#705c53] mt-0.5">{m.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Tentempiés */}
          <div className="flex items-center justify-between p-3.5 bg-[#fff5e4] rounded-xl border border-[#edd3b6]">
            <div className="flex items-center gap-2.5">
              <FontAwesomeIcon icon={faCookieBite} className="text-[#705c53]" />
              <div>
                <div className="text-xs font-bold text-[#2f1107]">Añadir tentempiés diarios</div>
                <div className="text-[11px] text-[#705c53]">Incluye un snack saludable cada día</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIncludeSnacks(!includeSnacks)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                includeSnacks ? 'bg-[#705c53]' : 'bg-[#edd3b6]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  includeSnacks ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* 5. Objetivo Calórico / Nutrición */}
          <div className="p-3.5 bg-[#feeed2]/60 rounded-xl border border-[#edd3b6] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#2f1107] flex items-center gap-1.5">
                <FontAwesomeIcon icon={faCalculator} className="text-[#705c53]" />
                Objetivo calórico
              </div>
              <div className="text-[11px] text-[#705c53] mt-0.5">
                {dailyTargets ? `${dailyTargets.calories} kcal/día configuradas` : 'Calcula tus calorías si tienes una meta'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                closeAdvancedModal();
                openCalculatorModal();
              }}
              className="text-xs font-bold text-[#705c53] hover:text-[#2f1107] underline cursor-pointer"
            >
              {dailyTargets ? 'Modificar' : 'Calcular'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#fff5e4] border-t border-[#edd3b6] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={closeAdvancedModal}
            className="px-4 py-2 border border-[#edd3b6] text-[#705c53] rounded-full text-xs font-semibold hover:bg-white transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => handleApply(false)}
            className="px-4 py-2 bg-[#edd3b6] text-[#2f1107] rounded-full text-xs font-bold hover:bg-[#dbc0a1] transition-colors cursor-pointer"
          >
            Guardar ajustes
          </button>
          <button
            type="button"
            onClick={() => handleApply(true)}
            className="px-5 py-2 bg-[#705c53] text-[#fffcf6] rounded-full text-xs font-bold hover:bg-[#2f1107] transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <FontAwesomeIcon icon={faCheck} />
            Aplicar y regenerar
          </button>
        </div>
      </div>
    </div>
  );
}
