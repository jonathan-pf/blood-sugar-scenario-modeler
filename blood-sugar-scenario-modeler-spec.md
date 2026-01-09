# Blood Sugar Scenario Modeler - Technical Specification v1.0

---

## 1. Overview

A React-based single-page application that visualises 24-hour glucose profiles and allows users to model the impact of lifestyle and treatment interventions on glycaemic control metrics.

**Design Philosophy:** Start with simple additive/multiplicative effects that are intuitive and fast to compute. The architecture should support future replacement with more physiologically realistic models without UI changes.

---

## 2. Units and Constants

```
GLUCOSE_UNIT: mmol/L
TARGET_LOW: 3.9 mmol/L
TARGET_HIGH: 10.0 mmol/L
HYPO_THRESHOLD: 3.0 mmol/L
HYPER_THRESHOLD: 13.9 mmol/L
```

**A1c Conversion Formula:**
```
A1c (%) = (mean_glucose_mmol × 18.05 + 46.7) / 28.7
```
(Converting mmol/L to mg/dL first, then applying the standard ADAG formula)

**GMI Formula:**
```
GMI (%) = 3.31 + (0.02392 × mean_glucose_mg_dl)
GMI (%) = 3.31 + (0.4314 × mean_glucose_mmol)
```

---

## 3. Data Structures

### 3.1 Glucose Profile

```typescript
interface GlucoseProfile {
  hourlyAverages: number[]; // 24 values, index 0 = midnight-1am
  label: string;
  isBaseline: boolean;
}
```

### 3.2 Default Baseline Profile

A realistic Type 1 diabetes profile with:
- Dawn phenomenon (rise from ~5am)
- Post-breakfast spike (~8-10am)
- Post-lunch spike (~1-2pm)
- Post-dinner spike (~7-9pm)
- Overnight stability

```typescript
const DEFAULT_BASELINE: number[] = [
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
```

### 3.3 Intervention

```typescript
interface Intervention {
  id: string;
  type: InterventionType;
  enabled: boolean;
  parameters: InterventionParams;
}

type InterventionType = 
  | 'carb_reduction'
  | 'bolus_timing'
  | 'basal_adjustment'
  | 'meal_skip'
  | 'exercise';

interface CarbReductionParams {
  mealTime: number;        // hour (0-23)
  reductionPercent: number; // 0-100
  spikeDuration: number;   // hours affected (default: 3)
}

interface BolusTimingParams {
  mealTime: number;        // hour (0-23)
  preBolusMinutes: number; // how early before meal (-30 to +30)
  // negative = before meal, positive = after
}

interface BasalAdjustmentParams {
  startHour: number;       // 0-23
  endHour: number;         // 0-23
  changePercent: number;   // -50 to +50
}

interface MealSkipParams {
  mealTime: number;        // hour of meal normally eaten
  spikeReduction: number;  // mmol/L reduction at peak (auto-calculated or override)
}

interface ExerciseParams {
  startHour: number;       // when exercise occurs
  durationMinutes: number; // 15-120
  intensity: 'light' | 'moderate' | 'vigorous';
  // Effect: immediate drop + extended sensitivity improvement
}
```

---

## 4. Intervention Effect Models (v1 - Simple)

All effects are applied as modifications to the baseline hourly values.

### 4.1 Carb Reduction

Reduces the post-meal spike proportionally. Affects the meal hour and subsequent hours within the spike duration.

```
For hours in [mealTime, mealTime + spikeDuration]:
  spike_above_baseline = baseline[hour] - pre_meal_value
  reduction = spike_above_baseline × (reductionPercent / 100)
  modified[hour] = baseline[hour] - reduction
```

**Pre-meal value:** The glucose at mealTime - 1 (or mealTime if meal is at midnight).

### 4.2 Bolus Timing (Pre-bolus Effect)

Shifts and flattens the spike curve. Pre-bolusing reduces peak height; late bolusing increases it.

```
peak_modification_factor = 1 - (preBolusMinutes / 60) × 0.5
// -30 min pre-bolus → factor 0.75 (25% lower peak)
// +30 min late bolus → factor 1.25 (25% higher peak)

Apply to spike hours similar to carb reduction.
```

### 4.3 Basal Adjustment

Applies a flat offset to all hours in the range.

```
For hours in [startHour, endHour]:
  // Increasing basal lowers glucose
  offset = average_baseline × (changePercent / 100) × -0.5
  modified[hour] = baseline[hour] + offset
```

The 0.5 factor reflects that basal is only part of total insulin; this is a simplification.

### 4.4 Meal Skip

Removes the meal spike entirely, replacing with a flat-ish profile.

```
For hours in [mealTime, mealTime + 3]:
  modified[hour] = pre_meal_value + small_drift
  // small_drift can be 0 in v1
```

### 4.5 Exercise

Immediate glucose drop during/after exercise, plus extended sensitivity benefit.

```
Immediate effect (exercise hour + 1 hour after):
  drop = intensity_factor × duration_factor
  // light: 0.5, moderate: 1.0, vigorous: 1.5 mmol/L base
  // duration_factor: duration / 60

Extended effect (next 12-24 hours):
  all values reduced by 0.2-0.5 mmol/L (intensity-dependent)
```

---

## 5. Metrics Calculation

