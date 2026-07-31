import React from 'react';
import Accordion from '../ui/Accordion';

export default function NutritionPanel({ nutrition }) {
  if (!nutrition) return null;

  const rows = [
    { label: 'Calories', value: nutrition.calories, unit: 'kcal', main: true },
    { label: 'Total Fat', value: nutrition.fat, unit: 'g', main: true },
    { label: 'Saturated Fat', value: nutrition.saturated_fat, unit: 'g', indent: true },
    { label: 'Trans Fat', value: nutrition.trans_fat, unit: 'g', indent: true },
    { label: 'Cholesterol', value: nutrition.cholesterol, unit: 'mg', main: true },
    { label: 'Sodium', value: nutrition.sodium, unit: 'mg', main: true },
    { label: 'Total Carbohydrates', value: nutrition.carbohydrates, unit: 'g', main: true },
    { label: 'Dietary Fiber', value: nutrition.fiber, unit: 'g', indent: true },
    { label: 'Sugars', value: nutrition.sugar, unit: 'g', indent: true },
    { label: 'Protein', value: nutrition.protein, unit: 'g', main: true },
  ];

  const vitamins = [
    { label: 'Vitamin A', value: nutrition.vitamin_a, unit: 'IU' },
    { label: 'Vitamin C', value: nutrition.vitamin_c, unit: 'mg' },
    { label: 'Calcium', value: nutrition.calcium, unit: 'mg' },
    { label: 'Iron', value: nutrition.iron, unit: 'mg' },
    { label: 'Potassium', value: nutrition.potassium, unit: 'mg' },
  ];

  return (
    <Accordion title="Nutritional Information" defaultOpen={false}>
      <div className="bg-white p-4 border-2 border-black">
        <h3 className="font-black text-3xl mb-1">Nutrition Facts</h3>
        <div className="border-b-[10px] border-black mb-2"></div>
        <p className="font-bold text-sm mb-2">Amount Per Serving</p>
        
        <div className="flex justify-between items-baseline border-b-4 border-black pb-1 mb-2">
          <span className="font-black text-2xl">Calories</span>
          <span className="font-black text-3xl">{nutrition.calories}</span>
        </div>
        
        <div className="text-right font-bold text-xs border-b border-black pb-1 mb-1">% Daily Value*</div>
        
        {rows.map((row, idx) => (
          <div key={idx} className={`flex justify-between border-b border-black py-1 ${row.main ? 'font-bold' : ''}`}>
            <span className={row.indent ? 'ml-4 font-normal text-sm' : 'text-sm'}>
              {row.label} <span className="font-normal">{row.value}{row.unit}</span>
            </span>
          </div>
        ))}
        
        <div className="border-b-[10px] border-black my-2"></div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {vitamins.map((vit, idx) => (
            <div key={idx} className="flex justify-between text-sm border-b border-gray-400 py-1">
              <span>{vit.label}</span>
              <span>{vit.value}{vit.unit}</span>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-gray-500 mt-4 leading-tight">
          * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
        </p>
      </div>
    </Accordion>
  );
}
