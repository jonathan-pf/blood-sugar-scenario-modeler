import type { ReactNode } from 'react';

interface InterventionCardProps {
  title: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  onDelete: () => void;
  children: ReactNode;
}

export function InterventionCard({
  title,
  enabled,
  onToggle,
  onDelete,
  children,
}: InterventionCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 ${
        enabled
          ? 'border-blue-300 bg-blue-50'
          : 'border-gray-200 bg-gray-50 opacity-75'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Delete intervention"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className={enabled ? '' : 'pointer-events-none'}>{children}</div>
    </div>
  );
}
