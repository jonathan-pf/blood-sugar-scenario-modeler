import type { Metrics } from '../types';

interface MetricsPanelProps {
  baseline: Metrics;
  baselineLabel?: string;
  comparison?: Metrics;
  comparisonLabel?: string;
  scenario?: Metrics;
}

interface MetricRowProps {
  label: string;
  baselineValue: number;
  comparisonValue?: number;
  scenarioValue?: number;
  unit: string;
  decimals?: number;
  lowerIsBetter?: boolean;
}

function formatDelta(
  delta: number,
  decimals: number,
  lowerIsBetter: boolean
): { display: string; color: string } {
  if (Math.abs(delta) < 0.05) {
    return { display: '→', color: 'text-gray-500' };
  }
  const isImprovement = lowerIsBetter ? delta < 0 : delta > 0;
  const arrow = delta > 0 ? '↑' : '↓';
  const color = isImprovement ? 'text-green-600' : 'text-red-600';
  return { display: `${arrow}${Math.abs(delta).toFixed(decimals)}`, color };
}

function MetricRow({
  label,
  baselineValue,
  comparisonValue,
  scenarioValue,
  unit,
  decimals = 1,
  lowerIsBetter = true,
}: MetricRowProps) {
  const formatValue = (v: number) => v.toFixed(decimals);

  // Comparison delta (comparison vs baseline)
  const comparisonDelta = comparisonValue !== undefined
    ? formatDelta(comparisonValue - baselineValue, decimals, lowerIsBetter)
    : null;

  // Scenario delta (scenario vs baseline)
  const scenarioDelta = scenarioValue !== undefined
    ? formatDelta(scenarioValue - baselineValue, decimals, lowerIsBetter)
    : null;

  // Display value: prefer scenario, then comparison, then baseline
  const displayValue = scenarioValue ?? comparisonValue ?? baselineValue;

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-900">
          {formatValue(displayValue)} {unit}
        </span>
        {comparisonDelta && !scenarioDelta && (
          <span className={`text-sm font-medium ${comparisonDelta.color} w-14 text-right`}>
            {comparisonDelta.display}
          </span>
        )}
        {scenarioDelta && (
          <span className={`text-sm font-medium ${scenarioDelta.color} w-14 text-right`}>
            {scenarioDelta.display}
          </span>
        )}
      </div>
    </div>
  );
}

export function MetricsPanel({
  baseline,
  baselineLabel = 'Baseline',
  comparison,
  comparisonLabel = 'Comparison',
  scenario,
}: MetricsPanelProps) {
  const showDelta = comparison || scenario;
  const deltaLabel = scenario ? 'Scenario' : comparisonLabel;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Metrics</h2>

      {/* Header showing what's being compared */}
      {showDelta && (
        <div className="mb-3 pb-2 border-b border-gray-200 text-sm text-gray-600">
          Comparing <span className="font-medium">{deltaLabel}</span> vs{' '}
          <span className="font-medium">{baselineLabel}</span>
        </div>
      )}

      <div className="space-y-1">
        {/* Glucose metrics */}
        <div className="pb-3 mb-3 border-b border-gray-200">
          <MetricRow
            label="Mean Glucose"
            baselineValue={baseline.meanGlucose}
            comparisonValue={comparison?.meanGlucose}
            scenarioValue={scenario?.meanGlucose}
            unit="mmol/L"
            lowerIsBetter={true}
          />
          <MetricRow
            label="Estimated A1c"
            baselineValue={baseline.estimatedA1c}
            comparisonValue={comparison?.estimatedA1c}
            scenarioValue={scenario?.estimatedA1c}
            unit="%"
            lowerIsBetter={true}
          />
          <MetricRow
            label="GMI"
            baselineValue={baseline.gmi}
            comparisonValue={comparison?.gmi}
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
            comparisonValue={comparison?.timeInRange}
            scenarioValue={scenario?.timeInRange}
            unit="%"
            decimals={0}
            lowerIsBetter={false}
          />
          <MetricRow
            label="Time Below"
            baselineValue={baseline.timeBelowRange}
            comparisonValue={comparison?.timeBelowRange}
            scenarioValue={scenario?.timeBelowRange}
            unit="%"
            decimals={0}
            lowerIsBetter={true}
          />
          <MetricRow
            label="Time Above"
            baselineValue={baseline.timeAboveRange}
            comparisonValue={comparison?.timeAboveRange}
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
          comparisonValue={comparison?.coefficientOfVariation}
          scenarioValue={scenario?.coefficientOfVariation}
          unit="%"
          decimals={0}
          lowerIsBetter={true}
        />
      </div>

      {/* Legend */}
      {showDelta && (
        <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
          <span className="text-green-600">Green</span> = improvement,{' '}
          <span className="text-red-600">Red</span> = worsening
        </div>
      )}
    </div>
  );
}
