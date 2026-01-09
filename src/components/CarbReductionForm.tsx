import type { CarbReductionParams } from '../types';
import { DEFAULT_MEAL_TIMES } from '../data/constants';

interface CarbReductionFormProps {
  params: CarbReductionParams;
  onChange: (params: CarbReductionParams) => void;
}

const MEAL_OPTIONS = [
  { label: 'Breakfast', value: DEFAULT_MEAL_TIMES.breakfast },
  { label: 'Lunch', value: DEFAULT_MEAL_TIMES.lunch },
  { label: 'Dinner', value: DEFAULT_MEAL_TIMES.dinner },
];

export function CarbReductionForm({
  params,
  onChange,
}: CarbReductionFormProps) {
  const handleMealTimeChange = (value: number) => {
    onChange({ ...params, mealTime: value });
  };

  const handleReductionChange = (value: number) => {
    onChange({ ...params, reductionPercent: value });
  };

  const handleDurationChange = (value: number) => {
    onChange({ ...params, spikeDuration: value });
  };

  // Find which meal option matches the current meal time
  const selectedMeal = MEAL_OPTIONS.find((m) => m.value === params.mealTime);

  return (
    <div className="space-y-4">
      {/* Meal selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Meal
        </label>
        <select
          value={params.mealTime}
          onChange={(e) => handleMealTimeChange(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          {MEAL_OPTIONS.map((meal) => (
            <option key={meal.value} value={meal.value}>
              {meal.label} ({meal.value}:00)
            </option>
          ))}
        </select>
      </div>

      {/* Reduction percentage slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Carb Reduction: {params.reductionPercent}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={params.reductionPercent}
          onChange={(e) => handleReductionChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Spike duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Spike Duration: {params.spikeDuration} hours
        </label>
        <input
          type="range"
          min="1"
          max="6"
          step="1"
          value={params.spikeDuration}
          onChange={(e) => handleDurationChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1h</span>
          <span>3h</span>
          <span>6h</span>
        </div>
      </div>

      {/* Summary */}
      <div className="text-sm text-gray-600 bg-gray-100 rounded p-2">
        Reducing carbs at {selectedMeal?.label || `${params.mealTime}:00`} by{' '}
        {params.reductionPercent}% for {params.spikeDuration} hours
      </div>
    </div>
  );
}

