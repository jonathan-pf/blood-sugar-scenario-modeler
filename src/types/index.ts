// Glucose Profile - 24 hourly average values
export interface GlucoseProfile {
  hourlyAverages: number[]; // 24 values, index 0 = midnight-1am
  label: string;
  isBaseline: boolean;
}

// Metrics calculated from a glucose profile
export interface Metrics {
  meanGlucose: number;           // mmol/L
  estimatedA1c: number;          // %
  gmi: number;                   // %
  timeInRange: number;           // % (3.9-10.0)
  timeBelowRange: number;        // % (<3.9)
  timeAboveRange: number;        // % (>10.0)
  coefficientOfVariation: number; // %
}

// Intervention types
export type InterventionType =
  | 'carb_reduction'
  | 'bolus_timing'
  | 'basal_adjustment'
  | 'meal_skip'
  | 'exercise';

// Intervention parameter types
export interface CarbReductionParams {
  mealTime: number;         // hour (0-23)
  reductionPercent: number; // 0-100
  spikeDuration: number;    // hours affected (default: 3)
}

export interface BolusTimingParams {
  mealTime: number;         // hour (0-23)
  preBolusMinutes: number;  // how early before meal (-30 to +30)
}

export interface BasalAdjustmentParams {
  startHour: number;        // 0-23
  endHour: number;          // 0-23
  changePercent: number;    // -50 to +50
}

export interface MealSkipParams {
  mealTime: number;         // hour of meal normally eaten
  spikeReduction: number;   // mmol/L reduction at peak
}

export interface ExerciseParams {
  startHour: number;        // when exercise occurs
  durationMinutes: number;  // 15-120
  intensity: 'light' | 'moderate' | 'vigorous';
}

// Union type for all intervention parameters
export type InterventionParams =
  | CarbReductionParams
  | BolusTimingParams
  | BasalAdjustmentParams
  | MealSkipParams
  | ExerciseParams;

// Generic intervention with type discrimination
export interface Intervention<T extends InterventionType = InterventionType> {
  id: string;
  type: T;
  enabled: boolean;
  parameters: T extends 'carb_reduction'
    ? CarbReductionParams
    : T extends 'bolus_timing'
    ? BolusTimingParams
    : T extends 'basal_adjustment'
    ? BasalAdjustmentParams
    : T extends 'meal_skip'
    ? MealSkipParams
    : T extends 'exercise'
    ? ExerciseParams
    : InterventionParams;
}

// App state
export interface AppState {
  baseline: number[];             // 24 hourly values
  interventions: Intervention[];
  scenario: number[];             // computed from baseline + interventions
  baselineMetrics: Metrics;
  scenarioMetrics: Metrics;
  showCustomBaselineEditor: boolean;
}
