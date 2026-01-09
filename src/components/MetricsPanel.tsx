import type { Metrics } from '../types';

interface MetricsPanelProps {
  baseline: Metrics;
  scenario?: Metrics;
}

interface MetricRowProps {
  label: string;
  baselineValue: number;
  scenarioValue?: number;
  unit: string;
  decimals?: number;
  lowerIsBetter?: boolean;
}

function MetricRow({
  label,
  baselineValue,
  scenarioValue,
  unit,
  decimals = 1,
  lowerIsBetter = true,
}: MetricRowProps) {
  const formatValue = (v: number) => v.toFixed(decimals);

  let delta: number | null = null;
  let deltaDisplay = '';
  let deltaColor = 'text-gray-500';
  let arrow = '→';

  if (scenarioValue !== undefined) {
    delta = scenarioValue - baselineValue;

    if (Math.abs(delta) < 0.05) {
      deltaDisplay = '→';
      deltaColor = 'text-gray-500';
    } else {
      const isImprovement = lowerIsBetter ? delta < 0 : delta > 0;
      arrow = delta > 0 ? '↑' : '↓';
      deltaColor = isImprovement ? 'text-green-600' : 'text-red-600';
      deltaDisplay = `${arrow}${Math.abs(delta).toFixed(decimals)}`;
    }
  }

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-600">{label}</span>
      <div className="flex items-center gap-3">
        <span className="font-medium text-gray-900">
          {formatValue(scenarioValue ?? baselineValue)} {unit}
        </span>
        {scenarioValue !== undefined && (
          <span className={`text-sm font-medium ${deltaColor} w-16 text-right`}>
            {deltaDisplay}
          </span>
        )}
      </div>
    </div>
  );
}

export function MetricsPanel({ baseline, scenario }: MetricsPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Metrics</h2>

      <div className="space-y-1">
        {/* Glucose metrics */}
        <div className="pb-3 mb-3 border-b border-gray-200">
          <MetricRow
            label="Mean Glucose"
            baselineValue={baseline.meanGlucose}
            scenarioValue={scenario?.meanGlucose}
            unit="mmol/L"
            lowerIsBetter={true}
          />
          <MetricRow
            label="Estimated A1c"
            baselineValue={baseline.estimatedA1c}
            scenarioValue={scenario?.estimatedA1c}
            unit="%"
            lowerIsBetter={true}
          />
          <MetricRow
            label="GMI"
            baselineValue={baseline.gmi}
            scenarioValue={scenario?.gmi}
            unit="%"
            lowerIsBetter={true}
          />
        </div>

        {/* Time in range metrics */}
        <div className="pb-3 mb-3 border-b border-gray-200">
          <MetricRow
            label="Time in Range"
            baselineValue={baseline.timeInRange}
            scenarioValue={scenario?.timeInRange}
            unit="%"
            decimals={0}
            lowerIsBetter={false}
          />
          <MetricRow
            label="Time Below"
            baselineValue={baseline.timeBelowRange}
            scenarioValue={scenario?.timeBelowRange}
            unit="%"
            decimals={0}
            lowerIsBetter={true}
          />
          <MetricRow
            label="Time Above"
            baselineValue={baseline.timeAboveRange}
            scenarioValue={scenario?.timeAboveRange}
            unit="%"
            decimals={0}
            lowerIsBetter={true}
          />
        </div>

        {/* Variability */}
        <MetricRow
          label="CV"
          baselineValue={baseline.coefficientOfVariation}
          scenarioValue={scenario?.coefficientOfVariation}
          unit="%"
          decimals={0}
          lowerIsBetter={true}
        />
      </div>

      {/* Legend */}
      {scenario && (
        <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
          <span className="text-green-600">Green</span> = improvement,{' '}
          <span className="text-red-600">Red</span> = worsening
        </div>
      )}
    </div>
  );
}
