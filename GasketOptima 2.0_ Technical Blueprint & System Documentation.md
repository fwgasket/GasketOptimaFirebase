# **GasketOptima 2.0: Technical Blueprint & System Documentation**

Author: The Architect Scribe  
Status: Approved for Implementation  
Version: 2.0.0

## **1\. Introduction & Vision**

This document provides the complete technical specification for GasketOptima 2.0, a ground-up rebuild of the CNC gasket quoting tool. The primary objective of this new version is to create a highly maintainable, performant, and scalable application by adopting modern architectural patterns and best-in-class libraries.

This blueprint will serve as the single source of truth for the AI Coder. All implementation must adhere strictly to the designs and standards outlined herein.

## **2\. Technology Stack & Libraries**

GasketOptima 2.0 will be a modern web application built with the following technologies to ensure a robust and efficient development process and a high-quality end product.

| Category | Library/Tool | Purpose |
| :---- | :---- | :---- |
| **UI Framework** | [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/) | For building a type-safe, component-based user interface. |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | For a utility-first styling workflow, ensuring consistency and rapid development. |
| **Component Library** | [Shadcn/ui](https://ui.shadcn.com/) | Provides a set of accessible, production-ready, and stylistically consistent UI components. |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) | For simple, scalable, and performant global state management. |
| **Form Handling** | [React Hook Form](https://react-hook-form.com/) | For performant, flexible, and scalable form state management and validation. |
| **List Virtualization** | [TanStack Virtual](https://tanstack.com/virtual) | To efficiently render long lists of gaskets without performance degradation. |
| **PDF Generation** | [@react-pdf/renderer](https://react-pdf.org/) | For generating professional, client-ready PDF quote documents with full layout control. |
| **Testing** | [Vitest](https://vitest.dev/) | The testing framework for all unit, integration, and regression tests. |

## **3\. System Architecture**

The application will be architected with a strong separation of concerns, isolating UI, state management, and core business logic into distinct, maintainable modules.

### **3.1. Directory Structure**

The project will follow a domain-driven file structure to ensure logical organization and scalability.

/src  
├── /components/  
│   ├── /forms/               \# Form components (GasketForm, MaterialForm)  
│   ├── /modals/              \# All modal dialogs  
│   ├── /reports/             \# Components for displaying results (QuoteDisplay, etc.)  
│   └── /ui/                  \# Components installed from Shadcn/ui  
├── /data/  
│   └── testCases.ts          \# All regression test case definitions  
├── /hooks/  
│   └── useQuoteEngine.ts     \# The reactive hook that orchestrates the Web Worker  
├── /services/  
│   ├── /ai/                  \# AI-related logic  
│   │   ├── aiService.ts  
│   │   ├── aiPrompts.ts  
│   │   └── resiliency/       \# Circuit Breaker & Rate Limiter  
│   ├── /billing/             \# Billing logic using the Strategy Pattern  
│   │   ├── BillingStrategy.ts  
│   │   ├── StockedSheetStrategy.ts  
│   │   └── ...  
│   ├── /core/                \# Core calculation services  
│   │   ├── QuoteOrchestrator.ts  
│   │   ├── YieldService.ts  
│   │   └── LaborService.ts  
│   └── /utils/               \# Standalone utility functions (formatters, etc.)  
├── /store/  
│   └── quoteStore.ts         \# The central Zustand store  
├── /types/  
│   └── index.ts              \# All TypeScript type definitions  
├── /workers/  
│   └── calculation.worker.ts \# The dedicated Web Worker for calculations  
└── App.tsx                   \# Main application component

### **3.2. Core Architectural Patterns**

#### **3.2.1. Reactive State Flow**

The application will be fully reactive. User input will update the central **Zustand store**, which will trigger a **debounced useEffect** in the useQuoteEngine hook. This hook will then post the required data to the Web Worker for calculation, ensuring the UI remains responsive and calculations only run when the user has finished making changes.

#### **3.2.2. Dedicated Web Worker**

All heavy computations will be offloaded to a dedicated Web Worker (/workers/calculation.worker.ts). This is critical for performance, preventing the UI thread from freezing. The worker will be a standard TypeScript module, importing the necessary services to perform its tasks.

#### **3.2.3. Strategy Pattern for Billing**

The billing logic will be decoupled using the **Strategy Pattern**. A BillingStrategy interface will define a common calculate method, and concrete classes (StockedSheetStrategy, NonStockedSheetStrategy, RollBillingStrategy) will implement the specific business rules. The QuoteOrchestrator service will be responsible for selecting the correct strategy based on the material type at runtime. This makes the billing logic highly extensible.

## **4\. Core Logic & Calculation Engine**

This section details the algorithms and business rules that form the heart of GasketOptima.

### **4.1. Yield Calculation (services/core/YieldService.ts)**

The primary goal is to maximize material efficiency. All calculations must be performed within the 'Usable Area' of the material, defined as MaterialDimension \- (2 \* EDGE\_SPACING).

#### **4.1.1. Sheet Material**

The objective is to maximize the number of parts per sheet.

* **Rectangles:** The engine must be exhaustive, testing **6 distinct packing strategies** derived from industrial packing problems. It must also test the sheet in two orientations (e.g., 60x40 and 40x60) and select the absolute best yield from all 12 combinations.  
* **Circles:** Two primary patterns must be compared:  
  1. Grid Packing: A simple row-and-column layout.  
     Yield=⌊GasketDiameter+PartSpacingUsableWidth+PartSpacing​⌋×⌊GasketDiameter+PartSpacingUsableHeight+PartSpacing​⌋  
  2. **Triangular (Hexagonal) Packing:** A denser, staggered pattern. The algorithm must calculate the yield for both horizontal and vertical staggering and select the highest yield. The vertical spacing between rows is calculated as (GasketDiameter+PartSpacing)×23​​.

#### **4.1.2. Roll Material**

The objective is to find the layout that requires the **shortest total length** of material.

* **Hybrid Layout Optimization:** For both rectangles and circles, the engine must test **hybrid layouts**. This involves calculating the length needed for the main bulk of the quantity in one pattern (e.g., triangular) and then calculating the length for the small remainder in a *different* pattern (e.g., grid). It must compare all pure and hybrid combinations to find the absolute shortest total length.

### **4.2. Billing Engine (services/billing/)**

All cost calculations must be performed in **CENTS** to avoid floating-point errors.

#### **4.2.1. Stocked Sheet Strategy**

Billed by the precise area consumed, rounded up to the next full square foot.  
TotalConsumedSqFt=∑(YieldPerSheetQuantity​)×SheetAreaSqFt  
BilledUnits=⌈TotalConsumedSqFt⌉

#### **4.2.2. Non-Stocked Sheet Strategy**

The customer must buy enough full sheets for the entire job.

* Standard Aggregation: The baseline calculation is to sum the fractional sheet requirements for each part and round the total up to the next whole number.  
  BilledUnits=⌈∑(YieldPerSheetQuantity​)⌉  
* **Remainder Nesting Heuristic:** Before finalizing the cost, the system must apply a cost-saving heuristic for multi-part jobs.  
  1. Identify the "dominant" job (the one requiring the most material).  
  2. Calculate the rectangular leftover area on the dominant job's final, partially-filled sheet.  
  3. Use a 2D packing algorithm (**largest-first, first-fit heuristic**) to attempt to nest the **entire quantity** of all smaller jobs into this leftover space.  
  4. If successful, the total BilledUnits is reduced.

#### **4.2.3. Roll Billing Strategy**

Always billed by the total required length, rounded up to the next full foot, regardless of stocking type.  
BilledUnits=⌈12∑RequiredLength\_inches​⌉

### **4.3. Cost Allocation**

Once the TotalMaterialCost is determined, it is distributed proportionally among all fittable gasket types based on their contribution to the job's total **Net Area**. The **Largest Remainder Method** must be used to prevent "off-by-one-cent" rounding errors.

### **4.4. Machine Time (Labor) Calculation (services/core/LaborService.ts)**

TotalTime\_hours=60LinearCutTime\_min+PierceTime\_min​

* **Linear Cut Time:** (∑TotalPerimeter\_inches)/CutSpeed\_IPM  
* **Pierce Time:** (∑PiercePoints)×PierceTimePenalty\_min  
  * *PiercePoints per Gasket* \= 1 (outer) \+ 1 (if inner cutout) \+ NumberOfBoltHoles

## **5\. User Interface & Experience (UX)**

The application will provide a clear and intuitive user experience, guided by the following documented features.

* **Stale Quote Indicator:** A pulsing "Calculate" button and faded results area will visually inform the user when inputs have changed and a recalculation is needed.  
* **Interconnected Cost Fields:** The cost fields in the MaterialForm will allow for back-calculation (e.g., changing the Total Cost proportionally adjusts the Sheet Cost).  
* **Descriptive Part Numbers:** The UI will automatically generate a standardized Part Number string (e.g., "8.000" x 4.500" or "10.000" Dia") for each gasket.  
* **Professional PDF Export:** The application will use @react-pdf/renderer to generate clean, multi-page, client-ready PDF quotes.  
* **List Virtualization:** The gasket list will use TanStack Virtual to ensure a smooth experience, even with hundreds of line items.

## **6\. System Resiliency & Robustness**

The application will be engineered for stability and reliability.

* **Two-Layer Testing Suite:** The project will use **Vitest** for a comprehensive test suite, including:  
  1. **Unit Tests** for individual services and utilities.  
  2. **High-Level Regression Tests** (/data/testCases.ts) to validate end-to-end business logic.  
* **Resilient Data Persistence:** The Zustand store will use a safeStorage adapter that provides a localStorage \-\> sessionStorage \-\> in-memory fallback strategy.  
* **AI Service Resiliency:** The aiService will encapsulate a **Rate Limiter** (max 5 calls/minute) and a **Circuit Breaker** (opens after 3 consecutive failures) to ensure stable interaction with external APIs.

## **7\. Comprehensive Regression Test Breakdown**

This section provides an exhaustive breakdown of every regression test case. This is the definitive specification for the application's core business logic, providing transparent, step-by-step validation for each calculation.

### **Core Logic & Labor**

#### **workerSyncVerification**

* **Scenario:** A minimal, single-part job.  
* **Logic Validated:** A sanity check to ensure the Web Worker's calculation engine produces the same result as the main thread's logic.  
* **Expected Outcome Explained:**  
  * **Cost:** The job uses less than 1 sq ft of a stocked sheet, so it bills for the minimum of 1 sq ft. A 12x12 sheet costs 100 cents, so 1 sq ft costs 100 cents. **Expected Cost: 100 cents.**  
  * **Time:** A 1" diameter circle has a perimeter of π×1"=3.14159". Linear cut time is 3.14159/100 IPM=0.0314 min. One pierce adds 0.04 min. Total time is 0.0714 min/60=0.001 hours. **Expected Time: 0.001 hours.**

#### **cncLaborCase**

* **Scenario:** A complex part with an inner cutout and multiple bolt holes.  
* **Logic Validated:** The accuracy of the calculateMachineTime formula, ensuring all perimeters and pierce points are correctly calculated.  
* **Expected Outcome Explained:**  
  * **Perimeter/pc:** Outer (20") \+ Inner (6") \+ Bolt Holes (4×π×0.5") \= 20 \+ 6 \+ 6.283 \= 32.283".  
  * **Total Cut Length:** 32.283"×100 qty=3228.3".  
  * **Linear Time:** 3228.3"/10 IPM=322.83 min.  
  * **Pierces/pc:** 1 (outer) \+ 1 (inner) \+ 4 (holes) \= 6\.  
  * **Total Pierces:** 6×100 qty=600.  
  * **Pierce Time:** 600×0.04 min/pierce=24 min.  
  * **Total Time:** (322.83+24) min/60=5.781 hours. **Expected Time: 5.781 hours.**

### **Non-Stocked Sheet Billing**

#### **nonStockedBillingLogic**

* **Scenario:** A job requiring less than one full sheet (0.556 physical sheets).  
* **Logic Validated:** The fundamental non-stocked rule: ceil(physical sheets).  
* **Expected Outcome Explained:**  
  * **Yield:** 9 parts fit on the 36x36 sheet.  
  * **Physical Requirement:** 5 qty/9 yield=0.556 sheets.  
  * **Billed Sheets:** ⌈0.556⌉=1.  
  * **Final Cost:** 1 sheet×1000 cents/sheet=1000 cents. **Expected Cost: 1000 cents.**

#### **nonStockedAggregateBilling**

* **Scenario:** Two items, each needing \~0.5 sheets, for a total of \~1.1 sheets.  
* **Logic Validated:** Validates the aggregation rule ceil(sum of physical sheets) when nesting is not possible.  
* **Expected Outcome Explained:**  
  * **Physical Req. (A):** 5 qty/9 yield=0.556 sheets.  
  * **Physical Req. (B):** 5 qty/9 yield=0.556 sheets.  
  * **Total Physical Req.:** 0.556+0.556=1.111 sheets.  
  * **Billed Sheets:** ⌈1.111⌉=2.  
  * **Final Cost:** 2 sheets×1000 cents/sheet=2000 cents. **Expected Cost: 2000 cents.**

#### **sowPrimaryCase & multiPartRemainderNesting**

* **Scenario:** Complex multi-part jobs where smaller jobs can fit into the leftover material of a larger "dominant" job.  
* **Logic Validated:** The geometric **remainder nesting heuristic**.  
* **Expected Outcome Explained:** The system calculates that the dominant part needs, for example, 1.3 physical sheets. It then analyzes the 70% empty space on the second sheet and determines that all other smaller jobs can be packed into it. Instead of billing ⌈1.3+0.467⌉=2, it bills only for the dominant part's requirement, ⌈1.3⌉=2, but with a different cost basis. The test passes if the final billed sheet count is lower than a simple aggregation would suggest.

### **Roll Material Billing & Yield**

#### **userRollScenario**

* **Scenario:** A very long, thin part (2"x48") on a wide (48") roll.  
* **Logic Validated:** The roll yield calculator must test both 0° and 90° orientations.  
* **Expected Outcome Explained:**  
  * **0° Orientation:** Only one 48" long part fits across the 48" width. Length required \= 50×2.25"=112.5".  
  * **90° Orientation:** Twenty-three 2" wide parts fit across the 48" width. Rows needed \= ⌈50/23⌉=3. Length required \= 3×48.25"=144.75".  
  * The 0° orientation is chosen as it is shorter. Total billed length \= ⌈112.5"/12⌉=10 ft.

#### **triangularRollYield & gridDominantNarrowRoll**

* **Scenario:** Circular parts on a roll.  
* **Logic Validated:** The system must correctly choose between a dense triangular pattern and a simple grid to minimize total length.  
* **Expected Outcome Explained:** On a wide roll (triangularRollYield), the staggered triangular pattern fits more parts per row, resulting in a shorter total length. On a narrow roll (gridDominantNarrowRoll), the staggering provides no benefit, and a simple grid is more efficient. The test passes if the system selects the pattern that results in the lowest final billed length.

#### **rectRollMixed**

* **Scenario:** A rectangular job with a small remainder quantity.  
* **Logic Validated:** The **hybrid layout optimization**.  
* **Expected Outcome Explained:** The system packs the main quantity (e.g., 20 parts) at 0° and calculates the length. It then packs the single remainder part at 90°. The total length of (Length for 20\) \+ (Length for 1\) is shorter than the length required for 21 parts in a pure 0° layout, so the hybrid option is chosen, resulting in a lower cost.

### **Edge Cases & Validation**

#### **unfittablePartsCase & allUnfittableParts**

* **Scenario:** A mix of fittable and unfittable parts.  
* **Logic Validated:** Unfittable parts must be completely excluded from all financial and labor calculations.  
* **Expected Outcome Explained:** The total cost and time for the quote must only reflect the fittable parts. If all parts are unfittable, the total cost and time must be exactly 0\.