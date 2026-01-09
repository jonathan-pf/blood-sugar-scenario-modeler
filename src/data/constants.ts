// Glucose thresholds (mmol/L)
export const GLUCOSE_UNIT = 'mmol/L';
export const TARGET_LOW = 3.9;
export const TARGET_HIGH = 10.0;
export const HYPO_THRESHOLD = 3.0;
export const HYPER_THRESHOLD = 13.9;

// Chart display bounds
export const CHART_Y_MIN = 0;
export const CHART_Y_MAX = 17;

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

// Q4 2025 profiles from real CGM data
// Data from Oct-Dec 2025, ~28,400 readings over 93 days

export const Q4_AVERAGE: number[] = [
  11.36, // 00:00
  10.80, // 01:00
  10.58, // 02:00
  10.76, // 03:00
  10.76, // 04:00
  10.39, // 05:00
  10.06, // 06:00
  10.04, // 07:00
  10.09, // 08:00
  9.63,  // 09:00
  8.95,  // 10:00
  8.17,  // 11:00
  8.01,  // 12:00 - lowest point
  8.59,  // 13:00
  10.34, // 14:00 - afternoon spike
  11.02, // 15:00
  10.39, // 16:00
  9.33,  // 17:00
  8.59,  // 18:00
  8.73,  // 19:00
  9.49,  // 20:00
  10.49, // 21:00
  11.09, // 22:00
  11.65, // 23:00
];
// Mean: 9.97 mmol/L → A1c ~7.9%, TIR 38%

export const Q4_BEST_10: number[] = [
  7.96,  // 00:00
  6.80,  // 01:00
  7.43,  // 02:00
  7.33,  // 03:00
  7.15,  // 04:00
  7.00,  // 05:00
  6.92,  // 06:00
  7.26,  // 07:00
  6.94,  // 08:00
  7.48,  // 09:00
  7.42,  // 10:00
  6.96,  // 11:00
  7.64,  // 12:00
  6.98,  // 13:00
  8.78,  // 14:00
  8.42,  // 15:00
  8.22,  // 16:00
  7.80,  // 17:00
  6.74,  // 18:00 - lowest
  7.46,  // 19:00
  8.79,  // 20:00
  8.62,  // 21:00
  9.18,  // 22:00
  9.44,  // 23:00
];
// Mean: 7.70 mmol/L → A1c ~6.5%, TIR 100%

export const Q4_WORST_10: number[] = [
  13.43, // 00:00
  14.93, // 01:00
  14.06, // 02:00
  15.40, // 03:00
  16.00, // 04:00
  16.12, // 05:00 - highest
  15.70, // 06:00
  14.98, // 07:00
  14.39, // 08:00
  12.12, // 09:00
  9.95,  // 10:00
  9.20,  // 11:00
  8.50,  // 12:00
  7.74,  // 13:00 - lowest
  9.09,  // 14:00
  12.37, // 15:00
  12.67, // 16:00
  12.58, // 17:00
  12.43, // 18:00
  11.89, // 19:00
  12.13, // 20:00
  13.58, // 21:00
  13.74, // 22:00
  13.33, // 23:00
];
// Mean: 12.76 mmol/L → A1c ~9.7%, TIR 21%

// Q4 Average with better morning correction
// Same as Q4 Average but with correction on waking to reach target by mid-morning
export const Q4_BETTER_MORNING: number[] = [
  11.36, // 00:00 - same overnight
  10.80, // 01:00
  10.58, // 02:00
  10.76, // 03:00
  10.76, // 04:00
  10.39, // 05:00
  10.06, // 06:00
  9.50,  // 07:00 - wake & correct
  8.50,  // 08:00 - coming down
  7.50,  // 09:00 - continuing to drop
  7.00,  // 10:00 - reaching target
  6.00,  // 11:00 - at target
  6.00,  // 12:00 - holding steady
  6.00,  // 13:00 - holding until lunch, then rejoins
  10.34, // 14:00 - afternoon spike (same as average)
  11.02, // 15:00
  10.39, // 16:00
  9.33,  // 17:00
  8.59,  // 18:00
  8.73,  // 19:00
  9.49,  // 20:00
  10.49, // 21:00
  11.09, // 22:00
  11.65, // 23:00
];
// Improved morning → lower mean, better TIR

// Profile options for baseline selector
export const BASELINE_PROFILES = {
  default: {
    label: 'Example (Well Controlled)',
    data: DEFAULT_BASELINE,
  },
  q4Average: {
    label: 'Q4 2025 Average',
    data: Q4_AVERAGE,
  },
  q4Best: {
    label: 'Q4 2025 Best 10%',
    data: Q4_BEST_10,
  },
  q4Worst: {
    label: 'Q4 2025 Worst 10%',
    data: Q4_WORST_10,
  },
  q4BetterMorning: {
    label: 'Q4 + Better Morning Correction',
    data: Q4_BETTER_MORNING,
  },
} as const;

export type BaselineProfileKey = keyof typeof BASELINE_PROFILES;
