import type { CarbReductionParams } from '../../types';

/**
 * Apply carb reduction effect to a glucose profile.
 *
 * Reduces the post-meal spike proportionally. Affects the meal hour and
 * subsequent hours within the spike duration.
 *
 * Algorithm:
 * For hours in [mealTime, mealTime + spikeDuration]:
 *   spike_above_baseline = baseline[hour] - pre_meal_value
 *   reduction = spike_above_baseline × (reductionPercent / 100)
 *   modified[hour] = baseline[hour] - reduction
 *
 * @param baseline - The 24-hour baseline glucose profile
 * @param params - Carb reduction parameters
 * @returns Modified 24-hour glucose profile
 */
export function applyCarbReduction(
  baseline: number[],
  params: CarbReductionParams
): number[] {
  const { mealTime, reductionPercent, spikeDuration } = params;

  // Clone the baseline array
  const modified = [...baseline];

  // Get pre-meal value (hour before meal, or meal time if at midnight)
  const preMealHour = mealTime > 0 ? mealTime - 1 : 0;
  const preMealValue = baseline[preMealHour];

  // Apply reduction to meal time and subsequent hours
  for (let i = 0; i < spikeDuration; i++) {
    const hour = (mealTime + i) % 24; // Wrap around midnight

    // Calculate spike above pre-meal value
    const spikeAboveBaseline = baseline[hour] - preMealValue;

    // Only reduce if there's a positive spike
    if (spikeAboveBaseline > 0) {
      const reduction = spikeAboveBaseline * (reductionPercent / 100);
      modified[hour] = baseline[hour] - reduction;
    }
  }

  return modified;
}
