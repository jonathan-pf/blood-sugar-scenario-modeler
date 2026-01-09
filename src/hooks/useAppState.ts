import { useState, useMemo, useCallback } from 'react';
import type { Intervention, Metrics, CarbReductionParams } from '../types';
import { DEFAULT_BASELINE } from '../data/constants';
import { calculateMetrics } from '../utils/metrics';
import { computeScenario } from '../utils/interventions';

interface AppState {
  baseline: number[];
  interventions: Intervention[];
}

interface UseAppStateReturn {
  // State
  baseline: number[];
  interventions: Intervention[];
  scenario: number[];
  baselineMetrics: Metrics;
  scenarioMetrics: Metrics;

  // Actions
  setBaseline: (baseline: number[]) => void;
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
    baseline: DEFAULT_BASELINE,
    interventions: [],
  });

  // Compute scenario whenever baseline or interventions change
  const scenario = useMemo(
    () => computeScenario(state.baseline, state.interventions),
    [state.baseline, state.interventions]
  );

  // Calculate metrics for baseline and scenario
  const baselineMetrics = useMemo(
    () => calculateMetrics(state.baseline),
    [state.baseline]
  );

  const scenarioMetrics = useMemo(
    () => calculateMetrics(scenario),
    [scenario]
  );

  // Actions
  const setBaseline = useCallback((baseline: number[]) => {
    setState((prev) => ({ ...prev, baseline }));
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
      baseline: DEFAULT_BASELINE,
      interventions: [],
    });
  }, []);

  return {
    baseline: state.baseline,
    interventions: state.interventions,
    scenario,
    baselineMetrics,
    scenarioMetrics,
    setBaseline,
    addIntervention,
    updateIntervention,
    updateInterventionParams,
    removeIntervention,
    toggleIntervention,
    resetToDefault,
  };
}
