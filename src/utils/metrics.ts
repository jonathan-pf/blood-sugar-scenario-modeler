import type { Metrics } from '../types';
import { TARGET_LOW, TARGET_HIGH } from '../data/constants';

/**
 * Calculate mean of an array of numbers
 */
export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Calculate standard deviation of an array of numbers
 */
export function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = calculateMean(values);
  const squaredDiffs = values.map((v) => (v - mean) ** 2);
  return Math.sqrt(squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length);
}

/**
 * Calculate estimated A1c from mean glucose (mmol/L)
 * Formula: A1c (%) = (mean_glucose_mmol × 18.05 + 46.7) / 28.7
 * This converts mmol/L to mg/dL first, then applies ADAG formula
 */
export function calculateA1c(meanGlucoseMmol: number): number {
  return (meanGlucoseMmol * 18.05 + 46.7) / 28.7;
}

/**
 * Calculate Glucose Management Indicator (GMI) from mean glucose (mmol/L)
 * Formula: GMI (%) = 3.31 + (0.4314 × mean_glucose_mmol)
 */
export function calculateGMI(meanGlucoseMmol: number): number {
  return 3.31 + 0.4314 * meanGlucoseMmol;
}

/**
 * Calculate time in range statistics
 * Returns percentages for in-range, below-range, and above-range
 */
export function calculateTimeInRange(profile: number[]): {
  inRange: number;
  below: number;
  above: number;
} {
  if (profile.length === 0) {
    return { inRange: 0, below: 0, above: 0 };
  }

  const inRangeCount = profile.filter(
    (v) => v >= TARGET_LOW && v <= TARGET_HIGH
  ).length;
  const belowCount = profile.filter((v) => v < TARGET_LOW).length;
  const aboveCount = profile.filter((v) => v > TARGET_HIGH).length;

  return {
    inRange: (inRangeCount / profile.length) * 100,
    below: (belowCount / profile.length) * 100,
    above: (aboveCount / profile.length) * 100,
  };
}

/**
 * Calculate coefficient of variation (CV)
 * CV = (standard deviation / mean) × 100
 */
export function calculateCV(values: number[]): number {
  const mean = calculateMean(values);
  if (mean === 0) return 0;
  const std = calculateStandardDeviation(values);
  return (std / mean) * 100;
}

/**
 * Calculate all metrics for a glucose profile
 */
export function calculateMetrics(profile: number[]): Metrics {
  const meanGlucose = calculateMean(profile);
  const timeStats = calculateTimeInRange(profile);

  return {
    meanGlucose,
    estimatedA1c: calculateA1c(meanGlucose),
    gmi: calculateGMI(meanGlucose),
    timeInRange: timeStats.inRange,
    timeBelowRange: timeStats.below,
    timeAboveRange: timeStats.above,
    coefficientOfVariation: calculateCV(profile),
  };
}
