import { Gasket, Material } from "@/store/quoteStore";
import LaborService from "./LaborService";
import StockedSheetStrategy from "../billing/StockedSheetStrategy";
import NonStockedSheetStrategy from "../billing/NonStockedSheetStrategy";
import RollBillingStrategy from "../billing/RollBillingStrategy";

class QuoteOrchestrator {
  calculate(gaskets: Gasket[], material: Material) {
    const totalTime = LaborService.calculate(gaskets);
    let totalCost = 0;

    if (material.type === "sheet") {
      if (material.stocked) {
        totalCost = StockedSheetStrategy.calculate(gaskets, material);
      } else {
        totalCost = NonStockedSheetStrategy.calculate(gaskets, material);
      }
    } else {
      totalCost = RollBillingStrategy.calculate(gaskets, material);
    }

    return { totalCost, totalTime };
  }
}

export default new QuoteOrchestrator();