```typescript
interface Metrics {
  meanGlucose: number;      // mmol/L
  estimatedA1c: number;     // %
  gmi: number;              // %
  timeInRange: number;      // % (3.9-10.0)
  timeBelowRange: number;   // % (<3.9)
  timeAboveRange: number;   // % (>10.0)
  coefficientOfVariation: number; // %
}

function calculateMetrics(profile: number[]): Metrics {
  const mean = profile.reduce((a, b) => a + b) / 24;
  const std = Math.sqrt(
    profile.reduce((sum, v) => sum + (v - mean) ** 2, 0) / 24
  );
  
  const inRange = profile.filter(v => v >= 3.9 && v <= 10.0).length;
  const belowRange = profile.filter(v => v < 3.9).length;
  const aboveRange = profile.filter(v => v > 10.0).length;
  
  return {
    meanGlucose: mean,
    estimatedA1c: (mean * 18.05 + 46.7) / 28.7,
    gmi: 3.31 + 0.4314 * mean,
    timeInRange: (inRange / 24) * 100,
    timeBelowRange: (belowRange / 24) * 100,
    timeAboveRange: (aboveRange / 24) * 100,
    coefficientOfVariation: (std / mean) * 100,
  };
}
```

---

## 6. UI Components

### 6.1 Layout

```
+-------------------------------------------------------+
|  Header: "Blood Sugar Scenario Modeler"               |
+---------------------------+---------------------------+
|                           |                           |
|   CHART AREA              |   METRICS PANEL           |
|   (24-hour line chart)    |   - Mean glucose          |
|                           |   - A1c / GMI             |
|   - Grey dashed: baseline |   - TIR / TAR / TBR       |
|   - Blue solid: scenario  |   - CV                    |
|   - Green band: target    |                           |
|                           |   (shows Δ from baseline) |
+---------------------------+---------------------------+
|                                                       |
|   BASELINE EDITOR                                     |
|   [Use Default] [Enter Custom Values]                 |
|   (24 number inputs or paste JSON)                    |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|   INTERVENTION PANEL                                  |
|   [+ Add Intervention]                                |
|                                                       |
|   +-- Carb Reduction ----+  +-- Basal Adjustment ---+ |
|   | Meal: [Breakfast ▼]  |  | Start: [05:00]        | |
|   | Reduction: [---○---] |  | End:   [08:00]        | |
|   | 30%                  |  | Change: [+15%]        | |
|   | [×]                  |  | [×]                   | |
|   +----------------------+  +-----------------------+ |
|                                                       |
+-------------------------------------------------------+
```

### 6.2 Chart Specifications

- **Library:** Recharts (already available in artifacts)
- **X-axis:** Hours 0-23, labelled as "00:00", "06:00", "12:00", "18:00"
- **Y-axis:** 0-15 mmol/L (auto-scale if needed)
- **Target band:** Semi-transparent green rectangle from y=3.9 to y=10.0
- **Baseline:** Grey dashed line, 2px
- **Scenario:** Blue solid line, 2px
- **Hover:** Tooltip showing hour, baseline value, scenario value, and delta

### 6.3 Metrics Panel

Display format:
```
Mean Glucose:    7.2 mmol/L   (↓0.4)
Estimated A1c:   6.5%         (↓0.2)
GMI:             6.4%         (↓0.2)

Time in Range:   78%          (↑8%)
Time Below:      2%           (→)
Time Above:      20%          (↓8%)

CV:              24%          (↓3%)
```

Arrows/deltas colour-coded: green for improvements, red for worsening, grey for no change.

---

## 7. State Management

```typescript
interface AppState {
  baseline: number[];           // 24 hourly values
  interventions: Intervention[];
  scenario: number[];           // computed from baseline + interventions
  baselineMetrics: Metrics;
  scenarioMetrics: Metrics;
  showCustomBaselineEditor: boolean;
}
```

**Computation flow:**
1. User modifies baseline or interventions
2. `computeScenario(baseline, interventions)` runs
3. Both `baselineMetrics` and `scenarioMetrics` recalculated
4. UI updates

---

## 8. Implementation Phases

### Phase 1 (MVP)

- Default baseline display
- Chart with target band
- Metrics panel (baseline only)
- Single intervention type: Carb Reduction
- Before/after comparison

### Phase 2

- Custom baseline entry (24 inputs + paste JSON)
- All 5 intervention types
- Multiple simultaneous interventions
- Delta display in metrics

### Phase 3

- Intervention stacking visualisation (contribution of each)
- Profile templates (choose from common patterns)
- Export/import scenarios
- Higher-resolution internal model (15-min intervals, display as hourly averages)

---

## 9. Future Considerations (Not v1)

- **Physiological curves:** Replace simple offsets with proper glucose/insulin kinetic models
- **CGM data import:** Parse Libre/Dexcom exports
- **Variability modelling:** Show not just mean but expected range at each hour
- **Hypo risk scoring:** Weight time-below-range more heavily
- **Multi-day effects:** Model how consistent changes compound over weeks

---

## 10. Open Questions

1. **Meal times:** Should we hard-code breakfast/lunch/dinner times, or let users define their own meal schedule in baseline setup?

2. **Intervention overlap:** If two interventions affect the same hour, do we sum the effects, multiply, or use a more complex interaction model?

3. **Validation bounds:** Should we clamp glucose values to physiological limits (e.g., 2.0-25.0 mmol/L) to prevent unrealistic scenarios?
