# **Calculation Transparency & FAQ**

## **Key Constants & Definitions**

**Edge Spacing:** A fixed safety margin of 0.25" is subtracted from each side of the raw material to define the 'Usable Area'. All nesting calculations are performed within this boundary.

**Part Spacing:** The user-defined gap required between parts for clean CNC cuts. This value is added to a gasket's dimensions to create its effective 'Footprint' for layout calculations.

**Net Area:** The actual surface area of the final gasket part. This is the primary basis for proportional cost allocation.

Net Area \= Outer Boundary Area \- Inner Cutout Area

**Pierce Time Penalty:** A fixed time penalty of 0.04 minutes is added for every time the CNC machine must pierce the material to start a new cut path (e.g., for the outer edge, inner cutout, and each bolt hole).

**Gross Area:** The area of the smallest rectangle or circle that a gasket would fit into, before accounting for any internal cutouts. This is used in some intermediate calculations.

For a circle:

Gross Area \= π \* (Outer Diameter / 2)²

For a rectangle:

Gross Area \= Outer Width \* Outer Height

## **User Interface & Experience (UX)**

The application includes several features designed to improve workflow and provide clear feedback to the user.

### **Stale Quote Indicator**

If you change any input after a quote has been calculated, the "Calculate Quote" button will turn indigo and start pulsing, and the results area will become faded. This is a visual cue that the displayed quote is outdated and you need to recalculate to see the impact of your changes.

### **Interconnected Cost Fields**

The cost fields in the Material Form are interconnected to provide flexibility. You can enter a Sheet Cost and the system will calculate the Cost per Square Foot. Alternatively, you can enter a desired Cost per Square Foot, and the system will back-calculate the required Sheet Cost. The same logic applies to roll material and the Total Material Cost field.

### **Print / PDF Export**

The "Export to PDF" button generates a clean, professional, multi-page quote summary suitable for sending to clients. It reformats the quote data into a standard business document layout. Use your browser's "Print" dialog and select "Save as PDF" as the destination.

### **Performance: List Virtualization**

The Gasket Dimensions list is optimized to handle hundreds of line items without slowing down the user interface. It uses a technique called list virtualization, which only renders the handful of gasket forms that are currently visible on the screen. This ensures the application remains fast and responsive even with very large quotes.

### **Manual & Bulk Data Entry**

In addition to the AI-powered methods, you can add gaskets manually:

* **\+ Add Gasket:** Adds a single, new default gasket form to the list.  
* **Bulk Add:** Opens a modal where you can paste multiple gaskets in a comma-separated-value (CSV) format. This is useful for quickly entering data from a spreadsheet or other structured source without using the AI.

### **Responsive Numeric Inputs**

To ensure a smooth user experience, all numeric input fields use a "draft" state. This allows you to type partial numbers (e.g., "12.") or temporarily clear a field without triggering constant recalculations or validation errors. The final numeric value is only committed to the application's state when you click away from the input field (on blur) or press the 'Enter' key.

## **Visualizations & Patterns**

The pattern visualizer provides a scaled-down representation of how parts are laid out on the material. It helps to intuitively understand the results of the yield calculation.

* **Dashed Indigo Line:** This represents the 'Usable Area' of the material, inside the fixed 0.25" Edge Spacing. All parts are placed within this boundary.  
* **Indigo Shapes:** These are the placed gaskets, showing their position and orientation.  
* **Grid Background:** A subtle grid to provide a sense of scale.  
* **Clipped Roll View:** For roll materials where the required length is very long, the visualization is clipped for readability. A gradient at the bottom indicates that the pattern continues.  
* **Mixed Remainder Layout:** When a job is consolidated using the remainder nesting heuristic, the visualizer shows the entire sheet with all parts (both the dominant and nested items) to provide full context on how the consolidation was achieved.

## **Yield Calculation: How many gaskets fit?**

The system's primary goal is to maximize material efficiency. It employs several algorithms to find the best possible layout (pattern) for each gasket on the specified material.

### **Sheet Material**

