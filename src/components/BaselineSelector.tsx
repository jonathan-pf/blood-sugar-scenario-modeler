import { BASELINE_PROFILES, type BaselineProfileKey } from '../data/constants';

interface BaselineSelectorProps {
  selected: BaselineProfileKey;
  onChange: (key: BaselineProfileKey) => void;
}

export function BaselineSelector({ selected, onChange }: BaselineSelectorProps) {
  const profiles = Object.entries(BASELINE_PROFILES) as [BaselineProfileKey, typeof BASELINE_PROFILES[BaselineProfileKey]][];

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700">Baseline:</label>
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
  );
}
