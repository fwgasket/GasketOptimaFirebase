import { Gasket, Material } from "@/store/quoteStore";
import { BillingStrategy } from "./BillingStrategy";

class RollBillingStrategy implements BillingStrategy {
  calculate(gaskets: Gasket[], material: Material): number {
    if (!material.width) {
        return 0
    }
    
    let totalLengthInches = 0;
    
    for (const gasket of gaskets) {
        // This is a simplified calculation. The actual implementation would need to consider nesting and orientation.
        if(gasket.shape === "rectangle" && gasket.width && gasket.height) {
            const partsPerRow = Math.floor(material.width / (gasket.width + material.partSpacing));
            if(partsPerRow > 0) {
                const rows = Math.ceil(gasket.quantity / partsPerRow);
                totalLengthInches += rows * (gasket.height + material.partSpacing);
            }
        } else if (gasket.shape === "circle" && gasket.diameter) {
            const partsPerRow = Math.floor(material.width / (gasket.diameter + material.partSpacing));
            if(partsPerRow > 0) {
                const rows = Math.ceil(gasket.quantity / partsPerRow);
                totalLengthInches += rows * (gasket.diameter + material.partSpacing);
            }
        }
    }
    
    const billedFeet = Math.ceil(totalLengthInches / 12);
    const costPerFoot = material.cost / (material.length || 1); // Assuming cost is per total roll length
    
    return billedFeet * costPerFoot;
  }
}

export default new RollBillingStrategy();
