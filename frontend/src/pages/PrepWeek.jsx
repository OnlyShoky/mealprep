import React, { useState, useEffect } from 'react';
import { usePrepWeek } from '../context/PrepWeekContext';
import ProfileSummaryBar from '../components/meal-planner/ProfileSummaryBar';
import WeeklySummary from '../components/meal-planner/WeeklySummary';
import WeekGrid from '../components/meal-planner/WeekGrid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faTrashAlt, faColumns, faList } from '@fortawesome/free-solid-svg-icons';

export default function PrepWeek() {
  const { profileComplete, generateWeek, clearWeek } = usePrepWeek();
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('prepweek_view_mode') || 'columns';
  });

  useEffect(() => {
    localStorage.setItem('prepweek_view_mode', viewMode);
  }, [viewMode]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-4xl font-display text-sepia-900 mb-1">PrepWeek Planner</h1>
          <p className="text-sepia-800">Plan your meals to hit your exact calorie and macro targets.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggle */}
          <div className="bg-sepia-200 p-1 rounded-full flex items-center border border-sepia-300 shadow-inner">
            <button
              onClick={() => setViewMode('columns')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'columns'
                  ? 'bg-sepia-800 text-white shadow-sm'
                  : 'text-sepia-700 hover:text-sepia-900 cursor-pointer'
              }`}
              title="Columns view (Left to Right)"
            >
              <FontAwesomeIcon icon={faColumns} />
              <span>Columns</span>
            </button>
            <button
              onClick={() => setViewMode('rows')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'rows'
                  ? 'bg-sepia-800 text-white shadow-sm'
                  : 'text-sepia-700 hover:text-sepia-900 cursor-pointer'
              }`}
              title="Rows view (Top to Bottom / Scrolling)"
            >
              <FontAwesomeIcon icon={faList} />
              <span>Rows</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear the entire week?')) {
                clearWeek();
              }
            }}
            className="px-4 py-2 border border-sepia-300 text-sepia-600 rounded-full font-semibold text-sm hover:bg-sepia-200 transition-colors flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faTrashAlt} />
            Clear
          </button>
          <button
            onClick={generateWeek}
            disabled={!profileComplete}
            className={`px-5 py-2 rounded-full font-bold text-sm shadow-sm flex items-center gap-2 transition-all
              ${profileComplete 
                ? 'bg-sepia-800 text-white hover:bg-sepia-900' 
                : 'bg-sepia-300 text-sepia-500 cursor-not-allowed'
              }`}
          >
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            Auto-Generate
          </button>
        </div>
      </div>

      <ProfileSummaryBar />
      <WeeklySummary />
      <WeekGrid viewMode={viewMode} />

    </div>
  );
}

