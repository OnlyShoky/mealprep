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
  faInfoCircle,
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
    cookSavings,
    openAdvancedModal,
  } = usePrepWeek();

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-[#2f1107]">
      
      {/* ─── CASE 1: INITIAL CLEAN STATE (NO PLAN YET) ─── */}
      {!hasPlan ? (
        <div className="max-w-xl mx-auto my-12 text-center bg-[#fffcf6] p-8 sm:p-12 rounded-3xl border border-[#edd3b6] shadow-sm animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#fff5e4] border border-[#edd3b6] flex items-center justify-center mx-auto mb-6 text-2xl text-[#705c53]">
            ✨
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-[#2f1107] mb-3 leading-tight">
            Tu semana de comidas, sin pensar
          </h1>
          <p className="text-sm text-[#705c53] mb-8 leading-relaxed">
            Obtén en 1 segundo las recetas saludables de toda tu semana, adaptadas a tu ritmo, y tu lista de la compra lista para el supermercado.
          </p>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => generateWeek()}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#705c53] text-[#fffcf6] rounded-full font-bold text-base shadow-md hover:bg-[#2f1107] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <FontAwesomeIcon icon={faWandMagicSparkles} />
              Generar mi semana
            </button>

            <button
              onClick={openAdvancedModal}
              className="text-xs text-[#705c53] hover:text-[#2f1107] underline transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <FontAwesomeIcon icon={faSlidersH} className="text-[11px]" />
              Opciones avanzadas (dieta, estilo de cocina, calorías...)
            </button>
          </div>
        </div>
      ) : (
        /* ─── CASE 2: ACTIVE PLAN STATE (COMPACT CONTROL BAR) ─── */
        <div className="space-y-6">
          
          {/* Top Control Bar */}
          <div className="bg-[#fffcf6] p-3 sm:p-4 rounded-2xl border border-[#edd3b6] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Left: Tab Switcher (Planificador vs Lista de la Compra) */}
            <div className="flex items-center bg-[#fff5e4] p-1 rounded-full border border-[#edd3b6] w-full sm:w-auto justify-center">
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

            {/* Center: Savings Badge & View Toggle (Simple vs Nutri) */}
            <div className="flex items-center gap-3">
              {cookSavings > 0 && (
                <span className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold text-[#705c53] bg-[#fff5e4] px-3 py-1 rounded-full border border-[#edd3b6]">
                  <FontAwesomeIcon icon={faUtensils} className="text-[10px]" />
                  Ahorras {cookSavings} cocinados
                </span>
              )}

              {/* Simple vs Nutri Toggle */}
              <div className="flex items-center bg-[#fff5e4] p-1 rounded-full border border-[#edd3b6] text-xs">
                <button
                  onClick={() => setViewLevel('simple')}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
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
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    viewLevel === 'nutri'
                      ? 'bg-[#705c53] text-[#fffcf6] shadow-xs'
                      : 'text-[#705c53] hover:text-[#2f1107]'
                  }`}
                  title="Ver calorías y macros por receta y día"
                >
                  Nutrición
                </button>
              </div>
            </div>

            {/* Right: Actions (Regenerar, Opciones, Limpiar) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => generateWeek()}
                className="px-3.5 py-1.5 bg-[#fff5e4] text-[#2f1107] border border-[#edd3b6] rounded-full text-xs font-bold hover:bg-[#fae5c0] transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Regenerar platos manteniendo los anclados 📌"
              >
                <FontAwesomeIcon icon={faRotateRight} />
                <span>Regenerar</span>
              </button>

              <button
                onClick={openAdvancedModal}
                className="px-3.5 py-1.5 bg-[#fff5e4] text-[#705c53] border border-[#edd3b6] rounded-full text-xs font-bold hover:bg-[#fae5c0] transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Ajustar dieta, estilo de cocina y calorías"
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

          {/* Main Content: Planner Grid or Shopping List */}
          {activeTab === 'plan' ? (
            <WeekGrid />
          ) : (
            <ShoppingList />
          )}
        </div>
      )}

      {/* ─── MODALS & DRAWERS ─── */}
      <RecipeDrawer />
      <AdvancedOptionsModal />
      <CalorieCalculatorModal />
      <UndoToast />
    </div>
  );
}
