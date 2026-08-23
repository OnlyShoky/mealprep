import React, { useState } from 'react';
import { usePrepWeek } from '../../context/PrepWeekContext';
import { computeDeficitAndWeightLoss } from '../../utils/nutrition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faArrowDown, faArrowUp, faBullseye, faMinus, faSliders, faChevronDown, faChevronUp, faChartLine } from '@fortawesome/free-solid-svg-icons';

export default function WeeklySummary() {
  const { summaries, profileComplete, dailyTargets, profile } = usePrepWeek();
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!profileComplete || !summaries) return null;

  const { weekly, weeklyTarget } = summaries;
  const deficitData = computeDeficitAndWeightLoss(dailyTargets?.tdee, dailyTargets?.calories, weekly.calories);

  const maint = deficitData ? deficitData.weeklyMaintenance : 0;
  const target = weeklyTarget.calories || 0;
  const logged = weekly.calories || 0;
  const goal = profile?.goal || 'deficit';

  // Determine scaling basis so target and maintenance are both visible
  const maxVal = Math.max(maint, target, logged, 1);
  const loggedPct = Math.min(100, (logged / maxVal) * 100);
  const targetPct = Math.min(100, (target / maxVal) * 100);
  const maintPct = Math.min(100, (maint / maxVal) * 100);

  // Goal-aware progress bar color logic
  let barColor = '#2e7d32'; // Default Emerald Green
  if (goal === 'surplus') {
    if (logged <= maint) {
      barColor = '#38bdf8'; // Light Sky Blue (building up to maintenance)
    } else if (logged <= target * 1.02) {
      barColor = '#818cf8'; // Soft Lighter Indigo / Lavender (Growth Zone)
    } else {
      barColor = '#c084fc'; // Soft Light Purple (exceeding surplus target)
    }
  } else if (goal === 'deficit') {
    if (logged > maint) {
      barColor = '#dc2626'; // Red (over maintenance)
    } else if (logged > target * 1.02) {
      barColor = '#d97706'; // Amber (in deficit gap)
    } else {
      barColor = '#2e7d32'; // Green (on deficit target)
    }
  } else {
    if (logged > target * 1.05) {
      barColor = '#dc2626';
    } else if (logged < target * 0.9) {
      barColor = '#d97706';
    } else {
      barColor = '#2e7d32';
    }
  }

  const targetKg = deficitData ? deficitData.targetKgChange : 0;
  const actualKg = deficitData ? deficitData.actualKgChange : 0;

  return (
    <div className="bg-sepia-200 border border-sepia-700 rounded-xl p-6 shadow-sm mb-8 flex flex-col gap-6">
      
      {/* Header: Title + Subtitle Next to Title, Tag on second line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sepia-300 pb-4">
        <div>
          <div className="flex flex-wrap items-baseline gap-2 mb-1">
            <h2 className="text-xl font-display text-sepia-900">Weekly Overview</h2>
            <span className="text-xs text-sepia-700 font-normal">Track weekly nutrition against target calories and maintenance energy.</span>
          </div>
          <div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border inline-block ${
              goal === 'deficit' 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                : goal === 'surplus' 
                ? 'bg-indigo-100 text-indigo-800 border-indigo-300' 
                : 'bg-sepia-100 text-sepia-800 border-sepia-300'
            }`}>
              {goal === 'deficit' ? 'Fat Loss Deficit' : goal === 'surplus' ? 'Muscle Gain Surplus' : 'Maintenance'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="self-start sm:self-center px-4 py-2 rounded-full text-xs font-bold bg-white text-sepia-900 border border-sepia-400 hover:bg-orange-50 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <FontAwesomeIcon icon={faSliders} />
          <span>{showAdvanced ? 'Hide Analytics' : 'Advanced Analytics'}</span>
          <FontAwesomeIcon icon={showAdvanced ? faChevronUp : faChevronDown} size="xs" />
        </button>
      </div>

      {/* Main Bar & Macros Section */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Calories Progress Bar */}
        <div className="flex-1">
          <div className="flex justify-between items-end mb-2 text-sm font-semibold">
            <div>
              <span className="text-2xl font-bold text-normal">{logged.toLocaleString()}</span>
              <span className="text-gray-500 text-xs ml-1 font-normal">kcal logged</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-sepia-900 font-bold">
                Target: <span>{target.toLocaleString()}</span> kcal
              </span>
              {maint > 0 && (
                <span className="text-gray-600 font-medium">
                  Maint: <span className="text-gray-800 font-bold">{maint.toLocaleString()}</span> kcal
                </span>
              )}
            </div>
          </div>

          {/* Clean Progress Bar Container */}
          <div className="relative h-6 bg-sepia-300 rounded-full overflow-hidden shadow-inner border border-sepia-400 mb-2">
            
            {/* Deficit Zone Track Background (Fat Loss: Between Target and Maintenance) */}
            {goal === 'deficit' && targetPct < maintPct && (
              <div 
                className="absolute top-0 bottom-0 bg-emerald-200/90 border-l border-emerald-400 z-0"
                style={{ 
                  left: `${targetPct}%`, 
                  width: `${maintPct - targetPct}%` 
                }}
              />
            )}

            {/* Growth Zone Track Background (Muscle Gain: Between Maintenance and Target) */}
            {goal === 'surplus' && maintPct < targetPct && (
              <div 
                className="absolute top-0 bottom-0 bg-indigo-200/90 border-l border-indigo-400 z-0"
                style={{ 
                  left: `${maintPct}%`, 
                  width: `${targetPct - maintPct}%` 
                }}
              />
            )}

            {/* Multi-Segment Logged Progress Fill Bar */}
            {loggedPct > 0 && (
              <div 
                className="h-full rounded-l-full overflow-hidden flex transition-all duration-500 relative z-10 opacity-95 shadow-xs"
                style={{ 
                  width: `${loggedPct}%`,
                  borderTopRightRadius: loggedPct >= 100 ? '9999px' : '0px',
                  borderBottomRightRadius: loggedPct >= 100 ? '9999px' : '0px'
                }}
              >
                {goal === 'surplus' ? (
                  <>
                    {/* Segment 1: Up to Maintenance (Sky Blue) */}
                    <div 
                      className="h-full transition-all" 
                      style={{ 
                        width: `${(Math.min(logged, maint) / logged) * 100}%`,
                        backgroundColor: '#38bdf8' 
                      }}
                      title={`Base Calories (up to Maintenance): ${Math.min(logged, maint).toLocaleString()} kcal`}
                    />
                    {/* Segment 2: Growth Zone Surplus (Soft Indigo) */}
                    {logged > maint && (
                      <div 
                        className="h-full transition-all" 
                        style={{ 
                          width: `${((Math.min(logged, target) - maint) / logged) * 100}%`,
                          backgroundColor: '#818cf8' 
                        }}
                        title={`Growth Zone Calories: ${(Math.min(logged, target) - maint).toLocaleString()} kcal`}
                      />
                    )}
                    {/* Segment 3: Over Surplus Target (Soft Purple) */}
                    {logged > target && (
                      <div 
                        className="h-full transition-all" 
                        style={{ 
                          width: `${((logged - target) / logged) * 100}%`,
                          backgroundColor: '#c084fc' 
                        }}
                        title={`Over Target Calories: ${(logged - target).toLocaleString()} kcal`}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {/* Segment 1: Up to Deficit Target (Emerald Green) */}
                    <div 
                      className="h-full transition-all" 
                      style={{ 
                        width: `${(Math.min(logged, target) / logged) * 100}%`,
                        backgroundColor: '#2e7d32' 
                      }}
                      title={`Target Deficit Calories: ${Math.min(logged, target).toLocaleString()} kcal`}
                    />
                    {/* Segment 2: Deficit Buffer (Amber) */}
                    {logged > target && (
                      <div 
                        className="h-full transition-all" 
                        style={{ 
                          width: `${((Math.min(logged, maint) - target) / logged) * 100}%`,
                          backgroundColor: '#d97706' 
                        }}
                        title={`Deficit Buffer Calories: ${(Math.min(logged, maint) - target).toLocaleString()} kcal`}
                      />
                    )}
                    {/* Segment 3: Over Maintenance (Red Alarm) */}
                    {logged > maint && (
                      <div 
                        className="h-full transition-all" 
                        style={{ 
                          width: `${((logged - maint) / logged) * 100}%`,
                          backgroundColor: '#dc2626' 
                        }}
                        title={`Over Maintenance Calories: ${(logged - maint).toLocaleString()} kcal`}
                      />
                    )}
                  </>
                )}
              </div>
            )}

            {/* Zone Label Text Overlay (Dynamically constrained to fit inside zone box) */}
            {goal === 'deficit' && targetPct < maintPct && (
              <div 
                className="absolute top-0 bottom-0 flex items-center justify-center pointer-events-none z-20 overflow-hidden px-1"
                style={{ left: `${targetPct}%`, width: `${maintPct - targetPct}%` }}
              >
                <span className="text-[8px] sm:text-[9px] font-extrabold text-emerald-950 uppercase tracking-tight bg-white/85 px-1 py-0.2 rounded shadow-2xs max-w-[95%] truncate border border-emerald-300">
                  Deficit Zone
                </span>
              </div>
            )}

            {goal === 'surplus' && maintPct < targetPct && (
              <div 
                className="absolute top-0 bottom-0 flex items-center justify-center pointer-events-none z-20 overflow-hidden px-1"
                style={{ left: `${maintPct}%`, width: `${targetPct - maintPct}%` }}
              >
                <span className="text-[8px] sm:text-[9px] font-extrabold text-indigo-950 uppercase tracking-tight bg-white/85 px-1 py-0.2 rounded shadow-2xs max-w-[95%] truncate border border-indigo-300">
                  Growth Zone
                </span>
              </div>
            )}
            
            {/* Target Line Marker */}
            {targetPct > 0 && targetPct < 100 && (
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-sepia-900 z-30"
                style={{ left: `${targetPct}%` }}
                title={`Target: ${target.toLocaleString()} kcal`}
              />
            )}

            {/* Maintenance Line Marker */}
            {maintPct > 0 && maintPct < 100 && (
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-orange-600 z-30"
                style={{ left: `${maintPct}%` }}
                title={`Maintenance: ${maint.toLocaleString()} kcal`}
              />
            )}
          </div>

          {/* Bar Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-600 gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 font-medium">
                <span className={`w-2.5 h-2.5 rounded-full inline-block ${goal === 'surplus' ? 'bg-[#38bdf8]' : 'bg-[#2e7d32]'}`} />
                Logged ({logged.toLocaleString()} kcal)
              </span>
              <span className="flex items-center gap-1 font-medium text-sepia-900">
                <span className="w-1.5 h-3 bg-sepia-900 inline-block rounded-xs" />
                Target ({target.toLocaleString()} kcal)
              </span>
              {maint > 0 && (
                <span className="flex items-center gap-1 font-medium text-orange-800">
                  <span className="w-1.5 h-3 bg-orange-600 inline-block rounded-xs" />
                  Maint ({maint.toLocaleString()} kcal)
                </span>
              )}
            </div>

            {goal === 'deficit' && maint > target && (
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                Deficit Gap: {(maint - target).toLocaleString()} kcal/wk
              </span>
            )}
            {goal === 'surplus' && target > maint && (
              <span className="text-[11px] font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-300">
                Surplus Gap: +{(target - maint).toLocaleString()} kcal/wk
              </span>
            )}
          </div>
        </div>

        {/* Macros Breakdown */}
        <div className="flex-1 flex gap-3 sm:gap-4">
          <div className="flex-1 bg-white/60 rounded-xl p-3 border border-sepia-300 shadow-2xs">
            <div className="text-xs font-semibold text-gray-500 mb-1">PROTEIN</div>
            <div className="text-lg font-bold" style={{ color: '#c08552' }}>{weekly.protein}g</div>
            <div className="text-xs text-gray-400">Target: {weeklyTarget.protein}g</div>
          </div>
          <div className="flex-1 bg-white/60 rounded-xl p-3 border border-sepia-300 shadow-2xs">
            <div className="text-xs font-semibold text-gray-500 mb-1">CARBS</div>
            <div className="text-lg font-bold" style={{ color: '#6d9ab5' }}>{weekly.carbs}g</div>
            <div className="text-xs text-gray-400">Target: {weeklyTarget.carbs}g</div>
          </div>
          <div className="flex-1 bg-white/60 rounded-xl p-3 border border-sepia-300 shadow-2xs">
            <div className="text-xs font-semibold text-gray-500 mb-1">FAT</div>
            <div className="text-lg font-bold" style={{ color: '#8b6e8e' }}>{weekly.fat}g</div>
            <div className="text-xs text-gray-400">Target: {weeklyTarget.fat}g</div>
          </div>
        </div>

      </div>

      {/* Redesigned Collapsible Advanced Analytics */}
      {showAdvanced && deficitData && (
        <div className="pt-5 border-t border-sepia-300/80 flex flex-col gap-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-sepia-900 uppercase tracking-wider flex items-center gap-2">
              <FontAwesomeIcon icon={faChartLine} className="text-sepia-700" />
              Advanced Calorie & Weight Analytics
            </h3>
            <span className="text-[11px] text-sepia-600 font-medium">Standard energy balance calculation (7,700 kcal / kg)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Maintenance TDEE */}
            <div className="bg-white rounded-xl p-4 border border-sepia-300 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold text-sepia-800 mb-2">
                <span>MAINTENANCE (TDEE)</span>
                <FontAwesomeIcon icon={faFire} className="text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-gray-900">
                  {deficitData.weeklyMaintenance.toLocaleString()} <span className="text-xs text-gray-500 font-normal">kcal/wk</span>
                </div>
                <div className="text-xs text-gray-600 mt-1 font-medium">
                  {deficitData.dailyMaintenance.toLocaleString()} kcal / day baseline
                </div>
              </div>
            </div>

            {/* Target Deficit / Surplus */}
            <div className="bg-white rounded-xl p-4 border border-sepia-300 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold text-sepia-800 mb-2">
                <span>{goal === 'surplus' ? 'TARGET SURPLUS' : 'TARGET DEFICIT'}</span>
                <FontAwesomeIcon icon={faBullseye} className="text-sepia-800" />
              </div>
              <div>
                <div className={`text-2xl font-extrabold ${goal === 'surplus' ? 'text-indigo-700' : deficitData.weeklyTargetDeficit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                  {deficitData.weeklyTargetDeficit >= 0 ? '-' : '+'}{Math.abs(deficitData.weeklyTargetDeficit).toLocaleString()} <span className="text-xs font-normal text-gray-600">kcal/wk</span>
                </div>
                <div className="text-xs text-gray-600 mt-1 font-medium">
                  {deficitData.dailyTargetDeficit >= 0 ? '-' : '+'}{Math.abs(deficitData.dailyTargetDeficit)} kcal / day vs maintenance
                </div>
              </div>
            </div>

            {/* Target Est. Weight Impact Card */}
            <div className="bg-white rounded-xl p-4 border-2 border-sepia-400 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold text-sepia-900 mb-2">
                <span>EST. TARGET IMPACT</span>
                <div className={`p-1 rounded-md ${targetKg > 0 ? 'bg-emerald-100 text-emerald-800' : targetKg < 0 ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-700'}`}>
                  <FontAwesomeIcon icon={targetKg > 0 ? faArrowDown : targetKg < 0 ? faArrowUp : faMinus} />
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-sepia-950 tracking-tight">
                  {targetKg > 0 ? `-${targetKg.toFixed(2)}` : targetKg < 0 ? `+${Math.abs(targetKg).toFixed(2)}` : '0.00'} <span className="text-sm font-bold text-sepia-700">kg / week</span>
                </div>
                <div className="text-xs text-sepia-700 mt-1 font-semibold">
                  {targetKg > 0 ? 'Target fat loss pace' : targetKg < 0 ? 'Target muscle gain pace' : 'Weight maintenance'}
                </div>
              </div>
            </div>

            {/* Plan Est. Weight Impact Card */}
            <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-300 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold text-sepia-900 mb-2">
                <span>EST. PLAN IMPACT</span>
                <div className={`p-1 rounded-md ${actualKg > 0 ? 'bg-emerald-100 text-emerald-800' : actualKg < 0 ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-700'}`}>
                  <FontAwesomeIcon icon={actualKg > 0 ? faArrowDown : actualKg < 0 ? faArrowUp : faMinus} />
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-sepia-950 tracking-tight">
                  {actualKg > 0 ? `-${actualKg.toFixed(2)}` : actualKg < 0 ? `+${Math.abs(actualKg).toFixed(2)}` : '0.00'} <span className="text-sm font-bold text-sepia-700">kg this week</span>
                </div>
                <div className="text-xs text-sepia-700 mt-1 font-semibold">
                  Based on logged meals ({logged.toLocaleString()} kcal)
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
