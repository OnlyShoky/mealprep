import React, { useState } from 'react';
import { usePrepWeek } from '../../context/PrepWeekContext';
import { computeDailyTargets } from '../../utils/nutrition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCalculator, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function CalorieCalculatorModal() {
  const { isCalculatorModalOpen, closeCalculatorModal, profile, setProfile } = usePrepWeek();

  const [sex, setSex] = useState(profile.sex || 'female');
  const [age, setAge] = useState(profile.age || 32);
  const [weightKg, setWeightKg] = useState(profile.weightKg || 65);
  const [heightCm, setHeightCm] = useState(profile.heightCm || 168);
  const [activityLevel, setActivityLevel] = useState(profile.activityLevel || 'moderately_active');
  const [goal, setGoal] = useState(profile.goal || 'deficit');

  if (!isCalculatorModalOpen) return null;

  const currentPreview = computeDailyTargets({
    sex,
    age: Number(age) || 30,
    weightKg: Number(weightKg) || 70,
    heightCm: Number(heightCm) || 170,
    activityLevel,
    goal,
  });

  const handleSave = () => {
    setProfile({
      sex,
      age: Number(age),
      weightKg: Number(weightKg),
      heightCm: Number(heightCm),
      activityLevel,
      goal,
    });
    closeCalculatorModal();
  };

  const handleClear = () => {
    setProfile({});
    closeCalculatorModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#fffcf6] w-full max-w-md rounded-2xl shadow-2xl border border-[#edd3b6] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#edd3b6] flex items-center justify-between bg-[#fff5e4]">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCalculator} className="text-[#705c53]" />
            <h2 className="font-display text-xl text-[#2f1107]">Calculadora de calorías</h2>
          </div>
          <button
            onClick={closeCalculatorModal}
            className="w-8 h-8 rounded-full bg-[#fae5c0] text-[#705c53] hover:text-[#2f1107] flex items-center justify-center cursor-pointer transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#2f1107]">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#705c53] block mb-1">Sexo</label>
              <select
                value={sex}
                onChange={e => setSex(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border border-[#edd3b6] text-xs"
              >
                <option value="female">Mujer</option>
                <option value="male">Hombre</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-[#705c53] block mb-1">Edad</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border border-[#edd3b6] text-xs"
                placeholder="Años"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#705c53] block mb-1">Peso (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={e => setWeightKg(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border border-[#edd3b6] text-xs"
                placeholder="kg"
              />
            </div>
            <div>
              <label className="font-bold text-[#705c53] block mb-1">Altura (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={e => setHeightCm(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border border-[#edd3b6] text-xs"
                placeholder="cm"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#705c53] block mb-1">Nivel de actividad</label>
            <select
              value={activityLevel}
              onChange={e => setActivityLevel(e.target.value)}
              className="w-full p-2 bg-white rounded-lg border border-[#edd3b6] text-xs"
            >
              <option value="sedentary">Sedentario (oficina, poco movimiento)</option>
              <option value="lightly_active">Ligero (1-2 días ejercicio suave)</option>
              <option value="moderately_active">Moderado (3-5 días ejercicio)</option>
              <option value="very_active">Muy activo (6-7 días intenso)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-[#705c53] block mb-1">Meta</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'deficit', label: 'Perder grasa (-20%)' },
                { id: 'maintenance', label: 'Mantener peso' },
                { id: 'surplus', label: 'Ganar músculo (+15%)' },
              ].map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoal(g.id)}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    goal === g.id
                      ? 'border-[#705c53] bg-[#fff5e4] font-bold'
                      : 'border-[#edd3b6] bg-white'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Result Card */}
          <div className="p-4 bg-[#feeed2] rounded-xl border border-[#edd3b6] text-center mt-3">
            <div className="text-[11px] text-[#705c53] font-bold uppercase tracking-wider">Tu objetivo estimado</div>
            <div className="text-3xl font-display font-bold text-[#2f1107] my-1">
              {currentPreview.calories} <span className="text-sm font-sans font-normal text-[#705c53]">kcal/día</span>
            </div>
            <div className="flex justify-center gap-4 text-[11px] text-[#705c53] font-mono mt-1">
              <span>Prot: {currentPreview.protein}g</span>
              <span>Carb: {currentPreview.carbs}g</span>
              <span>Grasa: {currentPreview.fat}g</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#fff5e4] border-t border-[#edd3b6] flex items-center justify-between">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-[#6d2323] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <FontAwesomeIcon icon={faTrash} />
            Borrar meta
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={closeCalculatorModal}
              className="px-4 py-1.5 border border-[#edd3b6] text-[#705c53] rounded-full text-xs font-semibold hover:bg-white transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-1.5 bg-[#705c53] text-[#fffcf6] rounded-full text-xs font-bold hover:bg-[#2f1107] transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={faCheck} />
              Guardar objetivo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
