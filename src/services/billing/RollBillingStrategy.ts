import { Gasket, Material } from "@/store/quoteStore";
import { BillingStrategy } from "./BillingStrategy";
import YieldService from "../core/YieldService";

class RollBillingStrategy implements BillingStrategy {
  calculate(gaskets: Gasket[], material: Material): number {
    let totalLength = 0;
    
    for (const gasket of gaskets) {
        totalLength += YieldService.calculateRollLength(gasket, material);
    }
    
    const billedLength = Math.ceil(totalLength / 12); // Round up to the next full foot
    const costPerFoot = material.cost; // Assuming cost is per foot for roll material
    
    return billedLength * costPerFoot;
  }
}

export default new RollBillingStrategy();
