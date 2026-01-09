# Implementation Plan - Blood Sugar Scenario Modeler

## Stage 1: Project Setup

1. Initialize React project with Vite + TypeScript
   ```bash
   npm create vite@latest . -- --template react-ts
   npm install
   ```

2. Install dependencies
   ```bash
   npm install recharts
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. Set up project structure
   ```
   src/
   ├── components/
   ├── types/
   ├── utils/
   ├── hooks/
   └── data/
   ```

---

## Stage 2: Core Types and Constants

1. Create `src/types/index.ts` with all TypeScript interfaces:
   - `GlucoseProfile`
   - `Metrics`
   - `Intervention` and all parameter types
   - `InterventionType` union

2. Create `src/data/constants.ts`:
   - Glucose thresholds (TARGET_LOW, TARGET_HIGH, HYPO, HYPER)
   - Default baseline profile (24 hourly values)

---

## Stage 3: Metrics Calculation

1. Create `src/utils/metrics.ts`:
   - `calculateMean(profile: number[]): number`
   - `calculateStandardDeviation(profile: number[]): number`
   - `calculateA1c(meanGlucose: number): number`
   - `calculateGMI(meanGlucose: number): number`
   - `calculateTimeInRange(profile: number[]): { inRange, below, above }`
   - `calculateMetrics(profile: number[]): Metrics`

2. Write unit tests for metrics calculations

---

## Stage 4: Basic Chart Component

1. Create `src/components/GlucoseChart.tsx`:
   - LineChart with Recharts
   - X-axis: hours 0-23 with formatted labels
   - Y-axis: 0-15 mmol/L
   - Target range band (ReferenceArea 3.9-10.0)
   - Single line for baseline profile
   - Tooltip showing hour and glucose value

2. Style the chart with appropriate colors

---

## Stage 5: Metrics Panel Component

1. Create `src/components/MetricsPanel.tsx`:
   - Display all metrics from `Metrics` interface
   - Format numbers appropriately (1 decimal for glucose, integers for percentages)
   - Placeholder for delta display (no comparison yet)

---

## Stage 6: Basic App Layout

1. Update `src/App.tsx`:
   - Header
   - Two-column layout: Chart (left), Metrics (right)
   - Load default baseline on mount
   - Calculate and display baseline metrics

2. Add basic Tailwind styling for layout

---

## Stage 7: Intervention Engine - Carb Reduction

1. Create `src/utils/interventions/carbReduction.ts`:
   - Implement carb reduction effect algorithm
   - Input: baseline profile, meal hour, reduction %, spike duration
   - Output: modified profile array

2. Create `src/utils/interventions/index.ts`:
   - `applyIntervention(baseline, intervention): number[]`
   - `computeScenario(baseline, interventions[]): number[]`

3. Write unit tests for intervention calculations

---

## Stage 8: Intervention UI - Carb Reduction Card

1. Create `src/components/InterventionCard.tsx`:
   - Card wrapper for any intervention type
   - Enable/disable toggle
   - Delete button

2. Create `src/components/CarbReductionForm.tsx`:
   - Meal time selector (dropdown: Breakfast/Lunch/Dinner or hour picker)
   - Reduction percentage slider (0-100%)
   - Spike duration input (default 3 hours)

---

## Stage 9: State Management

1. Create `src/hooks/useAppState.ts`:
   - State for baseline, interventions, computed scenario
   - Actions: setBaseline, addIntervention, updateIntervention, removeIntervention, toggleIntervention
   - Auto-recompute scenario when baseline or interventions change

2. Wire up state to App component

---

## Stage 10: Dual Profile Display

1. Update `GlucoseChart.tsx`:
   - Add second line for scenario profile
   - Baseline: grey dashed line
   - Scenario: blue solid line
   - Update tooltip to show both values and delta

2. Update `MetricsPanel.tsx`:
   - Accept both baseline and scenario metrics
   - Display deltas with color coding (green=improvement, red=worsening)
   - Arrow indicators (↑↓→)

---

## Stage 11: Intervention Panel

1. Create `src/components/InterventionPanel.tsx`:
   - "Add Intervention" button
   - List of active intervention cards
   - Intervention type selector dropdown

2. Integrate into App layout (below chart/metrics area)

---

## Stage 12: Polish MVP

1. Add responsive design for different screen sizes
2. Add loading states
3. Error boundaries
4. Final styling pass
5. Test end-to-end flow

---

## Post-MVP Stages (Phase 2)

### Stage 13: Custom Baseline Editor
- 24 number inputs for manual entry
- JSON paste/export functionality
- "Use Default" reset button

### Stage 14: Additional Interventions
- Bolus timing intervention
- Basal adjustment intervention
- Meal skip intervention
- Exercise intervention

### Stage 15: Multiple Interventions
- Support stacking multiple interventions
- Define interaction rules (additive vs multiplicative)
- Visual indication of which interventions are active

---

## Post-MVP Stages (Phase 3)

### Stage 16: Intervention Contribution Visualization
- Show individual contribution of each intervention
- Stacked area or multi-line view

### Stage 17: Profile Templates
- Preset baseline profiles (well-controlled, poorly-controlled, dawn phenomenon heavy, etc.)
- Quick-select dropdown

### Stage 18: Export/Import
- Export scenario as JSON
- Import saved scenarios
- Share URLs with encoded state

---

## Technical Notes

- Each stage should result in working, testable code
- Commit after each stage
- Stages 1-12 comprise the MVP (Phase 1 of spec)
- Estimated order of complexity: Stages 7 and 9 are the most complex
