import React from 'react';
import { usePrepWeek } from '../context/PrepWeekContext';
import ProfileSummaryBar from '../components/meal-planner/ProfileSummaryBar';
import WeeklySummary from '../components/meal-planner/WeeklySummary';
import WeekGrid from '../components/meal-planner/WeekGrid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export default function PrepWeek() {
  const { profileComplete, generateWeek, clearWeek } = usePrepWeek();

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-4xl font-display text-sepia-900 mb-1">PrepWeek Planner</h1>
          <p className="text-sepia-800">Plan your meals to hit your exact calorie and macro targets.</p>
        </div>
        
        <div className="flex items-center gap-3">
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
      <WeekGrid />

    </div>
  );
}
