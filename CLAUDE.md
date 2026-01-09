# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Blood Sugar Scenario Modeler - a React single-page application for visualizing 24-hour glucose profiles and modeling the impact of lifestyle/treatment interventions on glycemic control metrics.

See [blood-sugar-scenario-modeler-spec.md](blood-sugar-scenario-modeler-spec.md) for full technical specification.

## Commands

```bash
npm run dev      # Start development server
npm run build    # TypeScript check + production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Key Domain Constants

- Glucose unit: mmol/L
- Target range: 3.9-10.0 mmol/L
- Hypo threshold: 3.0 mmol/L
- Hyper threshold: 13.9 mmol/L
- A1c formula: `(mean_glucose_mmol × 18.05 + 46.7) / 28.7`
- GMI formula: `3.31 + (0.4314 × mean_glucose_mmol)`

## Architecture

```
src/
├── components/     # React components (GlucoseChart, MetricsPanel, InterventionPanel, etc.)
├── hooks/          # Custom hooks (useAppState for state management)
├── types/          # TypeScript interfaces (Intervention, Metrics, GlucoseProfile)
├── utils/          # Calculation utilities
│   ├── metrics.ts          # A1c, GMI, TIR calculations
│   └── interventions/      # Intervention effect algorithms
└── data/           # Constants and default baseline profile
```

**Core Data Flow:**
1. User modifies interventions via InterventionPanel
2. `useAppState` hook manages state and calls `computeScenario(baseline, interventions)`
3. Metrics recalculated for both baseline and scenario
4. GlucoseChart shows baseline (grey dashed) vs scenario (blue solid)
5. MetricsPanel shows deltas with color-coded improvements/worsening

**Key Interfaces (in src/types/index.ts):**
- `GlucoseProfile`: 24 hourly average values (index 0 = midnight-1am)
- `Intervention`: typed interventions with discriminated union for parameters
- `Metrics`: meanGlucose, estimatedA1c, gmi, timeInRange, timeBelowRange, timeAboveRange, coefficientOfVariation

**Current Implementation (Phase 1 MVP):**
- Default baseline profile display
- Carb reduction intervention type
- Dual profile comparison (baseline vs scenario)
- Real-time metrics with delta display

**Future Phases:**
- Phase 2: Custom baseline entry, all 5 intervention types (bolus_timing, basal_adjustment, meal_skip, exercise)
- Phase 3: Intervention stacking visualization, profile templates, export/import
