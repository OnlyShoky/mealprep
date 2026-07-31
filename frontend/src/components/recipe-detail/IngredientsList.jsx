import React from 'react';

export default function IngredientsList({ ingredients, currentServings, originalServings }) {
  if (!ingredients || ingredients.length === 0) return null;

  const ratio = currentServings / (originalServings || 1);

  // Group ingredients
  const groups = {};
  ingredients.forEach(ing => {
    const group = ing.groupName || 'Main';
    if (!groups[group]) groups[group] = [];
    groups[group].push(ing);
  });

  const formatQuantity = (quantity) => {
    if (!quantity) return '';
    const scaled = quantity * ratio;
    // Round to 2 decimal places to avoid 0.3333333333
    return Math.round(scaled * 100) / 100;
  };

  return (
    <div className="bg-sepia-100 rounded-xl p-6 shadow-box-up">
      <h3 className="text-2xl font-bold text-normal ruslan-display mb-4">Ingredients</h3>
      
      {Object.entries(groups).map(([groupName, items]) => (
        <div key={groupName} className="mb-6 last:mb-0">
          {groupName !== 'Main' && (
            <h4 className="font-bold text-lg text-sepia-warn mb-2">{groupName}</h4>
          )}
          <ul className="space-y-3">
            {items.map((ing, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-sepia-warn mr-2">•</span>
                <span>
                  {ing.quantity && (
                    <span className="font-bold mr-1">
                      {formatQuantity(ing.quantity)} {ing.unit}
                    </span>
                  )}
                  <span className="text-normal">{ing.ingredient}</span>
                  {ing.notes && (
                    <span className="text-sepia-800 text-sm ml-1 italic">
                      ({ing.notes})
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
