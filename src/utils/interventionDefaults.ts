import type { CarbReductionParams } from '../types';
import { DEFAULT_MEAL_TIMES, DEFAULT_SPIKE_DURATION } from '../data/constants';

/**
 * Create default parameters for a new carb reduction intervention
 */
export function createDefaultCarbReductionParams(): CarbReductionParams {
  return {
    mealTime: DEFAULT_MEAL_TIMES.breakfast,
    reductionPercent: 30,
    spikeDuration: DEFAULT_SPIKE_DURATION,
  };
}
