import React from 'react';
import { Link } from 'react-router-dom';
import { usePrepWeek } from '../../context/PrepWeekContext';
import { computeDailyTargets, computeTDEE, computeBMR } from '../../utils/nutrition';

const ACTIVITY_LABELS = {
  sedentary:         'Sedentary',
  lightly_active:    'Lightly active',
  moderately_active: 'Moderately active',
  very_active:       'Very active',
  extra_active:      'Extra active',
};

const GOAL_LABELS = {
  deficit:     'Fat loss',
  maintenance: 'Maintenance',
  surplus:     'Muscle gain',
};

const DIETARY_LABELS = {
  none:        'No restriction',
  vegetarian:  'Vegetarian',
  vegan:       'Vegan',
};

export default function ProfileSummaryBar() {
  const { profile, profileComplete, dailyTargets } = usePrepWeek();

  if (!profileComplete) {
    return (
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-sepia-200 rounded-xl border border-sepia-700 mb-6">
        <span className="text-sm font-medium text-sepia-warn">
          ⚠️ Profile incomplete —
        </span>
        <Link
          to="/profile"
          className="text-sm font-semibold text-sepia-warn underline hover:text-normal transition-colors"
        >
          Set up your profile to unlock calorie targets
        </Link>
      </div>
    );
  }

  const chips = [
    { label: profile.sex === 'male' ? 'Male' : 'Female' },
    { label: `${profile.age} yrs` },
    { label: `${profile.weightKg} kg` },
    { label: `${profile.heightCm} cm` },
    { label: ACTIVITY_LABELS[profile.activityLevel] ?? profile.activityLevel },
    { label: GOAL_LABELS[profile.goal] ?? profile.goal },
    { label: DIETARY_LABELS[profile.dietaryPreference] ?? 'No restriction' },
    { label: `${dailyTargets?.calories ?? '—'} kcal/day`, highlight: true },
    { label: `P: ${dailyTargets?.protein ?? '—'}g  C: ${dailyTargets?.carbs ?? '—'}g  F: ${dailyTargets?.fat ?? '—'}g` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-3 bg-sepia-200 rounded-xl border border-sepia-700 mb-6">
      {chips.map((chip, i) => (
        <span
          key={i}
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
            chip.highlight
              ? 'bg-orange-300 border-orange-400 text-normal'
              : 'bg-sepia-100 border-sepia-700 text-sepia-800'
          }`}
        >
          {chip.label}
        </span>
      ))}
      <Link
        to="/profile"
        className="ml-auto text-xs font-semibold text-sepia-warn hover:text-normal underline transition-colors"
      >
        Edit profile →
      </Link>
    </div>
  );
}
