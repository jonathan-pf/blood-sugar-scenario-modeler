import { useState, useMemo, useCallback } from 'react';
import type { Intervention, Metrics, CarbReductionParams } from '../types';
import { BASELINE_PROFILES, type BaselineProfileKey } from '../data/constants';
import { calculateMetrics } from '../utils/metrics';
import { computeScenario } from '../utils/interventions';

interface AppState {
  baselineKey: BaselineProfileKey;
  comparisonKey: BaselineProfileKey | null;
  interventions: Intervention[];
}

interface UseAppStateReturn {
  // State
  baseline: number[];
  baselineKey: BaselineProfileKey;
  baselineLabel: string;
  comparison: number[] | null;
  comparisonKey: BaselineProfileKey | null;
  comparisonLabel: string | null;
  interventions: Intervention[];
  scenario: number[];
  baselineMetrics: Metrics;
  comparisonMetrics: Metrics | null;
  scenarioMetrics: Metrics;

  // Actions
  setBaselineKey: (key: BaselineProfileKey) => void;
  setComparisonKey: (key: BaselineProfileKey | null) => void;
  addIntervention: (intervention: Intervention) => void;
  updateIntervention: (id: string, updates: Partial<Intervention>) => void;
  updateInterventionParams: (
    id: string,
    params: CarbReductionParams
  ) => void;
  removeIntervention: (id: string) => void;
  toggleIntervention: (id: string, enabled: boolean) => void;
  resetToDefault: () => void;
}

/**
 * Generate a unique ID for interventions
 */
function generateId(): string {
  return `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Custom hook for managing application state
 */
export function useAppState(): UseAppStateReturn {
  const [state, setState] = useState<AppState>({
    baselineKey: 'q4Average',
    comparisonKey: null,
    interventions: [],
  });

  // Get actual baseline data from the key
  const baseline = BASELINE_PROFILES[state.baselineKey].data;
  const baselineLabel = BASELINE_PROFILES[state.baselineKey].label;

  // Get comparison data if set
  const comparison = state.comparisonKey
    ? BASELINE_PROFILES[state.comparisonKey].data
    : null;
  const comparisonLabel = state.comparisonKey
    ? BASELINE_PROFILES[state.comparisonKey].label
    : null;

  // Compute scenario whenever baseline or interventions change
  const scenario = useMemo(
    () => computeScenario(baseline, state.interventions),
    [baseline, state.interventions]
  );

  // Calculate metrics for baseline, comparison, and scenario
  const baselineMetrics = useMemo(
    () => calculateMetrics(baseline),
    [baseline]
  );

  const comparisonMetrics = useMemo(
    () => (comparison ? calculateMetrics(comparison) : null),
    [comparison]
  );

  const scenarioMetrics = useMemo(
    () => calculateMetrics(scenario),
    [scenario]
  );

  // Actions
  const setBaselineKey = useCallback((key: BaselineProfileKey) => {
    setState((prev) => ({
      ...prev,
      baselineKey: key,
      // Clear comparison if it matches the new baseline
      comparisonKey: prev.comparisonKey === key ? null : prev.comparisonKey,
    }));
  }, []);

  const setComparisonKey = useCallback((key: BaselineProfileKey | null) => {
    setState((prev) => ({ ...prev, comparisonKey: key }));
  }, []);

  const addIntervention = useCallback((intervention: Omit<Intervention, 'id'> & { id?: string }) => {
    const newIntervention: Intervention = {
      ...intervention,
      id: intervention.id || generateId(),
    };
    setState((prev) => ({
      ...prev,
      interventions: [...prev.interventions, newIntervention],
    }));
  }, []);

  const updateIntervention = useCallback(
    (id: string, updates: Partial<Intervention>) => {
      setState((prev) => ({
        ...prev,
        interventions: prev.interventions.map((int) =>
          int.id === id ? { ...int, ...updates } : int
        ),
      }));
    },
    []
  );

  const updateInterventionParams = useCallback(
    (id: string, params: CarbReductionParams) => {
      setState((prev) => ({
        ...prev,
        interventions: prev.interventions.map((int) =>
          int.id === id ? { ...int, parameters: params } : int
        ),
      }));
    },
    []
  );

  const removeIntervention = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      interventions: prev.interventions.filter((int) => int.id !== id),
    }));
  }, []);

  const toggleIntervention = useCallback((id: string, enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      interventions: prev.interventions.map((int) =>
        int.id === id ? { ...int, enabled } : int
      ),
    }));
  }, []);

  const resetToDefault = useCallback(() => {
    setState({
      baselineKey: 'q4Average',
      comparisonKey: null,
      interventions: [],
    });
  }, []);

  return {
    baseline,
    baselineKey: state.baselineKey,
    baselineLabel,
    comparison,
    comparisonKey: state.comparisonKey,
    comparisonLabel,
    interventions: state.interventions,
    scenario,
    baselineMetrics,
    comparisonMetrics,
    scenarioMetrics,
    setBaselineKey,
    setComparisonKey,
    addIntervention,
    updateIntervention,
    updateInterventionParams,
    removeIntervention,
    toggleIntervention,
    resetToDefault,
  };
}
