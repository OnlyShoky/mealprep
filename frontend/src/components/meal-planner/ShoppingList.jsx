import React, { useState, useMemo } from 'react';
import { usePrepWeek } from '../../context/PrepWeekContext';
import { DAYS } from '../../utils/autoGenerate';
import { AISLES, getIngredientAisle, formatQuantity, normalizeIngredientName } from '../../utils/ingredientCategories';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPrint,
  faCopy,
  faPlus,
  faTrash,
  faMobileAlt,
  faUsers,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';

export default function ShoppingList() {
  const {
    plan,
    cook,
    left,
    people,
    setPeople,
    recipes,
    pantry,
    togglePantryItem,
    have,
    toggleHaveItem,
    extraItems,
    addExtraItem,
    removeExtraItem,
  } = usePrepWeek();

  const [isSupermarketMode, setIsSupermarketMode] = useState(false);
  const [showPantrySection, setShowPantrySection] = useState(false);
  const [newExtraText, setNewExtraText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Aggregate ingredients from weekly plan
  const aggregatedIngredients = useMemo(() => {
    const recipeMap = Object.fromEntries(recipes.map(r => [r.id, r]));
    const map = {};

    DAYS.forEach(day => {
      const slots = plan[day]?.slots || [];
      slots.forEach(slot => {
        if (!slot.recipeId) return;
        const recipe = recipeMap[slot.recipeId];
        if (!recipe || !recipe.ingredients) return;

        // Taper slots are already accounted for on cook day
        if (left.includes(slot.id)) return;

        const cookMultiplier = cook[slot.id] || 1;
        const totalPortions = cookMultiplier * people;

        recipe.ingredients.forEach(ing => {
          const normName = normalizeIngredientName(ing.ingredient);
          const key = `${normName}|${ing.unit || ''}`.toLowerCase();

          if (!map[key]) {
            map[key] = {
              name: normName,
              unit: ing.unit || '',
              quantity: 0,
              aisle: getIngredientAisle(normName),
            };
          }

          const baseQty = ing.quantity || 0;
          map[key].quantity += baseQty * totalPortions;
        });
      });
    });

    extraItems.forEach(item => {
      const key = `extra-${item.id}`;
      map[key] = {
        id: item.id,
        name: item.name,
        unit: '',
        quantity: null,
        aisle: item.aisle || 'pantry',
        isExtra: true,
      };
    });

    return Object.values(map);
  }, [plan, cook, left, people, recipes, extraItems]);

  const activeItems = useMemo(() => {
    return aggregatedIngredients.filter(item => !pantry.includes(item.name));
  }, [aggregatedIngredients, pantry]);

  const pantryItems = useMemo(() => {
    return aggregatedIngredients.filter(item => pantry.includes(item.name));
  }, [aggregatedIngredients, pantry]);

  const itemsByAisle = useMemo(() => {
    const grouped = {};
    AISLES.forEach(a => { grouped[a.id] = []; });

    activeItems.forEach(item => {
      const aisleId = item.aisle || 'pantry';
      if (!grouped[aisleId]) grouped[aisleId] = [];
      grouped[aisleId].push(item);
    });

    return grouped;
  }, [activeItems]);

  const handleAddExtra = (e) => {
    e.preventDefault();
    if (newExtraText.trim()) {
      addExtraItem(newExtraText.trim());
      setNewExtraText('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyToClipboard = () => {
    let text = `🛒 Lista de la compra - Meal Prep Codex (${people} personas)\n\n`;
    AISLES.forEach(aisle => {
      const items = itemsByAisle[aisle.id];
      if (items && items.length > 0) {
        text += `== ${aisle.icon} ${aisle.name.toUpperCase()} ==\n`;
        items.forEach(it => {
          const qtyStr = it.quantity ? ` (${formatQuantity(it.quantity, it.unit)})` : '';
          text += `[ ] ${it.name}${qtyStr}\n`;
        });
        text += '\n';
      }
    });

    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    });
  };

  const totalActiveCount = activeItems.length;
  const boughtCount = activeItems.filter(i => have.includes(i.name)).length;
  const todayFormatted = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      
      {/* ══════════════════════════════════════════════════════════════
          PRINT-ONLY EXCLUSIVE SECTION (VISIBLE ONLY WHEN PRINTING)
         ══════════════════════════════════════════════════════════════ */}
      <div className="hidden print:block mb-4">
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
          <div className="flex items-center gap-3">
            <img src="/favicon/logo.png" alt="Meal Prep Codex" className="h-14 w-auto object-contain" />
            <div>
              <h1 className="text-xl font-bold text-black font-display tracking-tight m-0 text-left">
                Meal Prep Codex
              </h1>
              <p className="text-xs text-gray-700 m-0">
                Lista de la compra semanal · {people} {people === 1 ? 'persona' : 'personas'}
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-600">
            <div className="capitalize">{todayFormatted}</div>
            <div className="font-bold text-black text-sm">{totalActiveCount} productos</div>
          </div>
        </div>

        {/* Print Columns Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs text-black">
          {AISLES.map(aisle => {
            const items = itemsByAisle[aisle.id] || [];
            if (items.length === 0) return null;

            return (
              <div key={aisle.id} className="border border-gray-400 rounded-lg p-2.5 break-inside-avoid">
                <div className="font-bold text-xs text-black border-b border-gray-300 pb-1 mb-1.5 flex items-center justify-between">
                  <span>{aisle.icon} {aisle.name}</span>
                  <span className="text-[11px] text-gray-500 font-normal">({items.length})</span>
                </div>
                <div className="space-y-1">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block w-3 h-3 border border-black rounded-xs shrink-0" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {item.quantity && (
                        <span className="font-mono text-gray-700 text-[10px] shrink-0 ml-2">
                          {formatQuantity(item.quantity, item.unit)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          ON-SCREEN WEB VIEW (HIDDEN ON PRINT)
         ══════════════════════════════════════════════════════════════ */}
      <div className="print:hidden space-y-4">
        
        {/* Compact Header Bar */}
        <div className="bg-[#fffcf6] px-4 py-3 rounded-2xl border border-[#edd3b6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-display text-xl text-[#2f1107] m-0">
                Lista de la compra
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.2 rounded-full bg-[#fff5e4] text-[#705c53] border border-[#edd3b6]">
                {boughtCount}/{totalActiveCount}
              </span>
            </div>
            <p className="text-[11px] text-[#705c53] mt-0.5 mb-0">
              {people} {people === 1 ? 'persona' : 'personas'} · {totalActiveCount} productos {left.length > 0 && ` · ${left.length} tapers 🥡`}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Diners selector */}
            <div className="flex items-center bg-[#fff5e4] border border-[#edd3b6] rounded-full px-2.5 py-0.5 gap-1.5 text-xs">
              <FontAwesomeIcon icon={faUsers} className="text-[#705c53] text-[10px]" />
              <button
                onClick={() => setPeople(Math.max(1, people - 1))}
                className="text-[#705c53] hover:text-[#2f1107] font-bold px-1 cursor-pointer"
                title="Menos personas"
              >
                -
              </button>
              <span className="font-bold text-[#2f1107] min-w-[38px] text-center text-xs select-none">
                {people} {people === 1 ? 'p.' : 'p.'}
              </span>
              <button
                onClick={() => setPeople(people + 1)}
                className="text-[#705c53] hover:text-[#2f1107] font-bold px-1 cursor-pointer"
                title="Más personas"
              >
                +
              </button>
            </div>

            {/* Supermarket mode */}
            <button
              onClick={() => setIsSupermarketMode(!isSupermarketMode)}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border ${
                isSupermarketMode
                  ? 'bg-[#705c53] text-[#fffcf6] border-[#705c53]'
                  : 'bg-[#fff5e4] text-[#705c53] border-[#edd3b6] hover:bg-[#fae5c0]'
              }`}
              title="Modo táctil para comprar con el móvil"
            >
              <FontAwesomeIcon icon={faMobileAlt} className="text-[10px]" />
              <span>Súper</span>
            </button>

            {/* Copy button */}
            <button
              onClick={handleCopyToClipboard}
              className="px-3 py-1 bg-[#fff5e4] text-[#705c53] border border-[#edd3b6] rounded-full text-xs font-bold hover:bg-[#fae5c0] transition-colors flex items-center gap-1 cursor-pointer"
              title="Copiar texto para WhatsApp"
            >
              <FontAwesomeIcon icon={faCopy} className="text-[10px]" />
              <span>{copySuccess ? 'Copiado' : 'Copiar'}</span>
            </button>

            {/* Print button */}
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-[#705c53] text-[#fffcf6] border border-[#705c53] rounded-full text-xs font-bold hover:bg-[#2f1107] transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
              title="Imprimir solo la lista con el logo oficial"
            >
              <FontAwesomeIcon icon={faPrint} className="text-[10px]" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>

        {/* Add product input */}
        <form onSubmit={handleAddExtra} className="flex gap-2">
          <input
            type="text"
            value={newExtraText}
            onChange={(e) => setNewExtraText(e.target.value)}
            placeholder="Añadir otro producto (ej. Café, Aceite, Pan...)"
            className="flex-1 px-3.5 py-2 bg-[#fffcf6] border border-[#edd3b6] rounded-xl text-xs text-[#2f1107] placeholder-[#705c53]/60 focus:outline-none focus:ring-1 focus:ring-[#705c53]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#705c53] text-[#fffcf6] rounded-xl text-xs font-bold hover:bg-[#2f1107] transition-colors flex items-center gap-1 cursor-pointer shrink-0 shadow-xs"
          >
            <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
            Añadir
          </button>
        </form>

        {/* ─── COMPACT MASONRY / CSS-COLUMNS (ZERO EMPTY VOIDS!) ─── */}
        <div className="columns-1 md:columns-2 gap-3 space-y-3">
          {AISLES.map(aisle => {
            const items = itemsByAisle[aisle.id] || [];
            if (items.length === 0) return null;

            return (
              <div
                key={aisle.id}
                className="bg-[#fffcf6] rounded-2xl border border-[#edd3b6] shadow-2xs overflow-hidden break-inside-avoid"
              >
                {/* Compact Aisle Header */}
                <div className="bg-[#fff5e4] px-3 py-1.5 border-b border-[#edd3b6] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{aisle.icon}</span>
                    <h3 className="font-display text-xs sm:text-sm font-bold text-[#2f1107] m-0">
                      {aisle.name}
                    </h3>
                  </div>
                  <span className="text-[10px] text-[#705c53] font-mono">
                    {items.length}
                  </span>
                </div>

                {/* Items List - Compact py-1 */}
                <div className="divide-y divide-[#edd3b6]/40 p-1">
                  {items.map((item, idx) => {
                    const isChecked = have.includes(item.name);
                    return (
                      <div
                        key={item.id || `${item.name}-${idx}`}
                        className={`flex items-center justify-between px-2 rounded-lg transition-colors ${
                          isChecked ? 'bg-[#fff5e4]/50 opacity-60' : 'hover:bg-[#fff5e4]/70'
                        } ${isSupermarketMode ? 'py-2' : 'py-1'}`}
                      >
                        {/* Checkbox & Name */}
                        <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0 pr-1.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleHaveItem(item.name)}
                            className={`rounded border-[#705c53] text-[#705c53] focus:ring-0 cursor-pointer ${
                              isSupermarketMode ? 'w-4.5 h-4.5' : 'w-3.5 h-3.5'
                            }`}
                          />
                          <span
                            className={`truncate ${
                              isChecked ? 'line-through text-[#705c53]' : 'text-[#2f1107]'
                            } ${isSupermarketMode ? 'text-xs font-semibold' : 'text-xs font-medium'}`}
                            title={item.name}
                          >
                            {item.name}
                          </span>
                        </label>

                        {/* Quantity & Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.quantity && (
                            <span className="font-mono text-[10px] font-bold text-[#705c53] bg-[#fff5e4] px-1.5 py-0.2 rounded border border-[#edd3b6]/60">
                              {formatQuantity(item.quantity, item.unit)}
                            </span>
                          )}

                          {item.isExtra ? (
                            <button
                              onClick={() => removeExtraItem(item.id)}
                              className="text-[#6d2323] hover:text-red-700 p-0.5 text-xs cursor-pointer"
                              title="Eliminar"
                            >
                              <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
                            </button>
                          ) : (
                            <button
                              onClick={() => togglePantryItem(item.name)}
                              className="text-[9.5px] text-[#705c53] hover:text-[#2f1107] underline cursor-pointer"
                              title="Marcar que ya lo tienes en casa"
                            >
                              Ya lo tengo
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pantry Section ("En tu despensa") */}
        {pantryItems.length > 0 && (
          <div className="bg-[#fffcf6] rounded-2xl border border-[#edd3b6] shadow-2xs overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPantrySection(!showPantrySection)}
              className="w-full bg-[#fff5e4] px-3.5 py-2 flex items-center justify-between cursor-pointer hover:bg-[#fae5c0]/50 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs">🏠</span>
                <span className="font-display text-xs font-bold text-[#2f1107]">
                  En tu despensa ({pantryItems.length} productos disponibles)
                </span>
              </div>
              <FontAwesomeIcon icon={showPantrySection ? faChevronUp : faChevronDown} className="text-[10px] text-[#705c53]" />
            </button>

            {showPantrySection && (
              <div className="p-2.5 divide-y divide-[#edd3b6]/40 text-xs">
                {pantryItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 text-[#705c53]">
                    <span className="text-xs">{item.name}</span>
                    <button
                      onClick={() => togglePantryItem(item.name)}
                      className="text-[10px] text-[#705c53] hover:text-[#2f1107] underline cursor-pointer"
                    >
                      Mover a la lista
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