For sheets, the objective is to maximize the number of parts yielded from a single sheet.

#### **Rectangles:**

The system is exhaustive. It tests a comprehensive set of packing strategies, including rotating the parts and even conceptually rotating the entire sheet (e.g., testing a 60"x40" sheet as both 60x40 and 40x60). The best result from all combinations is chosen.

Strategies Tested:

1\. Grid (0° part orientation)

2\. Grid (90° part orientation)

3\. Mixed: Main grid at 0°, fill leftover width with 90° parts

4\. Mixed: Main grid at 0°, fill leftover height with 90° parts

5\. Mixed: Main grid at 90°, fill leftover width with 0° parts

6\. Mixed: Main grid at 90°, fill leftover height with 0° parts

#### **Circles:**

For circles, two main patterns are compared:

**1\. Grid Yield:** A simple row and column layout.

Footprint \= GasketDiameter \+ PartSpacing

Cols \= floor((UsableW \+ PartSpacing) / Footprint)

Rows \= floor((UsableH \+ PartSpacing) / Footprint)

Yield \= Cols \* Rows

**2\. Triangular Yield:** A denser, staggered "honeycomb" pattern. The algorithm calculates the yield for both horizontal and vertical staggering and selects the better of the two to compete against the grid yield.

Simplified concept for horizontal staggering:

V\_Spacing \= (GasketDiameter \+ PartSpacing) \* sqrt(3)/2

NumRows \= floor((UsableH \- Diameter) / V\_Spacing) \+ 1

... logic to calculate parts in full vs. indented rows

### **Roll Material**

For rolls, the objective shifts to finding the layout that requires the shortest total length of material to produce the required quantity.

#### **Advanced Optimization: Hybrid Layout**

To accurately model real-world material savings, the system tests hybrid layouts. This powerful heuristic calculates the length needed for the main bulk of the quantity in one pattern, and then calculates the length needed for the small remainder in a different pattern. It then sums these lengths. For example, it might pack 95 parts in a dense triangular layout, and then switch to a simple grid to pack the last 5 parts if that results in a shorter total length than using a pure triangular layout for all 100 parts. It compares all pure and hybrid combinations and selects the one with the absolute shortest length.

## **Machine Time Calculation**

The total machine time is the sum of two components: the time spent physically cutting the material and the time spent on pierces.

### **Step 1: Calculate Total Cut Length**

First, the system calculates the perimeter of every single cut path for one gasket.

For a single gasket:

OuterPerimeter \= (for circle: PI \* Diameter) or (for rectangle: 2 \* (W \+ H))

InnerPerimeter \= (if cutout exists, calculated same as outer)

BoltHolePerimeter \= (PI \* HoleDiameter) \* NumberOfHoles

TotalPerimeter\_per\_Gasket \= Outer \+ Inner \+ BoltHoles

### **Step 2: Calculate Linear Cut Time**

This is the time the CNC spends moving while cutting.

TotalCutLength\_for\_Job \= TotalPerimeter\_per\_Gasket \* Quantity

LinearCutTime (minutes) \= TotalCutLength\_for\_Job / CutSpeed (IPM)

### **Step 3: Calculate Pierce Time Penalty**

This is the time penalty for each new cut path started.

PiercePoints\_per\_Gasket \= 1 (outer) \+ 1 (inner, if exists) \+ NumberOfHoles

TotalPiercePoints\_for\_Job \= PiercePoints\_per\_Gasket \* Quantity

PierceTime (minutes) \= TotalPiercePoints\_for\_Job \* 0.04

### **Step 4: Final Time Calculation**

The final time is the sum of the components, converted to hours.

TotalTime (minutes) \= LinearCutTime \+ PierceTime

TotalTime (hours) \= TotalTime (minutes) / 60

## **Billing & Cost Allocation Logic**

The system follows a multi-step process to determine the final cost, based on strict business rules for different material types.

### **Billing Rules (Determining Total Material Cost)**

#### **Stocked Sheet:**

