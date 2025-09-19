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
