import { BASELINE_PROFILES, type BaselineProfileKey } from '../data/constants';

interface BaselineSelectorProps {
  selected: BaselineProfileKey;
  onChange: (key: BaselineProfileKey) => void;
  comparison: BaselineProfileKey | null;
  onComparisonChange: (key: BaselineProfileKey | null) => void;
}

export function BaselineSelector({
  selected,
  onChange,
  comparison,
  onComparisonChange,
}: BaselineSelectorProps) {
  const profiles = Object.entries(BASELINE_PROFILES) as [BaselineProfileKey, typeof BASELINE_PROFILES[BaselineProfileKey]][];

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Profile:</label>
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value as BaselineProfileKey)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {profiles.map(([key, profile]) => (
            <option key={key} value={key}>
              {profile.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Compare to:</label>
        <select
          value={comparison || ''}
          onChange={(e) => onComparisonChange(e.target.value ? e.target.value as BaselineProfileKey : null)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white"
        >
          <option value="">None</option>
          {profiles
            .filter(([key]) => key !== selected)
            .map(([key, profile]) => (
              <option key={key} value={key}>
                {profile.label}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
