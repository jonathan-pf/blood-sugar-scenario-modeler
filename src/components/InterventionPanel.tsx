import type { Intervention, CarbReductionParams } from '../types';
import { InterventionCard } from './InterventionCard';
import { CarbReductionForm } from './CarbReductionForm';
import { createDefaultCarbReductionParams } from '../utils/interventionDefaults';

interface InterventionPanelProps {
  interventions: Intervention[];
  onAddIntervention: (intervention: Intervention) => void;
  onUpdateParams: (id: string, params: CarbReductionParams) => void;
  onToggleIntervention: (id: string, enabled: boolean) => void;
  onRemoveIntervention: (id: string) => void;
}

export function InterventionPanel({
  interventions,
  onAddIntervention,
  onUpdateParams,
  onToggleIntervention,
  onRemoveIntervention,
}: InterventionPanelProps) {
  const handleAddCarbReduction = () => {
    const newIntervention: Intervention = {
      id: `carb_${Date.now()}`,
      type: 'carb_reduction',
      enabled: true,
      parameters: createDefaultCarbReductionParams(),
    };
    onAddIntervention(newIntervention);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Interventions</h2>
        <button
          onClick={handleAddCarbReduction}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Carb Reduction
        </button>
      </div>

      {interventions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No interventions added. Click "Add Carb Reduction" to model the effect
          of reducing carbohydrates at a meal.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interventions.map((intervention) => (
            <InterventionCard
              key={intervention.id}
              title="Carb Reduction"
              enabled={intervention.enabled}
              onToggle={(enabled) =>
                onToggleIntervention(intervention.id, enabled)
              }
              onDelete={() => onRemoveIntervention(intervention.id)}
            >
              {intervention.type === 'carb_reduction' && (
                <CarbReductionForm
                  params={intervention.parameters as CarbReductionParams}
                  onChange={(params) => onUpdateParams(intervention.id, params)}
                />
              )}
            </InterventionCard>
          ))}
        </div>
      )}
    </div>
  );
}