Billed by the precise area consumed, rounded up. This allows multiple jobs to share a single sheet.

For each gasket type:

FractionalSheets \= Quantity / GasketsPerSheet

Then, for the whole job:

TotalConsumedSqFt \= sum(FractionalSheets) \* SheetAreaInSqFt

BilledUnits \= ceil(TotalConsumedSqFt) // Rounded up to the next sq ft

#### **Non-Stocked Sheet:**

The customer must buy enough full sheets to cover the entire job. The system first calculates the total physical sheet requirement, then rounds that total up.

For each gasket type:

FractionalSheets \= Quantity / GasketsPerSheet

Then, for the whole job:

TotalPhysicalSheets \= sum(FractionalSheets)

BilledUnits \= ceil(TotalPhysicalSheets) // Rounded up to the next whole sheet

#### **Advanced Optimization: Remainder Nesting Heuristic**

For multi-part jobs on non-stocked sheets, the system activates a powerful cost-saving heuristic to simulate how an operator would consolidate jobs:

1. It finds the "dominant" job (the one that uses the most material).  
2. It calculates the bounding box of the dominant parts placed on the final, partially-filled sheet.  
3. From this bounding box, it defines two possible rectangular leftover areas: one to the right of the parts, and one below them. The larger of these two areas is selected as the container for nesting the smaller jobs.  
4. It then uses a 2D packing algorithm to attempt to fit the entire quantity of all smaller jobs into this leftover space. This packing algorithm uses a "largest-first, first-fit" heuristic: it sorts the smaller jobs by size and places each one in the first available spot it finds.  
5. If successful, the `BilledUnits` is reduced, directly lowering the customer's cost.

*Note: This is a high-performance heuristic, not a guaranteed optimal solution, but it accurately models how an operator would manually consolidate jobs to save material.*

#### **Roll Material (Stocked & Non-Stocked):**

Always billed by the total length required, rounded up to the next full foot.

For each gasket type, find the required length for the quantity.

Then, for the whole job:

TotalLengthInches \= sum(RequiredLengths)

TotalLengthFeet \= TotalLengthInches / 12

BilledUnits \= ceil(TotalLengthFeet) // Rounded up to the next foot

### **Cost Allocation (Distributing the Total Cost)**

Once the `TotalMaterialCost` is determined by the billing rules, it is distributed proportionally among all the fittable gasket types based on their contribution to the job's total Net Area.

Gasket\_TotalNetArea \= Gasket\_NetArea \* Gasket\_Quantity

Job\_TotalNetArea \= sum(All\_Gasket\_TotalNetAreas)

Gasket\_PercentageOfTotal \= (Gasket\_TotalNetArea / Job\_TotalNetArea) \* 100

Gasket\_AllocatedCost \= (Gasket\_PercentageOfTotal / 100\) \* TotalMaterialCost

CostPerPiece \= Gasket\_AllocatedCost / Gasket\_Quantity

This method ensures that gaskets that represent more of the final product's material receive a proportionally higher share of the cost.

#### **Preventing Rounding Errors: The Largest Remainder Method**

When distributing the total material cost, which is calculated in cents, it's possible for rounding to cause the sum of the allocated costs to be off by a penny compared to the total. To prevent this, the system uses the **Largest Remainder Method**.

1. The exact proportional cost (e.g., $12.3456) is calculated for each line item.  
2. This cost is floored to the nearest whole cent (e.g., $12.34).  
3. The leftover fractional cents (e.g., 0.56¢) are tracked for each item.  
4. After all items have their base cost allocated, any remaining pennies from the total are distributed one by one to the line items that had the largest fractional remainders, ensuring the final sum is exact.

## **AI Features (Powered by Gemini)**

The application leverages the Google Gemini API to accelerate the data entry process. This is achieved through carefully crafted prompts and by enforcing a structured JSON output. All AI interactions are routed through a secure server-side proxy for API key management.

### **Image Analysis (Add from Image)**

When an image of a technical drawing is uploaded, it is sent to Gemini with a detailed prompt instructing it to act as a precision data extraction tool. The prompt specifically directs the model to:

