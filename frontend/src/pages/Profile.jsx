import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrepWeek } from '../context/PrepWeekContext';

export default function Profile() {
  const { profile, setProfile, isProfileComplete } = usePrepWeek();
  const navigate = useNavigate();

  // Local state for editing
  const [formData, setFormData] = useState(profile);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue = value;
    
    // Parse numbers
    if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfile(formData);
    setSaved(true);
    setTimeout(() => {
      navigate('/prepweek');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-display text-sepia-900 mb-2">Your Profile</h1>
      <p className="text-sepia-800 mb-8">
        We need a few details to calculate your daily calorie and macro targets. 
        Your data is saved locally on your device.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-orange-50 p-6 rounded-xl shadow-box-up border border-sepia-200">
        
        {/* Basic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-sm font-bold text-sepia-900 mb-1">Sex</label>
            <select 
              name="sex" 
              value={formData.sex} 
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-sepia-300 rounded-lg bg-white text-sepia-900 focus:outline-none focus:ring-2 focus:ring-sepia-400"
            >
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-sepia-900 mb-1">Age</label>
            <input 
              type="number" 
              name="age" 
              value={formData.age} 
              onChange={handleChange}
              required
              min="16" max="120"
              className="w-full px-3 py-2 border border-sepia-300 rounded-lg bg-white text-sepia-900 focus:outline-none focus:ring-2 focus:ring-sepia-400"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-sepia-900 mb-1">Weight (kg)</label>
            <input 
              type="number" 
              name="weightKg" 
              value={formData.weightKg} 
              onChange={handleChange}
              required
              min="30" max="300" step="0.1"
              className="w-full px-3 py-2 border border-sepia-300 rounded-lg bg-white text-sepia-900 focus:outline-none focus:ring-2 focus:ring-sepia-400"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-sepia-900 mb-1">Height (cm)</label>
            <input 
              type="number" 
              name="heightCm" 
              value={formData.heightCm} 
              onChange={handleChange}
              required
              min="100" max="250"
              className="w-full px-3 py-2 border border-sepia-300 rounded-lg bg-white text-sepia-900 focus:outline-none focus:ring-2 focus:ring-sepia-400"
            />
          </div>
        </div>

        <hr className="border-sepia-300" />

        {/* Goals & Lifestyle */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-sepia-900 mb-1">Activity Level</label>
            <select 
              name="activityLevel" 
              value={formData.activityLevel} 
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-sepia-300 rounded-lg bg-white text-sepia-900 focus:outline-none focus:ring-2 focus:ring-sepia-400"
            >
              <option value="">Select...</option>
              <option value="sedentary">Sedentary (office job, little/no exercise)</option>
              <option value="lightly_active">Lightly active (light exercise 1-3 days/week)</option>
              <option value="moderately_active">Moderately active (moderate exercise 3-5 days/week)</option>
              <option value="very_active">Very active (hard exercise 6-7 days/week)</option>
              <option value="extra_active">Extra active (very hard exercise/physical job)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-sepia-900 mb-1">Goal</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: 'deficit', label: 'Fat loss (-20%)' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'surplus', label: 'Muscle gain (+15%)' }
              ].map(option => (
                <label 
                  key={option.value}
                  className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-colors text-sm font-semibold text-center
                    ${formData.goal === option.value 
                      ? 'border-sepia-800 bg-orange-200 text-sepia-900' 
                      : 'border-sepia-300 bg-white text-sepia-700 hover:border-sepia-400'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="goal"
                    value={option.value}
                    checked={formData.goal === option.value}
                    onChange={handleChange}
                    className="sr-only"
                    required
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-sepia-300" />

        {/* Dietary Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-sepia-900 mb-1">Dietary Preference</label>
            <select 
              name="dietaryPreference" 
              value={formData.dietaryPreference} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-sepia-300 rounded-lg bg-white text-sepia-900 focus:outline-none focus:ring-2 focus:ring-sepia-400"
            >
              <option value="none">No restriction</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-sepia-900 mb-1">Default Meals/Day</label>
            <select 
              name="defaultMealsPerDay" 
              value={formData.defaultMealsPerDay} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-sepia-300 rounded-lg bg-white text-sepia-900 focus:outline-none focus:ring-2 focus:ring-sepia-400"
            >
              <option value="3">3 (Breakfast, Lunch, Dinner)</option>
              <option value="4">4 (+1 Snack)</option>
              <option value="5">5 (+2 Snacks)</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-green-600">
            {saved && "Saved successfully! Redirecting..."}
          </span>
          <button 
            type="submit"
            className="px-8 py-3 bg-sepia-800 text-white font-bold rounded-full hover:bg-sepia-900 transition-colors shadow-sm"
          >
            Save Profile
          </button>
        </div>

      </form>
    </div>
  );
}
