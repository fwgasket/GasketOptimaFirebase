import { Gasket, Material } from "@/store/quoteStore";
import { BillingStrategy } from "./BillingStrategy";
import YieldService from "../core/YieldService";

class StockedSheetStrategy implements BillingStrategy {
  calculate(gaskets: Gasket[], material: Material): number {
    if (!material.width || !material.length) {
      return 0;
    }

    const sheetAreaSqFt = (material.width * material.length) / 144;
    let totalConsumedSqFt = 0;

    for (const gasket of gaskets) {
      const yieldPerSheet = YieldService.calculate(gasket, material);
      if (yieldPerSheet > 0) {
        const fractionalSheets = gasket.quantity / yieldPerSheet;
        totalConsumedSqFt += fractionalSheets * sheetAreaSqFt;
      }
    }

    const billedUnits = Math.ceil(totalConsumedSqFt);
    const costPerSqFt = material.cost / sheetAreaSqFt;
    
    return billedUnits * costPerSqFt;
  }
}

export default new StockedSheetStrategy();
