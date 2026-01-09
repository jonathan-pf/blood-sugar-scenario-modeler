import { useState, useMemo, useCallback } from 'react';
import type { Intervention, Metrics, CarbReductionParams } from '../types';
import { BASELINE_PROFILES, type BaselineProfileKey } from '../data/constants';
import { calculateMetrics } from '../utils/metrics';
import { computeScenario } from '../utils/interventions';

interface AppState {
  baselineKey: BaselineProfileKey;
  interventions: Intervention[];
}

interface UseAppStateReturn {
  // State
  baseline: number[];
  baselineKey: BaselineProfileKey;
  interventions: Intervention[];
  scenario: number[];
  baselineMetrics: Metrics;
  scenarioMetrics: Metrics;

  // Actions
  setBaselineKey: (key: BaselineProfileKey) => void;
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
    interventions: [],
  });

  // Get actual baseline data from the key
  const baseline = BASELINE_PROFILES[state.baselineKey].data;

  // Compute scenario whenever baseline or interventions change
  const scenario = useMemo(
    () => computeScenario(baseline, state.interventions),
    [baseline, state.interventions]
  );

  // Calculate metrics for baseline and scenario
  const baselineMetrics = useMemo(
    () => calculateMetrics(baseline),
    [baseline]
  );

  const scenarioMetrics = useMemo(
    () => calculateMetrics(scenario),
    [scenario]
  );

  // Actions
  const setBaselineKey = useCallback((key: BaselineProfileKey) => {
    setState((prev) => ({ ...prev, baselineKey: key }));
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
      interventions: [],
    });
  }, []);

  return {
    baseline,
    baselineKey: state.baselineKey,
    interventions: state.interventions,
    scenario,
    baselineMetrics,
    scenarioMetrics,
    setBaselineKey,
    addIntervention,
    updateIntervention,
    updateInterventionParams,
    removeIntervention,
    toggleIntervention,
    resetToDefault,
  };
}
