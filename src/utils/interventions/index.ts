import type { Intervention, CarbReductionParams } from '../../types';
import { applyCarbReduction } from './carbReduction';

/**
 * Apply a single intervention to a glucose profile
 */
export function applyIntervention(
  baseline: number[],
  intervention: Intervention
): number[] {
  if (!intervention.enabled) {
    return baseline;
  }

  switch (intervention.type) {
    case 'carb_reduction':
      return applyCarbReduction(
        baseline,
        intervention.parameters as CarbReductionParams
      );

    // Future intervention types will be added here
    case 'bolus_timing':
    case 'basal_adjustment':
    case 'meal_skip':
    case 'exercise':
      // Not implemented yet - return baseline unchanged
      return baseline;

    default:
      return baseline;
  }
}

/**
 * Compute the scenario profile by applying all enabled interventions
 * to the baseline profile.
 *
 * Interventions are applied sequentially - each intervention modifies
 * the result of the previous one.
 */
export function computeScenario(
  baseline: number[],
  interventions: Intervention[]
): number[] {
  // Filter to only enabled interventions
  const enabledInterventions = interventions.filter((i) => i.enabled);

  // Apply interventions sequentially
  return enabledInterventions.reduce(
    (profile, intervention) => applyIntervention(profile, intervention),
    baseline
  );
}

export { applyCarbReduction } from './carbReduction';
