import { GlucoseChart } from './components/GlucoseChart';
import { MetricsPanel } from './components/MetricsPanel';
import { InterventionPanel } from './components/InterventionPanel';
import { BaselineSelector } from './components/BaselineSelector';
import { PasswordGate } from './components/PasswordGate';
import { useAppState } from './hooks/useAppState';

function App() {
  const {
    baseline,
    baselineKey,
    baselineLabel,
    comparison,
    comparisonKey,
    comparisonLabel,
    interventions,
    scenario,
    baselineMetrics,
    comparisonMetrics,
    scenarioMetrics,
    setBaselineKey,
    setComparisonKey,
    addIntervention,
    updateInterventionParams,
    toggleIntervention,
    removeIntervention,
  } = useAppState();

  // Only show scenario if there are enabled interventions
  const hasEnabledInterventions = interventions.some((i) => i.enabled);
  const displayScenario = hasEnabledInterventions ? scenario : undefined;
  const displayScenarioMetrics = hasEnabledInterventions
    ? scenarioMetrics
    : undefined;

  return (
    <PasswordGate>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Blood Sugar Scenario Modeler
            </h1>
            <BaselineSelector
              selected={baselineKey}
              onChange={setBaselineKey}
              comparison={comparisonKey}
              onComparisonChange={setComparisonKey}
            />
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Chart and Metrics row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Chart - takes 2 columns on large screens */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                24-Hour Glucose Profile
              </h2>
              <GlucoseChart
                baseline={baseline}
                baselineLabel={baselineLabel}
                comparison={comparison ?? undefined}
                comparisonLabel={comparisonLabel ?? undefined}
                scenario={displayScenario}
              />
              <div className="mt-4 flex items-center gap-6 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-0.5 bg-gray-400"
                    style={{
                      borderStyle: 'dashed',
                      borderWidth: '1px 0 0 0',
                      borderColor: '#9ca3af',
                    }}
                  ></div>
                  <span>{baselineLabel}</span>
                </div>
                {comparison && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-purple-600"></div>
                    <span>{comparisonLabel}</span>
                  </div>
                )}
                {displayScenario && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-blue-500"></div>
                    <span>Scenario</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500/20 border border-green-500/30 rounded"></div>
                  <span>Target Range (3.9-10.0)</span>
                </div>
              </div>
            </div>

            {/* Metrics panel - takes 1 column */}
            <div>
              <MetricsPanel
                baseline={baselineMetrics}
                baselineLabel={baselineLabel}
                comparison={comparisonMetrics ?? undefined}
                comparisonLabel={comparisonLabel ?? undefined}
                scenario={displayScenarioMetrics}
              />
            </div>
          </div>

          {/* Intervention panel */}
          <InterventionPanel
            interventions={interventions}
            onAddIntervention={addIntervention}
            onUpdateParams={updateInterventionParams}
            onToggleIntervention={toggleIntervention}
            onRemoveIntervention={removeIntervention}
          />
        </main>
      </div>
    </PasswordGate>
  );
}

export default App;
