import React from 'react';
import { usePrepWeek } from '../context/PrepWeekContext';
import WeekGrid from '../components/meal-planner/WeekGrid';
import ShoppingList from '../components/meal-planner/ShoppingList';
import RecipeDrawer from '../components/meal-planner/RecipeDrawer';
import AdvancedOptionsModal from '../components/meal-planner/AdvancedOptionsModal';
import CalorieCalculatorModal from '../components/meal-planner/CalorieCalculatorModal';
import UndoToast from '../components/meal-planner/UndoToast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWandMagicSparkles,
  faSlidersH,
  faRotateRight,
  faTrashAlt,
  faCalendarWeek,
  faShoppingCart,
  faUtensils,
  faUsers,
  faLeaf,
  faClock,
  faCookieBite,
  faPlus,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';

export default function PrepWeek() {
  const {
    hasPlan,
    generateWeek,
    clearWeek,
    viewLevel,
    setViewLevel,
    activeTab,
    setActiveTab,
    cookMode,
    setCookMode,
    cookSavings,
    people,
    setPeople,
    preferences,
    setPreferences,
    openAdvancedModal,
  } = usePrepWeek();

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5 text-[#2f1107]">
      
      {/* ─── CASE 1: INITIAL CLEAN STATE (BEFORE GENERATING) ─── */}
      {!hasPlan ? (
        <div className="max-w-md mx-auto my-6 bg-[#fffcf6] rounded-2xl border border-[#edd3b6] shadow-sm p-5 sm:p-6 animate-fade-in text-center">
          
          {/* Header */}
          <div className="mb-5">
            <span className="inline-block p-1.5 rounded-xl bg-[#fff5e4] border border-[#edd3b6] text-base mb-1.5">
              ✨
            </span>
            <h1 className="font-display text-xl text-[#2f1107] font-bold tracking-tight">
              Tu semana de comidas, sin pensar
            </h1>
            <p className="text-xs text-[#705c53] mt-1 max-w-xs mx-auto">
              Configura tus preferencias con un toque o genera tu menú directamente.
            </p>
          </div>

          {/* Unified Minimalist Controls */}
          <div className="space-y-3.5 mb-5 text-center">
            
            {/* 1. Comensales */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#705c53] mb-1.5 flex items-center justify-center gap-1">
                <FontAwesomeIcon icon={faUsers} className="text-[9px]" />
                ¿Para cuántas personas?
              </label>
              
              <div className="flex items-center justify-center">
                <div className="inline-flex items-center bg-[#fff5e4] p-1 rounded-xl border border-[#edd3b6]">
                  <button
                    type="button"
                    onClick={() => setPeople(Math.max(1, people - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-[#edd3b6] text-xs font-bold text-[#705c53] hover:bg-[#fae5c0] flex items-center justify-center cursor-pointer shadow-2xs transition-colors"
                    title="Quitar persona"
                  >
                    <FontAwesomeIcon icon={faMinus} className="text-[10px]" />
                  </button>
                  
                  <div className="px-4 text-center min-w-[100px] select-none">
                    <span className="text-base font-bold text-[#2f1107] font-mono">{people}</span>
                    <span className="text-xs text-[#705c53] ml-1.5 font-medium">
                      {people === 1 ? 'persona' : 'personas'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPeople(people + 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-[#edd3b6] text-xs font-bold text-[#705c53] hover:bg-[#fae5c0] flex items-center justify-center cursor-pointer shadow-2xs transition-colors"
                    title="Añadir persona"
                  >
                    <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Dieta */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#705c53] mb-1.5 flex items-center justify-center gap-1">
                <FontAwesomeIcon icon={faLeaf} className="text-[9px] text-[#2e7d32]" />
                Preferencia de dieta
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#fff5e4] p-1 rounded-xl border border-[#edd3b6]">
                {[
                  { id: 'none', label: 'Todo' },
                  { id: 'vegetarian', label: 'Vegetariano' },
                  { id: 'vegan', label: 'Vegano' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, dietary: opt.id })}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      (preferences.dietary || 'none') === opt.id
                        ? 'bg-[#705c53] text-[#fffcf6] shadow-xs'
                        : 'text-[#705c53] hover:text-[#2f1107]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. ¿Cuánto quieres cocinar? */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#705c53] mb-1.5 flex items-center justify-center gap-1">
                <FontAwesomeIcon icon={faUtensils} className="text-[9px]" />
                ¿Cuánto quieres cocinar?
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#fff5e4] p-1 rounded-xl border border-[#edd3b6]">
                {[
                  { id: 'daily', label: 'A diario' },
                  { id: 'batch2', label: '1 día + táper' },
                  { id: 'min', label: 'Lotes (3 días)' },
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setCookMode(m.id)}
                    className={`py-1.5 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer truncate ${
                      cookMode === m.id
                        ? 'bg-[#705c53] text-[#fffcf6] shadow-xs'
                        : 'text-[#705c53] hover:text-[#2f1107]'
                    }`}
                    title={m.id === 'daily' ? 'Cocinar cada día' : m.id === 'batch2' ? '1 día cocinas, 1 de táper' : 'Lotes grandes para 3 días'}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Filtros rápidos inline */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPreferences({ ...preferences, includeSnacks: !preferences.includeSnacks })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-all flex items-center gap-1.5 ${
                  preferences.includeSnacks
                    ? 'bg-[#705c53] text-[#fffcf6] border-[#705c53] shadow-xs'
                    : 'bg-[#fff5e4] text-[#705c53] border-[#edd3b6] hover:bg-[#fae5c0]'
                }`}
              >
                <FontAwesomeIcon icon={faCookieBite} className="text-[10px]" />
                <span>Snacks</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const next = preferences.style === 'quick' ? 'all' : 'quick';
                  setPreferences({ ...preferences, style: next });
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-all flex items-center gap-1.5 ${
                  preferences.style === 'quick'
                    ? 'bg-[#705c53] text-[#fffcf6] border-[#705c53] shadow-xs'
                    : 'bg-[#fff5e4] text-[#705c53] border-[#edd3b6] hover:bg-[#fae5c0]'
                }`}
              >
                <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                <span>Rápidas (&lt;25m)</span>
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => generateWeek()}
            className="w-full py-2.5 bg-[#705c53] text-[#fffcf6] rounded-xl font-bold text-xs shadow-xs hover:bg-[#2f1107] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            <span>Generar mi semana</span>
          </button>
        </div>
      ) : (
        /* ─── CASE 2: ACTIVE PLAN STATE (COMPACT TOP BAR) ─── */
        <div className="space-y-4">
          
          {/* Top Control Bar: Perfectly Balanced (Left, Center, Right) */}
          <div className="bg-[#fffcf6] px-4 py-2.5 rounded-2xl border border-[#edd3b6] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Left: Tab Switcher (Planificador vs Lista de la Compra) */}
            <div className="flex items-center justify-start w-full md:w-1/3">
              <div className="flex items-center bg-[#fff5e4] p-1 rounded-full border border-[#edd3b6]">
                <button
                  onClick={() => setActiveTab('plan')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'plan'
                      ? 'bg-[#705c53] text-[#fffcf6] shadow-xs'
                      : 'text-[#705c53] hover:text-[#2f1107]'
                  }`}
                >
                  <FontAwesomeIcon icon={faCalendarWeek} />
                  <span>Planificador</span>
                </button>
                <button
                  onClick={() => setActiveTab('shop')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'shop'
                      ? 'bg-[#705c53] text-[#fffcf6] shadow-xs'
                      : 'text-[#705c53] hover:text-[#2f1107]'
                  }`}
                >
                  <FontAwesomeIcon icon={faShoppingCart} />
                  <span>Lista de la compra</span>
                </button>
              </div>
            </div>

            {/* Center: Simple vs Nutri Toggle (Dead Center) */}
            <div className="flex items-center justify-center w-full md:w-1/3">
              <div className="flex items-center bg-[#fff5e4] p-1 rounded-full border border-[#edd3b6] text-xs">
                <button
                  onClick={() => setViewLevel('simple')}
                  className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                    viewLevel === 'simple'
                      ? 'bg-[#705c53] text-[#fffcf6] shadow-xs'
                      : 'text-[#705c53] hover:text-[#2f1107]'
                  }`}
                  title="Ver solo recetas e ingredientes"
                >
                  Simple
                </button>
                <button
                  onClick={() => setViewLevel('nutri')}
                  className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                    viewLevel === 'nutri'
                      ? 'bg-[#705c53] text-[#fffcf6] shadow-xs'
                      : 'text-[#705c53] hover:text-[#2f1107]'
                  }`}
                  title="Ver calorías y macros reales por plato"
                >
                  Nutrición
                </button>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center justify-end w-full md:w-1/3 gap-2">
              <button
                onClick={() => generateWeek()}
                className="px-3.5 py-1.5 bg-[#fff5e4] text-[#2f1107] border border-[#edd3b6] rounded-full text-xs font-bold hover:bg-[#fae5c0] transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Regenerar semana manteniendo los anclados 📌"
              >
                <FontAwesomeIcon icon={faRotateRight} />
                <span>Regenerar</span>
              </button>

              <button
                onClick={openAdvancedModal}
                className="px-3.5 py-1.5 bg-[#fff5e4] text-[#705c53] border border-[#edd3b6] rounded-full text-xs font-bold hover:bg-[#fae5c0] transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Ajustar opciones avanzadas y calorías"
              >
                <FontAwesomeIcon icon={faSlidersH} />
                <span>Opciones</span>
              </button>

              <button
                onClick={clearWeek}
                className="p-1.5 text-[#705c53] hover:text-[#6d2323] transition-colors text-xs cursor-pointer ml-1"
                title="Vaciar semana"
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          </div>

          {/* Sub-bar informative note: Savings (Clearly informational, not a button) */}
          {cookSavings > 0 && activeTab === 'plan' && (
            <div className="flex items-center justify-end px-2 -mt-2 text-xs text-[#705c53]">
              <div className="flex items-center gap-1.5 font-medium">
                <FontAwesomeIcon icon={faUtensils} className="text-[#a89083] text-[10px]" />
                <span>Esta semana ahorras <strong className="text-[#2f1107] font-bold">{cookSavings} cocinados</strong> reutilizando platos en táper</span>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          {activeTab === 'plan' ? (
            <WeekGrid />
          ) : (
            <ShoppingList />
          )}
        </div>
      )}

      {/* Drawers & Modals */}
      <RecipeDrawer />
      <AdvancedOptionsModal />
      <CalorieCalculatorModal />
      <UndoToast />
    </div>
  );
}
