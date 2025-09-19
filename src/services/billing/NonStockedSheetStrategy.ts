import { Gasket, Material } from "@/store/quoteStore";
import { BillingStrategy } from "./BillingStrategy";
import YieldService from "../core/YieldService";

class NonStockedSheetStrategy implements BillingStrategy {
  calculate(gaskets: Gasket[], material: Material): number {
    let totalSheets = 0;
    
    // For simplicity, we'll use the standard aggregation for now.
    // The remainder nesting heuristic can be added later.
    for (const gasket of gaskets) {
      const yieldPerSheet = YieldService.calculate(gasket, material);
      if(yieldPerSheet > 0) {
          totalSheets += gasket.quantity / yieldPerSheet;
      }
    }

    const billedSheets = Math.ceil(totalSheets);
    return billedSheets * material.cost;
  }
}

export default new NonStockedSheetStrategy();