* Identify the absolute maximum outer boundary dimensions for `outerWidth` and `outerHeight`.  
* Ignore coordinate system dimensions or other irrelevant numbers.  
* Find the dimensions of the main central cutout for `innerWidth` and `innerHeight`.  
* Locate and parse bolt hole callouts (e.g., "24X Ø .136") to extract quantity and diameter.  
* Return `0` for any dimension that is not explicitly found.

To ensure data integrity, the API call includes a `responseSchema`, which forces Gemini to return a valid JSON object matching the application's data structure. This eliminates errors from unstructured text responses.

### **Text Analysis (Add from Text)**

When a user types a description (e.g., "I need 25 washers, 8 inch OD and 7 inch ID"), the text is sent to Gemini. The prompt instructs the model to parse the natural language and extract all distinct gasket types mentioned.

Similar to the image analysis, this feature uses a `responseSchema` that requires the model to output a JSON array, where each object in the array represents a valid gasket. This allows the application to directly process the AI's response and add all parsed gaskets to the quote simultaneously.

## **Testing, Persistence & Resiliency**

The application is built with several robust engineering practices to ensure reliability, data integrity, and a stable user experience.

### **In-Browser Testing Suite**

GasketOptima includes a comprehensive, two-layer testing strategy that runs directly in the browser:

* **Regression Tests:** Found in the "Automated Regression Tests" panel, these are high-level tests that run the entire calculation engine for a pre-defined scenario and validate key financial and labor outputs. They ensure that changes to one part of the system don't unintentionally break another.  
* **Unit Tests:** The "In-Browser Unit Tests" panel runs a suite of low-level tests that validate individual functions and services in isolation. This ensures that the fundamental building blocks of the application (e.g., geometric formulas, currency formatters) are mathematically correct.

### **Resilient Data Persistence**

Your session data (gaskets, material settings) is saved automatically. To ensure this works in all browser environments (including private browsing or restrictive security settings), the application uses a resilient storage strategy:

1. Attempt to use localStorage (persistent).  
2. If localStorage fails, fall back to sessionStorage (lasts for the session).  
3. If both fail, fall back to a non-persistent in-memory store.

This ensures the application remains fully functional even if browser storage is unavailable.

### **AI Service Resiliency**

To prevent issues with the external AI service, two patterns are used:

* **Rate Limiter:** Prevents you from sending too many requests too quickly (max 5 per minute), protecting against accidental spam.  
* **Circuit Breaker:** If the AI service fails 3 consecutive times, the circuit "opens" and temporarily blocks all AI requests for 30 seconds. This prevents the application from hammering a failing service and gives it time to recover.

## **Data Validation & Business Rules**

Before any calculations are run, the system performs a comprehensive validation check on all inputs to ensure they are logical and physically possible. If any rule is violated, an error message is displayed on the relevant field.

### **Input Constraints**

To ensure realistic calculations, inputs are constrained to a specific range of values.

All dimensions in inches

Minimum Material Dimension: 12"

Maximum Material Dimension: 144"

Minimum Gasket Dimension: 0.5"

Minimum Part Spacing: 0.001"

Maximum Part Spacing: 2.0"

### **Geometric Rules**

The system enforces several geometric rules to prevent impossible shapes:

* An inner dimension cannot be greater than or equal to its corresponding outer dimension (e.g., `innerWidth` must be less than `outerWidth`).  
* For circles, the `outerWidth` and `outerHeight` must be equal, as they both represent the diameter. The same applies to `innerWidth` and `innerHeight`.  
* All quantities (gasket quantity, bolt hole quantity) must be non-negative whole numbers.

### **Pre-Calculation Test Fit**

If all basic validation rules are met, the system performs a quick "test fit" for each gasket. It checks if the gasket's footprint (its dimensions plus spacing) can physically fit within the material's 'Usable Area' in at least one orientation. If a part is simply too large for the material, it is flagged as **unfittable** and an error is shown before the full, intensive calculation is performed.

* 