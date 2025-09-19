import { Gasket, Material } from "@/store/quoteStore";
import { BillingStrategy } from "./BillingStrategy";
import YieldService from "../core/YieldService";

class NonStockedSheetStrategy implements BillingStrategy {
  calculate(gaskets: Gasket[], material: Material): number {
     if (!material.width || !material.length) {
      return 0;
    }

    let totalFractionalSheets = 0;

    for (const gasket of gaskets) {
      const yieldPerSheet = YieldService.calculate(gasket, material);
      if (yieldPerSheet > 0) {
        totalFractionalSheets += gasket.quantity / yieldPerSheet;
      }
    }
    
    // Heuristic for nesting smaller jobs in the remainder of the largest job is not implemented yet.
    
    const billedSheets = Math.ceil(totalFractionalSheets);
    
    return billedSheets * material.cost;
  }
}

export default new NonStockedSheetStrategy();
