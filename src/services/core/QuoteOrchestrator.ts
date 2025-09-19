import { Gasket, Material } from "@/store/quoteStore";
import LaborService from "./LaborService";
import StockedSheetStrategy from "../billing/StockedSheetStrategy";
import NonStockedSheetStrategy from "../billing/NonStockedSheetStrategy";
import RollBillingStrategy from "../billing/RollBillingStrategy";
import { BillingStrategy } from "../billing/BillingStrategy";

class QuoteOrchestrator {
  calculate(gaskets: Gasket[], material: Material) {
    const totalTime = LaborService.calculate(gaskets);
    
    let billingStrategy: BillingStrategy;

    if (material.type === "roll") {
      billingStrategy = RollBillingStrategy;
    } else if (material.stocked) {
      billingStrategy = StockedSheetStrategy;
    } else {
      billingStrategy = NonStockedSheetStrategy;
    }
    
    const totalCost = billingStrategy.calculate(gaskets, material);

    return {
      totalCost,
      totalTime,
    };
  }
}

export default new QuoteOrchestrator();
