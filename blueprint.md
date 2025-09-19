# GasketOptima 2.0 Blueprint

## Overview

GasketOptima 2.0 is a CNC gasket quoting tool that allows users to get a price and time estimate for cutting gaskets of various shapes and sizes from different materials.

## Features

- **Gasket Input:** Users can add gaskets of rectangular or circular shape, specifying dimensions, quantity, and other details.
- **Material Input:** Users can define the material to be used, including its type (sheet or roll), dimensions, cost, and other properties.
- **Quote Calculation:** The application calculates the total cost and machine time required to cut the specified gaskets from the given material.
- **Web Worker for Calculations:** All heavy calculations are offloaded to a web worker to keep the UI responsive.
- **Component-Based UI:** The user interface is built with React and shadcn/ui components.
- **State Management:** The application state is managed by Zustand.
- **Form Handling:** Forms are managed using React Hook Form and Zod for validation.
- **Styling:** The application is styled with Tailwind CSS.

## Project Structure

```
/src
├── /components/
│   ├── /forms/               # Form components (GasketForm, MaterialForm)
│   ├── /reports/             # Components for displaying results (QuoteDisplay)
│   └── /ui/                  # Components from Shadcn/ui
├── /hooks/
│   └── useQuoteEngine.ts     # The reactive hook that orchestrates the Web Worker
├── /lib/
│   └── utils.ts              # Utility functions
├── /services/
│   ├── /billing/             # Billing logic using the Strategy Pattern
│   │   ├── BillingStrategy.ts
│   │   ├── StockedSheetStrategy.ts
│   │   └── ...
│   ├── /core/                # Core calculation services
│   │   ├── QuoteOrchestrator.ts
│   │   ├── YieldService.ts
│   │   └── LaborService.ts
├── /store/
│   └── quoteStore.ts         # The central Zustand store
├── /workers/
│   └── calculation.worker.ts # The dedicated Web Worker for calculations
└── App.tsx                   # Main application component
```

## Development Plan

**I. Foundational Setup & Dependency Management (In Progress)**

1.  **Resolve Missing Dependencies:** Identify and install any missing npm packages required by the existing code. (This is the step I am currently on).
2.  **Validate `tsconfig.json` and `vite.config.ts`:** Ensure path aliases and compiler options are correctly configured for the project structure.
3.  **Implement `clsx` and `tailwind-merge`:** Install and configure these utilities for robust and conflict-free class name management with Tailwind CSS.

**II. UI Development & Component Implementation**

1.  **Refine `GasketForm.tsx` and `MaterialForm.tsx`:**
    *   Integrate `react-hook-form` for state management and validation.
    *   Implement dynamic field visibility based on user selections (e.g., show "Diameter" for circles, "Width" and "Height" for rectangles).
    *   Add descriptive part number generation.
2.  **Implement `QuoteDisplay.tsx`:**
    *   Display the calculated quote results, including total cost, machine time, and a breakdown per gasket.
    *   Implement the "stale quote" indicator.
3.  **Implement List Virtualization:**
    *   Use `TanStack Virtual` to render the list of gaskets in `App.tsx` for efficient rendering of long lists.
4.  **Create Main Application Layout in `App.tsx`:**
    *   Structure the main application layout, including the gasket form, material form, and quote display components.

**III. Core Logic & Calculation Engine Implementation**

1.  **Implement `YieldService.ts`:**
    *   Implement all sheet and roll material yield calculation strategies as defined in the technical blueprint.
2.  **Implement `LaborService.ts`:**
    *   Implement the machine time calculation logic.
3.  **Implement Billing Strategies:**
    *   Implement the `StockedSheetStrategy`, `NonStockedSheetStrategy`, and `RollBillingStrategy` classes.
4.  **Implement `QuoteOrchestrator.ts`:**
    *   Implement the main orchestrator service that ties together the yield, labor, and billing services.
5.  **Implement `calculation.worker.ts`:**
    *   Set up the web worker to receive data from the main thread, run the `QuoteOrchestrator`, and post the results back.
6.  **Implement `useQuoteEngine.ts`:**
    *   Create the custom hook that manages the interaction between the Zustand store and the calculation worker.

**IV. State Management & Data Flow**

1.  **Refine `quoteStore.ts`:**
    *   Ensure the Zustand store is correctly set up to manage gaskets, material, and quote results.
    *   Implement the `safeStorage` adapter for resilient data persistence.

**V. Final Touches & Production Readiness**

1.  **PDF Generation:**
    *   Create a new component for the PDF layout using `@react-pdf/renderer`.
    *   Add a button to `QuoteDisplay.tsx` to trigger the PDF export.
2.  **Testing:**
    *   Write unit tests for all services and utilities using Vitest.
    *   Implement the high-level regression tests defined in the technical blueprint.
3.  **AI Service Integration (Optional - If Required):**
    *   Implement the `aiService` with the rate limiter and circuit breaker if AI features are part of the MVP.
