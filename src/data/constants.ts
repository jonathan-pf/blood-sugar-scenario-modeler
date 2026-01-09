// Glucose thresholds (mmol/L)
export const GLUCOSE_UNIT = 'mmol/L';
export const TARGET_LOW = 3.9;
export const TARGET_HIGH = 10.0;
export const HYPO_THRESHOLD = 3.0;
export const HYPER_THRESHOLD = 13.9;

// Chart display bounds
export const CHART_Y_MIN = 0;
export const CHART_Y_MAX = 15;

// Default baseline profile - realistic Type 1 diabetes pattern
// Index 0 = midnight-1am, index 23 = 11pm-midnight
export const DEFAULT_BASELINE: number[] = [
  6.2,  // 00:00 - midnight
  6.0,  // 01:00
  5.8,  // 02:00
  5.7,  // 03:00
  5.9,  // 04:00 - dawn phenomenon begins
  6.4,  // 05:00
  7.0,  // 06:00
  7.8,  // 07:00 - waking, pre-breakfast rise
  9.5,  // 08:00 - breakfast spike
  10.2, // 09:00 - peak
  8.8,  // 10:00 - coming down
  7.5,  // 11:00
  7.0,  // 12:00 - pre-lunch
  8.5,  // 13:00 - lunch spike
  9.0,  // 14:00 - peak
  7.8,  // 15:00
  7.0,  // 16:00
  6.8,  // 17:00
  7.2,  // 18:00 - pre-dinner
  9.2,  // 19:00 - dinner spike
  9.8,  // 20:00 - peak
  8.5,  // 21:00
  7.5,  // 22:00
  6.8,  // 23:00
];
// Mean: ~7.6 mmol/L → A1c ~6.7%

// Default meal times (hours)
export const DEFAULT_MEAL_TIMES = {
  breakfast: 8,
  lunch: 13,
  dinner: 19,
};

// Intervention defaults
export const DEFAULT_SPIKE_DURATION = 3; // hours
